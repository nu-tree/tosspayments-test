// 공통 설정을 위한 함수
export const getProviderConfig = (provider: string) => {
  const config: Record<
    string,
    {
      tokenUrl?: string;
      userUrl?: string;
      logoutUrl?: string;
      clientId: string;
      clientSecret: string;
      redirect_uri?: string;
      authorizationUrl?: string;
    }
  > = {
    naver: {
      clientId: process.env.NAVER_CLIENT_ID! || 'clientId',
      clientSecret: process.env.NAVER_CLIENT_SECRET! || 'clientSecret',
      redirect_uri: `${process.env.BASE_URL}/api/auth/callback/naver`,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID! || 'clientId',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET! || 'clientSecret',
      redirect_uri: `${process.env.BASE_URL}/api/auth/callback/google`,
    },
    kakao: {
      clientId: process.env.KAKAO_CLIENT_ID! || 'clientId',
      clientSecret: process.env.KAKAO_CLIENT_SECRET! || 'clientSecret',
      redirect_uri: `${process.env.BASE_URL}/api/auth/callback/kakao`,
    },
  };

  return config[provider];
};
