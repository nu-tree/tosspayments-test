import { OpenAPIHono } from '@hono/zod-openapi';
import { sendOTPRoute, verifyOTPRoute, SendOTPSchema, VerifyOTPSchema } from '../routes/otp';
import { apiSuccess, apiErrorHelpers } from '../../helpers/api-response';
import { sendEmail } from '@/lib/notification-utils';
import { getRedisClient } from '@/lib/redis/redis';

const OTP_EXPIRY = 60 * 10; // 10분

/**
 * 6자리 랜덤 OTP 코드 생성 (영문자 + 숫자)
 */
function generateOTP(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return otp;
}

/**
 * Redis 키 생성
 */
function getOTPKey(email: string): string {
  return `otp:${email}`;
}

export const otpRouter = new OpenAPIHono()
  // OTP 발송
  .openapi(sendOTPRoute, async (c) => {
    try {
      const body = c.req.valid('json') as SendOTPSchema;
      const { email } = body;

      // OTP 코드 생성
      const otp = generateOTP();

      // Redis에 저장 (10분 유효)
      const redis = getRedisClient();
      const key = getOTPKey(email);
      await redis.setex(key, OTP_EXPIRY, otp);

      // 이메일 발송
      const emailResult = await sendEmail({
        email,
        template: 'email-verification',
        emailTemplateProps: { otp },
      });

      if (!emailResult.success) {
        console.error('이메일 발송 실패:', emailResult);
        // Redis에서 OTP 삭제 (이메일 발송 실패 시)
        await redis.del(key);
        return apiErrorHelpers.serverError(c, '이메일 발송에 실패했습니다. 다시 시도해주세요.');
      }

      console.log(`✅ OTP 발송 성공: ${email}, 코드: ${otp}`);

      return apiSuccess(c, {
        message: '인증 코드가 발송되었습니다.',
        expiresIn: OTP_EXPIRY,
      });
    } catch (error) {
      console.error('OTP 발송 오류:', error);
      return apiErrorHelpers.serverError(c, 'OTP 발송에 실패했습니다.');
    }
  })

  // OTP 검증
  .openapi(verifyOTPRoute, async (c) => {
    try {
      const body = c.req.valid('json') as VerifyOTPSchema;
      const { email, code } = body;

      // Redis에서 OTP 조회
      const redis = getRedisClient();
      const key = getOTPKey(email);
      const storedOTP = await redis.get(key);

      if (!storedOTP) {
        return apiErrorHelpers.notFound(c, '인증 코드가 만료되었거나 존재하지 않습니다.');
      }

      // OTP 검증
      if (storedOTP !== code.toUpperCase()) {
        return apiErrorHelpers.badRequest(c, '인증 코드가 일치하지 않습니다.');
      }

      // 검증 성공 - OTP 삭제하고 검증 완료 플래그 저장 (30분 유효)
      await redis.del(key);
      await redis.setex(`otp:verified:${email}`, 60 * 30, 'true');

      return apiSuccess(c, {
        verified: true,
        message: '이메일 인증이 완료되었습니다.',
      });
    } catch (error) {
      console.error('OTP 검증 오류:', error);
      return apiErrorHelpers.serverError(c, 'OTP 검증에 실패했습니다.');
    }
  });

