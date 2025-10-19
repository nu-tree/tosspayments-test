import { SignInForm } from '@/components/pages/dashboard/auth/sign-in-form';
import { Card, CardContent } from '@/components/ui/card';

export default async function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header Section */}

        {/* Login Card */}
        <Card className="border bg-white">
          <CardContent className="p-6">
            {/* Card Header */}
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-bold text-gray-900">관리자</h1>
              <p className="text-sm leading-relaxed text-gray-500">
                깔끔하고 안전하며 효율적인 비즈니스 운영을 위한 관리 시스템입니다.
              </p>
            </div>

            {/* Login Form */}
            <SignInForm />

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400">권한이 있는 담당자만 로그인 가능합니다</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
