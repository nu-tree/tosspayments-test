import { redirect } from 'next/navigation';
import { hasSetup } from '@/server/has-setup.server';
import { auth } from '@/lib/auth';
import { OWNER_ORG_SLUG } from '@/hooks/pages/auth/dashboard/constants/owner';
import { headers } from 'next/headers';

export default async function Page() {
  const hasSetupResult = await hasSetup();
  if (hasSetupResult) {
    redirect('/admin');
  }

  await auth.api.createOrganization({
    body: {
      name: 'Site Owner',
      slug: OWNER_ORG_SLUG,
    },
    headers: await headers(),
  });

  redirect('/admin');
}
