import type {
  Account,
  Transfer,
  TransferWithOwners,
  User,
} from "@/domain/types";
import { AccountRepository } from "@/repositories/account-repository";
import {
  NewTransfer,
  TransferRepository,
} from "@/repositories/transfer-repository";
import { Repositories, UnitOfWork } from "@/repositories/unit-of-work";
import { UserRepository } from "@/repositories/user-repository";
import { v4 as uuidv4 } from "uuid";

export class InMemoryAccountRepository implements AccountRepository {
  readonly accountsMap = new Map<string, Account>();
  constructor(accounts: Account[]) {
    for (const account of accounts) {
      this.accountsMap.set(account.id, account);
    }
  }
  async findAll() {
    return Array.from(this.accountsMap.values()).map((account) => ({
      ...account,
    }));
  }
  async findById(id: string): Promise<Account | null> {
    const found = this.accountsMap.get(id);
    return found ? { ...found } : null;
  }
  async lockForUpdate(ids: string[]): Promise<Account[]> {
    return ids.flatMap((id) => {
      const found = this.accountsMap.get(id);
      return found ? [{ ...found }] : [];
    });
  }
  async updateBalance(id: string, newBalance: number): Promise<void> {
    const foundAccount = this.accountsMap.get(id);
    if (!foundAccount) {
      throw new Error(`Account with id ${id} was not found`);
    }
    foundAccount.balance = newBalance;
  }
}

export class InMemoryTransferRepository implements TransferRepository {
  readonly transfers = new Set<Transfer>();
  readonly accounts = new Map<string, Account>();
  constructor(transfers: Transfer[], accounts: Account[]) {
    for (const transfer of transfers) {
      this.transfers.add(transfer);
    }
    for (const account of accounts) {
      this.accounts.set(account.id, account);
    }
  }
  async create(transfer: NewTransfer): Promise<Transfer> {
    const newTransfer: Transfer = {
      id: uuidv4(),
      createdAt: new Date(),
      ...transfer,
    };
    this.transfers.add(newTransfer);
    return newTransfer;
  }
  async listByAccount(
    accountId: string,
    limit: number,
  ): Promise<TransferWithOwners[]> {
    const selectedTransfers = Array.from(this.transfers.values())
      .filter(
        (transfer) =>
          transfer.fromAccountId === accountId ||
          transfer.toAccountId === accountId,
      )
      .map((transfer): TransferWithOwners => {
        const fromAccount = this.accounts.get(transfer.fromAccountId);
        const toAccount = this.accounts.get(transfer.toAccountId);
        if (!fromAccount)
          throw new Error(
            `Found transfer with missing origin account. Account ID: ${transfer.fromAccountId}`,
          );
        if (!toAccount)
          throw new Error(
            `Found transfer with missing destination account. Account ID: ${transfer.toAccountId}`,
          );
        return {
          fromOwner: fromAccount?.owner,
          toOwner: toAccount?.owner,
          ...transfer,
        };
      });
    // number of transfers is higher than the limit -> return limit
    // number of transfers is lower than the limit -> return number of transfers
    return selectedTransfers.slice(
      0,
      Math.min(limit, selectedTransfers.length),
    );
  }
}

export class InMemoryUnitOfWord implements UnitOfWork {
  constructor(private readonly repos: Repositories) {}

  run<T>(work: (repos: Repositories) => Promise<T>): Promise<T> {
    return work(this.repos);
  }
}

export class InMemoryUserRepository implements UserRepository {
  readonly usersMap = new Map<string, User>();
  constructor(users: User[]) {
    for (const user of users) {
      this.usersMap.set(user.email, user);
    }
  }
  async getUser(email: string): Promise<User | null> {
    return this.usersMap.get(email) || null;
  }
}
