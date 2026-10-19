"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { transferService } from "@/container";
import { DomainError } from "@/domain/errors";
import { parseAmountToCents } from "@/domain/money";
import { deleteSession, requireSession } from "@/lib/session";
import { redirect } from "next/navigation";

export type TransferFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

const transferSchema = z.object({
  toAccountId: z.string().min(1),
  amount: z.string().min(1),
});

export async function transferAction(
  _prev: TransferFormState,
  formData: FormData,
): Promise<TransferFormState> {
  const session = await requireSession();
  const fields = {
    toAccountId: String(formData.get("toAccountId") ?? ""),
    amount: String(formData.get("amount") ?? ""),
  };
  const parsed = transferSchema.safeParse(fields);
  if (!parsed.success) {
    return { status: "error", message: "Fulfill all the fields" };
  }
  try {
    await transferService.transfer({
      fromAccountId: session.accountId,
      toAccountId: parsed.data.toAccountId,
      amount: parseAmountToCents(parsed.data.amount),
    });
  } catch (error) {
    if (error instanceof DomainError) {
      return { status: "error", message: error.message };
    }
    throw error;
  }
  revalidatePath("/");
  return { status: "success", message: "Transfer completed" };
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}
