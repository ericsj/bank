import { Suspense } from "react";
import { connection } from "next/server";
import { accountRepository, transferRepository } from "@/container";
import { formatCents } from "@/domain/money";
import { TransferForm } from "./transfer-form";

export default function HomePage() {
  return (
    <main>
      <h1>Banking app</h1>
      <Suspense fallback={<p className="card">Loading accounts...</p>}>
        <AccountsSection />
      </Suspense>
      <Suspense fallback={<p className="card">Loading transfers history...</p>}>
        <RecentTransfers />
      </Suspense>
    </main>
  );
}

async function AccountsSection() {
  await connection();
  const accounts = await accountRepository.findAll();
  return (
    <>
      <section className="card">
        <h2>Accounts</h2>
        <table>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id}>
                <td>{account.owner}</td>
                <td className="num">{formatCents(account.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <TransferForm accounts={accounts} />
    </>
  );
}

async function RecentTransfers() {
  await connection();
  const transfersLimit = 50;
  const transfers = await transferRepository.listRecent(transfersLimit);
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
