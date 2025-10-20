import { PaymentFail } from '@/components/pages/payment-fail';

export default async function Page({ params, searchParams }: PageProps<'/tosspay-ments/fail'>) {
  return <PaymentFail />;
}

