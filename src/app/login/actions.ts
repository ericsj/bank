"use server";

import { z } from "zod";
import { InvalidCredentialsError } from "@/domain/errors";
import { createSession } from "@/lib/session";
import { authservice } from "@/container";
import { redirect } from "next/navigation";

export type LoginFormState = { error?: string; email?: string };

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export async function loginAction(
  _prev: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const email = String(formData.get("email") ?? "");
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Inform email and password", email };
  try {
    const session = await authservice.login(
      parsed.data.email,
      parsed.data.password,
    );
    await createSession(session);
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return { error: error.message, email };
    }
    throw error;
  }
  redirect("/");
}
