import { OpenAPIHono } from '@hono/zod-openapi';
import { confirmPaymentRoute } from '../routes/payments';
import { type ConfirmPaymentBody } from '../schema/payments-schema';
import { apiErrorHelpers } from '../../helpers/api-response';

/**
 * 결제 승인 핸들러
 *
 * 🔐 보안 프로세스:
 * 1. 클라이언트에서 결제 요청 (결제창 오픈)
 * 2. 결제 성공 시 successUrl로 리다이렉트 (paymentKey, orderId, amount 포함)
 * 3. 서버에서 저장된 주문 금액과 클라이언트 금액 비교 (위변조 방지)
 * 4. Toss Payments API로 결제 승인 요청
 * 5. 승인 완료 후 DB에 결제 정보 저장
 */
const confirmPaymentHandler = async (c: any) => {
  try {
    // ============================================================
    // 클라이언트에서 받은 JSON 요청 바디
    // ============================================================
    const body = c.req.valid('json') as ConfirmPaymentBody;
    const { paymentKey, orderId, amount } = body;

    // ============================================================
    // 1. 서버에 저장된 주문 금액과 클라이언트가 보낸 금액 비교
    // ============================================================
    // TODO: DB에서 주문 정보를 조회하여 금액 검증
    // 클라이언트에서 금액을 조작하는 것을 방지하기 위한 필수 검증
    //
    // const order = await prisma.order.findUnique({
    //   where: { orderId },
    // });
    //
    // if (!order) {
    //   return apiErrorHelpers.notFound(c, '주문 정보를 찾을 수 없습니다.');
    // }
    //
    // if (order.amount !== Number(amount)) {
    //   return apiErrorHelpers.badRequest(c, '결제 금액이 일치하지 않습니다.');
    // }

    // ============================================================
    // 2. Toss Payments API로 결제 승인 요청
    // ============================================================
    // 토스페이먼츠 API는 시크릿 키를 사용자 ID로 사용하고, 비밀번호는 사용하지 않습니다.
    // 비밀번호가 없다는 것을 알리기 위해 시크릿 키 뒤에 콜론을 추가합니다.
    const secretKey = process.env.TOSS_PAYMENTS_SECRET_KEY;

    if (!secretKey) {
      console.error('TOSS_PAYMENTS_SECRET_KEY가 설정되지 않았습니다.');
      return apiErrorHelpers.serverError(c, '서버 설정 오류가 발생했습니다.');
    }

    // Base64 인코딩 (시크릿 키 + ':')
    const encryptedSecretKey = 'Basic ' + Buffer.from(`${secretKey}:`).toString('base64');

    // 결제를 승인하면 결제수단에서 금액이 차감됩니다.
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: encryptedSecretKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
        amount: Number(amount),
        paymentKey,
      }),
    });

    const result = await response.json();

    // ============================================================
    // 3. 승인 실패 처리
    // ============================================================
    if (!response.ok) {
      // 결제 실패 비즈니스 로직을 구현하세요.
      console.error('결제 승인 실패:', result);
      return c.json(result, response.status as any);
    }

    // ============================================================
    // 4. 승인 성공 - DB에 결제 정보 저장
    // ============================================================
    // 결제 성공 비즈니스 로직을 구현하세요.
    // TODO: 결제 정보를 DB에 저장
    //
    // await prisma.payment.create({
    //   data: {
    //     paymentKey,
    //     orderId,
    //     amount: Number(amount),
    //     status: result.status,
    //     method: result.method,
    //     approvedAt: result.approvedAt,
    //     requestedAt: result.requestedAt,
    //     receipt: result.receipt,
    //     // 카드 결제인 경우
    //     ...(result.card && {
    //       cardCompany: result.card.company,
    //       cardNumber: result.card.number,
    //       cardType: result.card.cardType,
    //     }),
    //     // 가상계좌인 경우
    //     ...(result.virtualAccount && {
    //       bankCode: result.virtualAccount.bankCode,
    //       accountNumber: result.virtualAccount.accountNumber,
    //     }),
    //   },
    // });
    //
    // // 주문 상태 업데이트
    // await prisma.order.update({
    //   where: { orderId },
    //   data: {
    //     status: 'PAID',
    //     paidAt: new Date(),
    //   },
    // });

    console.log('결제 승인 완료:', result);

    // ============================================================
    // 5. 성공 응답 반환
    // ============================================================
    return c.json(result, response.status as any);
  } catch (error) {
    console.error('결제 승인 중 오류 발생:', error);
    return apiErrorHelpers.serverError(c, '결제 승인 중 서버 오류가 발생했습니다.');
  }
};

// 라우터 생성
export const paymentsRouter = new OpenAPIHono().openapi(confirmPaymentRoute, confirmPaymentHandler);

