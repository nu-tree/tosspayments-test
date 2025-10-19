import { Prisma, PrismaClient } from '@prisma-client/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prismaClientPropertyName = `__prevent-name-collision__prisma`;

const globalForPrisma = globalThis as unknown as {
  [prismaClientPropertyName]: PrismaClient | undefined;
};

const getPrismaClient = () => {
  if (globalForPrisma[prismaClientPropertyName]) return globalForPrisma[prismaClientPropertyName];

  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });

  const prisma = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== 'production') globalForPrisma[prismaClientPropertyName] = prisma;
  return prisma;
};

export const prisma = getPrismaClient();

export const orSkip = <T>(value: T) => (value !== undefined ? value : undefined);

enum BoardRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

declare global {
  // namespace PrismaJson {
  type BoardFeature = {
    role: {
      edit: BoardRole;
      read: BoardRole;
      delete: BoardRole;
      comment: BoardRole;
    };
    attachment?: {
      maxCount: number;
      maxSize: number;
      allowTypes: string[];
    };
    comment?: {
      maxDepth: number;
    };
    secret?: {
      passwordRequired: boolean;
    };
    captcha?: boolean;
    thumbnail?: {
      width: number;
      height: number;
    };
  };
  // }
}
