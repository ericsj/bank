import { PrismaAccountRepository } from "@/repositories/prisma/prisma-account-repository";
import { PrismaTransferRepository } from "@/repositories/prisma/prisma-transfer-repository";
import { TransferService } from "@/services/transfer-services";
import { prisma } from "@/lib/prisma";

export const accountRepository = new PrismaAccountRepository(prisma);
export const transferRepository = new PrismaTransferRepository(prisma);
export const transferService = new TransferService(
  accountRepository,
  transferRepository,
);
