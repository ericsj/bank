"use client";
import { useActionState } from "react";
import type { Account } from "@/domain/types";
import { transferAction, type TransferFormState } from "@/app/actions";

const initialState: TransferFormState = { status: "idle", message: "" };

export function TransferForm({ accounts }: { accounts: Account[] }) {
  const [state, formAction, pending] = useActionState(
    transferAction,
    initialState,
  );
  return (
    <form action={formAction} className="card">
      <h2>New Transfer</h2>
      <label>
        From
        <select name="fromAccountId" required>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.owner}
            </option>
          ))}
        </select>
      </label>
      <label>
        To
        <select name="toAccountId" required>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.owner}
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
