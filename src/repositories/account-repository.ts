import type { Account } from "@/domain/types";

export interface AccountRepository {
  findAll(): Promise<Account[]>;
  findById(id: string): Promise<Account | null>;
  updateBalance(id: string, newBalance: number): Promise<void>;
}
