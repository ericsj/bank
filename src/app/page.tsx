import { Suspense } from "react";
import { connection } from "next/server";
import { accountRepository, transferRepository } from "@/container";
import { formatCents } from "@/domain/money";
import { TransferForm } from "./transfer-form";
import { requireSession } from "@/lib/session";
import { logoutAction } from "./actions";

export default function HomePage() {
  return (
    <main>
      <h1>Banking app</h1>
      <Suspense fallback={<p className="card">Loading accounts...</p>}>
        <AccountSection />
      </Suspense>
      <Suspense fallback={<p className="card">Loading transfers history...</p>}>
        <RecentTransfers />
      </Suspense>
    </main>
  );
}

async function AccountSection() {
  const session = await requireSession();
  const [me, accounts] = await Promise.all([
    accountRepository.findById(session.accountId),
    accountRepository.findAll(),
  ]);
  if (!me) throw new Error("Account from current session was not found");
  const destinations = accounts
    .filter((account) => account.id != me.id)
    .map(({ id, owner }) => ({ id, owner }));
  return (
    <>
      <section className="card">
        <h2>Hellow, {me.owner}</h2>
        <form action={logoutAction}>
          <button type="submit">Logout</button>
        </form>
      </section>
      <p>
        Balance: <strong>{formatCents(me.balance)}</strong>
      </p>
      <TransferForm destinations={destinations} />
    </>
  );
}

async function RecentTransfers() {
  const session = await requireSession();
  const transfersEntriesLimit = 50;
  const transfers = await transferRepository.listByAccount(
    session.accountId,
    transfersEntriesLimit,
  );
  return (
    <>
      <section className="card">
        <h2>Transfers</h2>
        {transfers.length === 0 ? (
          <p>No transfers yet</p>
        ) : (
          <table>
            <tbody>
              {transfers.map((transfer) => (
                <tr key={transfer.id}>
                  <td>{transfer.fromOwner}</td>
                  <td>{transfer.toOwner}</td>
                  <td>{formatCents(transfer.amount)}</td>
                  <td>{transfer.createdAt.toLocaleString("pt-BR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
