"use client";
import { useActionState } from "react";
import type { Account, AccountSummary } from "@/domain/types";
import { transferAction, type TransferFormState } from "@/app/actions";

const initialState: TransferFormState = { status: "idle", message: "" };

export function TransferForm({
  destinations,
}: {
  destinations: AccountSummary[];
}) {
  const [state, formAction, pending] = useActionState(
    transferAction,
    initialState,
  );
  return (
    <form action={formAction} className="card">
      <h2>New Transfer</h2>
      <label>
        To
        <select name="toAccountId" required>
          {destinations.map((account) => (
            <option key={account.id} value={account.id}>
              {account.owner}
            </option>
          ))}
        </select>
      </label>
      <label>
        Value
        <input name="amount" inputMode="decimal" placeholder="10,00" required />
      </label>
      <button type="submit" disabled={pending}>
        {pending ? "Sending..." : "Transfer"}
      </button>
      {state.message && (
        <p className={state.status} role="status">
          {state.message}
        </p>
      )}
    </form>
  );
}
