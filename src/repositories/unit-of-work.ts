import type { AccountRepository } from "./account-repository";
import type { TransferRepository } from "./transfer-repository";

export type Repositories = {
  accounts: AccountRepository;
  transfers: TransferRepository;
};

export interface UnitOfWork {
  run<T>(work: (repos: Repositories) => Promise<T>): Promise<T>;
}
