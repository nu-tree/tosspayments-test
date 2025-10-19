import { prisma } from '@/lib/setting/prisma/prisma.server';
import { createAuthOpenAPIHono, AuthRouteHandler, AuthContext } from '@/lib/hono/types';
import { apiSuccess, apiErrorHelpers } from '@/lib/hono/helpers/api-response';
import { getMyInfo } from '../routes/users';
import { decrypt } from '@/lib/auth/crypto/crypto-utils.server';

// 핸들러 구현
const getMyInfoHandler: AuthRouteHandler<typeof getMyInfo> = async (c: AuthContext) => {
  try {
    const user = c.get('user');
    if (!user) {
      return apiErrorHelpers.unauthorized(c, '사용자를 찾을 수 없습니다.');
    }
    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const decryptedPhoneNumber = userProfile?.phoneNumber ? await decrypt(userProfile?.phoneNumber) : null;

    if (!userProfile) {
      return c.json({ message: '사용자를 찾을 수 없습니다.' }, 404);
    }

    return apiSuccess(c, { data: { ...userProfile, phoneNumber: decryptedPhoneNumber } });
  } catch (error) {
    console.error('사용자 프로필 조회 오류:', error);
    return apiErrorHelpers.serverError(c, '서버 오류가 발생했습니다.');
  }
};

// 라우터 생성
export const usersRouter = createAuthOpenAPIHono()
  .openapi(getMyInfo, getMyInfoHandler);