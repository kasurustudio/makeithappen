"use server";

import { redirect } from "next/navigation";
import { createSession, verifyCredentials } from "@/lib/auth";

export type LoginState = { error?: string };

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "/");

  if (!verifyCredentials(username, password)) {
    return { error: "Username atau password salah." };
  }

  await createSession(username);
  redirect(from.startsWith("/") ? from : "/");
}
