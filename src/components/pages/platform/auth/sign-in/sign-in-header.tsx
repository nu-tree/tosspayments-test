import Image from 'next/image';
import Link from 'next/link';

/**
 * 로그인 페이지 헤더
 */
export const SignInHeader = () => {
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
      <h1 className="mt-6 text-2xl font-bold tracking-tight">로그인</h1>
      <p className="text-muted-foreground mt-2 text-sm">Meetica에 오신 것을 환영합니다</p>
    </div>
  );
};
