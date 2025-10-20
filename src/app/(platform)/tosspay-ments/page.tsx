import { Payments } from "@/components/pages/payments";

export default async function Page({ params, searchParams }: PageProps<'/tosspay-ments'>) {
  return (
    <section>
      <Payments />
    </section>
  )
};

