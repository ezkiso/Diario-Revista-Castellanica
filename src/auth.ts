import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { Rol } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";
import { authConfig } from "@/auth.config";
import Redis from "ioredis";

// Redis client for login attempt tracking
const redis = process.env.REDIS_URL 
  ? new Redis(process.env.REDIS_URL, {
      tls: process.env.REDIS_URL.startsWith('rediss://') ? {} : undefined,
      maxRetriesPerRequest: 3,
    })
  : null;

// Fallback to in-memory if Redis is not configured
const loginAttempts = new Map<string, { count: number; resetTime: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_ATTEMPT_WINDOW = 15 * 60; // 15 minutes in seconds

async function checkLoginAttempts(email: string): Promise<{ allowed: boolean; remainingAttempts?: number }> {
  if (redis) {
    try {
      const key = `login:attempts:${email}`;
      const count = await redis.incr(key);
      
      if (count === 1) {
        await redis.expire(key, LOGIN_ATTEMPT_WINDOW);
      }
      
      if (count >= MAX_LOGIN_ATTEMPTS) {
        return { allowed: false };
      }
      
      return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS - count };
    } catch (error) {
      console.error("Redis error, falling back to in-memory:", error);
      // Fallback to in-memory on Redis error
    }
  }
  
  // In-memory fallback
  const now = Date.now();
  const attempts = loginAttempts.get(email);

  if (!attempts || now > attempts.resetTime) {
    loginAttempts.set(email, { count: 1, resetTime: now + LOGIN_ATTEMPT_WINDOW * 1000 });
    return { allowed: true };
  }

  if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
    return { allowed: false };
  }

  return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS - attempts.count };
}

async function recordFailedLogin(email: string) {
  if (redis) {
    try {
      const key = `login:attempts:${email}`;
      await redis.incr(key);
      await redis.expire(key, LOGIN_ATTEMPT_WINDOW);
      return;
    } catch (error) {
      console.error("Redis error, falling back to in-memory:", error);
    }
  }
  
  // In-memory fallback
  const now = Date.now();
  const attempts = loginAttempts.get(email);

  if (!attempts || now > attempts.resetTime) {
    loginAttempts.set(email, { count: 1, resetTime: now + LOGIN_ATTEMPT_WINDOW * 1000 });
  } else {
    attempts.count++;
  }
}

async function recordSuccessfulLogin(email: string) {
  if (redis) {
    try {
      const key = `login:attempts:${email}`;
      await redis.del(key);
      return;
    } catch (error) {
      console.error("Redis error, falling back to in-memory:", error);
    }
  }
  
  // In-memory fallback
  loginAttempts.delete(email);
}

declare module "next-auth" {
  interface User {
    rol: Rol;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      rol: Rol;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    rol: Rol;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const email = parsed.data.email;
        
        // Check login attempts
        const attemptCheck = await checkLoginAttempts(email);
        if (!attemptCheck.allowed) {
          console.warn(`Too many login attempts for email: ${email}`);
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          await recordFailedLogin(email);
          return null;
        }

        const valid = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash
        );
        if (!valid) {
          await recordFailedLogin(email);
          return null;
        }

        await recordSuccessfulLogin(email);
        return {
          id: user.id,
          email: user.email,
          name: user.nombre,
          rol: user.rol,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.rol = user.rol;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.rol = token.rol as Rol;
      }
      return session;
    },
  },
});
