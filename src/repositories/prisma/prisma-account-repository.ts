import type { PrismaClient } from "@/generated/prisma/client";
import type { AccountRepository } from "../account-repository";

const select = { id: true, owner: true, balance: true } as const;

export class PrismaAccountRepository implements AccountRepository {
  constructor(private readonly db: PrismaClient) {}
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
}
