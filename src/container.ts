import { PrismaAccountRepository } from "@/repositories/prisma/prisma-account-repository";
import { PrismaTransferRepository } from "@/repositories/prisma/prisma-transfer-repository";
import { TransferService } from "@/services/transfer-services";
import { prisma } from "@/lib/prisma";
import { AuthService } from "./services/auth-service";
import { PrismaUserRepository } from "./repositories/prisma/prisma-user-repository";
import { BcryptHasher } from "./lib/bcrypt-hasher";
import { PrismaUnitOfWork } from "./repositories/prisma/prisma-unit-of-work";

export const accountRepository = new PrismaAccountRepository(prisma);
export const transferRepository = new PrismaTransferRepository(prisma);
export const userRepository = new PrismaUserRepository(prisma);
export const transferService = new TransferService(
  new PrismaUnitOfWork(prisma),
);
export const authservice = new AuthService(userRepository, new BcryptHasher());
