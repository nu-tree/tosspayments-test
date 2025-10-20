import { PaymentSuccess } from '@/components/pages/payment-success';

export default async function Page({ params, searchParams }: PageProps<'/tosspay-ments/success'>) {
  return <PaymentSuccess />;
}

