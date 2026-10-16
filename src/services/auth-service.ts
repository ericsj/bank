import { InvalidCredentialsError } from "@/domain/errors";
import { Session } from "@/domain/types";
import { UserRepository } from "@/repositories/user-repository";

export interface Hasher {
  verify(password: string, hash: string): Promise<boolean>;
}

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hasher: Hasher,
  ) {}
  async login(email: string, password: string): Promise<Session> {
    const foundUser = await this.userRepository.getUser(
      email.trim().toLowerCase(),
    );
    if (!foundUser) throw new InvalidCredentialsError();
    const verificationResult = await this.hasher.verify(
      password,
      foundUser.passwordHash,
    );
    if (!verificationResult) throw new InvalidCredentialsError();
    return {
      accountId: foundUser.accountId,
      userId: foundUser.id,
    };
  }
}
