import type { PrismaClient } from "@/generated/prisma/client";
import type { NewTransfer, TransferRepository } from "../transfer-repository";
import { Transfer, TransferWithOwners } from "@/domain/types";

export class PrismaTransferRepository implements TransferRepository {
  constructor(private readonly db: PrismaClient) {}
  create(data: NewTransfer): Promise<Transfer> {
    return this.db.transfer.create({ data });
  }
  listRecent(limit: number): Promise<TransferWithOwners[]> {
    return this.db.transfer
      .findMany({
        include: {
          fromAccount: {
            select: {
              owner: true,
            },
          },
          toAccount: {
            select: {
              owner: true,
            },
          },
        },
        take: limit,
        orderBy: { createdAt: "asc" },
      })
      .then((listOfTransfers) =>
        listOfTransfers.map(({ fromAccount, toAccount, ...transfer }) => ({
          ...transfer,
          fromOwner: fromAccount.owner,
          toOwner: toAccount.owner,
        })),
      );
  }
}
