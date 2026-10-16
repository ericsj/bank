import { User } from "@/domain/types";
import type { PrismaClient } from "@/generated/prisma/client";
import type { UserRepository } from "@/repositories/user-repository";

export class PrismaUserRepository implements UserRepository {
    constructor(private readonly db: PrismaClient) {}
    
    getUser(email: string): Promise<User | null> {
        return this.db.user.findUnique({
            where: {
                email
            }
        })
    }
}