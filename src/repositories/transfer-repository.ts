import type { Transfer, TransferWithOwners } from "@/domain/types";

export type NewTransfer = {
  amount: number;
  fromAccountId: string;
  toAccountId: string;
};

export interface TransferRepository {
  create(data: NewTransfer): Promise<Transfer>;
  listByAccount(
    accountId: string,
    limit: number,
  ): Promise<TransferWithOwners[]>;
}
