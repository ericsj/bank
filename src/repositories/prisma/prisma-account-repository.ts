import { Account } from "@/domain/types";
import { Prisma } from "@/generated/prisma/client";
import type { AccountRepository } from "@/repositories/account-repository";

const select = { id: true, owner: true, balance: true } as const;

export class PrismaAccountRepository implements AccountRepository {
  constructor(private readonly db: Prisma.TransactionClient) {}
  findAll() {
    return this.db.account.findMany({ select, orderBy: { owner: "asc" } });
  }
  findById(id: string) {
    return this.db.account.findUnique({ where: { id }, select });
  }
  async updateBalance(id: string, newBalance: number) {
    await this.db.account.update({
      where: { id },
      data: { balance: newBalance },
    });
  }
  lockForUpdate(ids: string[]): Promise<Account[]> {
    const sorted = [...new Set(ids)].sort();
    return this.db.$queryRaw<Account[]>`
        SELECT id, owner, balance
        FROM "Account"
        WHERE id IN (${Prisma.join(sorted)})
        ORDER BY id
        FOR UPDATE
      `;
  }
}
