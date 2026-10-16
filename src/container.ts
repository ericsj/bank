import { PrismaAccountRepository } from "@/repositories/prisma/prisma-account-repository";
import { PrismaTransferRepository } from "@/repositories/prisma/prisma-transfer-repository";
import { TransferService } from "@/services/transfer-services";
import { prisma } from "@/lib/prisma";
import { AuthService } from "./services/auth-service";
import { PrismaUserRepository } from "./repositories/prisma/prisma-user-repository";
import { BcryptHasher } from "./lib/bcrypt-hasher";

export const accountRepository = new PrismaAccountRepository(prisma);
export const transferRepository = new PrismaTransferRepository(prisma);
export const userRepository = new PrismaUserRepository(prisma);
const hasher = new BcryptHasher();
export const transferService = new TransferService(
  accountRepository,
  transferRepository,
);
export const authservice = new AuthService(userRepository, hasher);
