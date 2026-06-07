import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export async function getPublishedRevistas() {
  return unstable_cache(
    async () => {
      return prisma.revista.findMany({
        where: { publicada: true },
        orderBy: { anio: "desc" },
        include: {
          _count: { select: { contenidos: true } },
        },
      });
    },
    ["published-revistas"],
    {
      revalidate: 600, // 10 minutos
      tags: ["revistas"]
    }
  )();
}

export async function getLatestRevista() {
  return unstable_cache(
    async () => {
      return prisma.revista.findFirst({
        where: { publicada: true },
        orderBy: { anio: "desc" },
        include: {
          _count: { select: { contenidos: true } },
        },
      });
    },
    ["latest-revista"],
    {
      revalidate: 600, // 10 minutos
      tags: ["revistas"]
    }
  )();
}

export async function getRevistaByAnio(anio: number) {
  return unstable_cache(
    async () => {
      return prisma.revista.findFirst({
        where: { anio, publicada: true },
        include: {
          contenidos: { orderBy: { createdAt: "asc" } },
        },
      });
    },
    ["revista", anio.toString()],
    {
      revalidate: 600, // 10 minutos
      tags: ["revistas", `revista-${anio}`]
    }
  )();
}
