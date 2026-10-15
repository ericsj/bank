"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { transferService } from "@/container";
import { DomainError } from "@/domain/errors";
import { parseAmountToCents } from "@/domain/money";

export type TransferFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

const transferSchema = z.object({
  fromAccountId: z.string().min(1),
  toAccountId: z.string().min(1),
  amount: z.string().min(1),
});

export async function transferAction(
  _prev: TransferFormState,
  formData: FormData,
): Promise<TransferFormState> {
  const parsed = transferSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", message: "Fulfill all the fields" };
  }
  try {
    await transferService.transfer({
      fromAccountId: parsed.data.fromAccountId,
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
