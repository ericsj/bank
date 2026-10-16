import { Hasher } from "@/services/auth-service";
import bcrypt from "bcryptjs";

export class BcryptHasher implements Hasher {
  verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
