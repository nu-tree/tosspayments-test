import Image from 'next/image';
import Link from 'next/link';

/**
 * 비밀번호 찾기 페이지 헤더
 */
export const ForgotPasswordHeader = () => {
  return (
    <div className="mb-8 text-center">
      <Link href="/" className="inline-block">
        <Image
          src="/logo.png"
          alt="Meetica"
          width={120}
          height={40}
          className="mx-auto h-10 w-auto object-contain"
          priority
        />
      </Link>
      <h1 className="mt-6 text-2xl font-bold tracking-tight">비밀번호 찾기</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        등록된 이메일로 비밀번호 재설정 링크를 보내드립니다
      </p>
    </div>
  );
};
