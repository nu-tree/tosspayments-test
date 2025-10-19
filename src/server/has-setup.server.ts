import 'server-only';
import { OWNER_ORG_SLUG } from '@/hooks/pages/auth/dashboard/constants/owner';
import { prisma } from '@/lib/setting/prisma/prisma.server';

export const hasSetup = async () => {
  const result = await prisma.organization.count({
    where: { slug: OWNER_ORG_SLUG },
  });
  return result > 0;
};
