import { SetupAdminForm } from '@/components/pages/dashboard/auth/setup-admin-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { hasSetup } from '@/server/has-setup.server';
import { redirect } from 'next/navigation';
export default async function Page() {

  const hasSetupResult = await hasSetup();
  if (hasSetupResult) {
    redirect('/admin');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">사이트 초기 설정</h1>
          <p className="text-gray-600">관리자 계정을 생성하여 쇼핑몰을 시작해보세요</p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4 text-center">
            <CardTitle className="text-xl">관리자 계정 생성</CardTitle>
            <CardDescription>첫 번째 관리자 계정을 설정합니다</CardDescription>
          </CardHeader>
          <CardContent>
            <SetupAdminForm />
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">계정 생성 후 대시보드에서 쇼핑몰을 관리할 수 있습니다</p>
        </div>
      </div>
    </div>
  );
}
