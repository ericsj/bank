import type { PrismaClient } from "@/generated/prisma/client";
import type { Repositories, UnitOfWork } from "../unit-of-work";
import { PrismaAccountRepository } from "./prisma-account-repository";
import { PrismaTransferRepository } from "./prisma-transfer-repository";

export class PrismaUnitOfWork implements UnitOfWork {
  constructor(private readonly prisma: PrismaClient) {}

  run<T>(work: (repos: Repositories) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(
      async (tx) =>
        work({
          accounts: new PrismaAccountRepository(tx),
          transfers: new PrismaTransferRepository(tx),
        }),
      { maxWait: 5_000, timeout: 10_000 },
    );
  }
}
