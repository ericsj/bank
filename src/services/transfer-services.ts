import {
  InvalidAmountError,
  SameAccountError,
  AccountNotFoundError,
  InsufficientFundsError,
} from "@/domain/errors";
import { Transfer } from "@/domain/types";
import { UnitOfWork } from "@/repositories/unit-of-work";

type TransferInput = {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
};
export class TransferService {
  constructor(private readonly uow: UnitOfWork) {}
  async transfer(transferInput: TransferInput): Promise<Transfer> {
    const { fromAccountId, toAccountId, amount } = transferInput;
    if (amount <= 0) {
      throw new InvalidAmountError();
    }
    if (fromAccountId === toAccountId) {
      throw new SameAccountError();
    }
    return this.uow.run(async ({ accounts, transfers }) => {
      const locked = await accounts.lockForUpdate([fromAccountId, toAccountId]);
      const from = locked.find((account) => account.id === fromAccountId);
      const to = locked.find((account) => account.id === toAccountId);
      if (!from) throw new AccountNotFoundError(fromAccountId);
      if (!to) throw new AccountNotFoundError(toAccountId);
      if (from.balance < amount) throw new InsufficientFundsError();
      await accounts.updateBalance(fromAccountId, from.balance - amount);
      await accounts.updateBalance(toAccountId, to.balance + amount);
      return transfers.create({
        fromAccountId,
        toAccountId,
        amount,
      });
    });
  }
}
