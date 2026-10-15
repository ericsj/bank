import {
  InvalidAmountError,
  SameAccountError,
  AccountNotFoundError,
  InsufficientFundsError,
} from "@/domain/errors";
import { Transfer } from "@/domain/types";
import { AccountRepository } from "@/repositories/account-repository";
import { TransferRepository } from "@/repositories/transfer-repository";

type TransferInput = {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
};
export class TransferService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly transferRepository: TransferRepository,
  ) {}
  async transfer({
    fromAccountId,
    toAccountId,
    amount,
  }: TransferInput): Promise<Transfer> {
    if (amount <= 0 || Number.isInteger(amount)) {
      throw new InvalidAmountError();
    }
    if (fromAccountId === toAccountId) {
      throw new SameAccountError();
    }
    const fromAccount = await this.accountRepository.findById(fromAccountId);
    if (!fromAccount) {
      throw new AccountNotFoundError(fromAccountId);
    }
    const toAccount = await this.accountRepository.findById(toAccountId);
    if (!toAccount) {
      throw new AccountNotFoundError(toAccountId);
    }
    if (fromAccount.balance < amount) {
      throw new InsufficientFundsError();
    }
    await this.accountRepository.updateBalance(
      fromAccountId,
      fromAccount.balance - amount,
    );
    await this.accountRepository.updateBalance(
      toAccountId,
      toAccount.balance + amount,
    );
    return this.transferRepository.create({
      amount,
      fromAccountId,
      toAccountId,
    });
  }
}
