import type { Account } from "@/domain/types";

export interface AccountRepository {
  findAll(): Promise<Account[]>;
  findById(id: string): Promise<Account | null>;
  lockForUpdate(ids: string[]): Promise<Account[]>;
  updateBalance(id: string, newBalance: number): Promise<void>;
}
