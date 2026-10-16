import type { User } from "@/domain/types";

export interface UserRepository {
  getUser(email: string): Promise<User | null>;
}
