"use server";

import { signIn } from "@/auth";
import { redirect } from "next/navigation";

type LoginState = { error: string | null };

function getCallbackUrl(value: FormDataEntryValue | null): string {
  if (typeof value !== "string") return "/admin";

  const destination = new URL(value, "http://localhost");
  if (
    destination.origin !== "http://localhost" ||
    (destination.pathname !== "/admin" && !destination.pathname.startsWith("/admin/"))
  ) {
    return "/admin";
  }

  return `${destination.pathname}${destination.search}${destination.hash}`;
}

export async function authenticate(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const callbackUrl = getCallbackUrl(formData.get("callbackUrl"));
  const result = await signIn("credentials", {
    email: formData.get("email"),
    password: formData.get("password"),
    redirect: false,
    redirectTo: callbackUrl,
  });

  if (new URL(result, "http://localhost").searchParams.has("error")) {
    return { error: "Credenciales incorrectas" };
  }

  redirect(callbackUrl);
}
