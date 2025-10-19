import { betterAuth, BetterAuthOptions } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { organization } from 'better-auth/plugins';
import { getProviderConfig } from './setting/oauth-provier/get-provider-config';
import { prisma } from './setting/prisma/prisma.server';
import { admin } from 'better-auth/plugins';
import { nextCookies } from 'better-auth/next-js';
import { ac, admin as adminRole, member, owner } from './auth/permissions';
import { BcryptHasher } from './bcrypt-hasher';
import { USER_ROLE } from '@prisma-client/client';
import { decrypt, encrypt } from './auth/crypto/crypto-utils.server';
import { sendEmail } from './notification-utils';

const naverConfig = getProviderConfig('naver');
const googleConfig = getProviderConfig('google');
const kakaoConfig = getProviderConfig('kakao');

const betterAuthConfig = {
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  account: {
    accountLinking: {
      enabled: true,
      allowDifferentEmails: false,
      trustedProviders: ['google', 'naver', 'kakao'],
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (userData) => {
          // 전화번호 암호화
          if (userData.phoneNumber && typeof userData.phoneNumber === 'string') {
            const encryptedPhoneNumber = await encrypt(userData.phoneNumber);
            return {
              data: {
                ...userData,
                phoneNumber: encryptedPhoneNumber,
              },
            };
          }
          return { data: userData };
        },
        after: async (user) => {
          // 첫 번째 사용자인지 확인
          const userCount = await prisma.user.count();
          if (userCount === 1) {
            // 첫 사용자를 admin role로 업데이트
            await prisma.user.update({
              where: { id: user.id },
              data: { role: 'admin' },
            });
            console.log('첫 번째 사용자가 Admin으로 설정되었습니다:', user.email);
          }
        },
      },
      update: {
        before: async (userData) => {
          // 전화번호가 변경되는 경우 암호화
          if (userData.phoneNumber && typeof userData.phoneNumber === 'string') {
            const encryptedPhoneNumber = await encrypt(userData.phoneNumber);
            return {
              data: {
                ...userData,
                phoneNumber: encryptedPhoneNumber,
              },
            };
          }
          return { data: userData };
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          // 사용자 정보 가져와서 전화번호 복호화
          const user = await prisma.user.findUnique({
            where: { id: session.userId },
          });

          if (user && user.phoneNumber) {
            const decryptedPhoneNumber = await decrypt(user.phoneNumber);
            return {
              data: {
                ...session,
                user: {
                  ...user,
                  phoneNumber: decryptedPhoneNumber,
                },
                // activeOrganizationId: result || null,
              },
            };
          }

          return {
            data: {
              ...session,
              user,
              // activeOrganizationId: result || null,
            },
          };
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 4,
    password: {
      hash(password) {
        return BcryptHasher.hash(password);
      },
      verify(data) {
        return BcryptHasher.compare(data.password, data.hash);
      },
    },
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        email: user.email,
        template: 'password-reset',
        emailTemplateProps: { url },
      });
    },
  },
  socialProviders: {
    google: {
      clientId: googleConfig.clientId,
      clientSecret: googleConfig.clientSecret,
      redirectURI: googleConfig.redirect_uri,
    },
    naver: {
      clientId: naverConfig.clientId,
      clientSecret: naverConfig.clientSecret,
      redirectURI: naverConfig.redirect_uri,
    },
    kakao: {
      clientId: kakaoConfig.clientId,
      clientSecret: kakaoConfig.clientSecret,
      redirectURI: kakaoConfig.redirect_uri,
    },
  },
  plugins: [
    admin({
      defaultRole: 'user',
    }),
    nextCookies(),
    organization({
      ac,
      roles: {
        owner,
        admin: adminRole,
        member,
      },
    }),
  ],
  user: {
    additionalFields: {
      phoneNumber: {
        required: false,
        type: 'string',
      },
      role: {
        type: 'string',
        defaultValue: USER_ROLE.user,
        input: true,
      },
    },
  },
} satisfies BetterAuthOptions;

export const auth = betterAuth({
  ...betterAuthConfig,
  plugins: [
    ...(betterAuthConfig.plugins ?? []),

  ],
});


export type AuthType = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};

export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session;
