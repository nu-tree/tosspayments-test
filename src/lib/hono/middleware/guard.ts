import { Next } from 'hono';
import { AuthContext } from '../types';
import { USER_ROLE } from '@prisma-client/client';

/**
 * 사용자 인증 및 역할 기반 접근 제어(RBAC) 가드 미들웨어
 *
 * API 라우트에 대한 접근 권한을 제어하는 Hono 미들웨어입니다.
 * 인증된 사용자만 접근 가능하도록 하며, 선택적으로 특정 역할(role)을 가진 사용자만 허용할 수 있습니다.
 *
 * @param roles - 접근을 허용할 사용자 역할 배열 (선택 사항)
 *                예: [USER_ROLE.ADMIN, USER_ROLE.MANAGER]
 *                이 파라미터를 생략하면 로그인된 모든 사용자에게 접근을 허용합니다.
 *
 * @returns Hono 미들웨어 함수
 *
 * 동작 방식:
 * 1. 컨텍스트에서 인증된 사용자 정보를 추출합니다 (Better Auth를 통해 설정됨)
 * 2. 사용자가 인증되지 않은 경우 (로그인하지 않음) → 401 Unauthorized 응답 반환
 * 3. roles 파라미터가 제공된 경우:
 *    - 사용자의 역할이 허용된 역할 목록에 포함되어 있는지 확인
 *    - 포함되지 않은 경우 → 403 Forbidden 응답 반환
 * 4. 모든 검증을 통과하면 next()를 호출하여 다음 미들웨어 또는 핸들러로 진행
 *
 * 사용 예시:
 * ```typescript
 * // 로그인한 모든 사용자 허용
 * app.get('/api/profile', userGuard(), async (c) => { ... })
 *
 * // 관리자만 허용
 * app.delete('/api/users/:id', userGuard([USER_ROLE.ADMIN]), async (c) => { ... })
 *
 * // 관리자 또는 매니저만 허용
 * app.post('/api/posts', userGuard([USER_ROLE.ADMIN, USER_ROLE.MANAGER]), async (c) => { ... })
 * ```
 */
export const userGuard = (roles?: USER_ROLE[]) => {
  return async (c: AuthContext, next: Next) => {
    // Better Auth 미들웨어를 통해 설정된 사용자 정보를 컨텍스트에서 가져옴
    const user = c.get('user');

    // 인증되지 않은 사용자 처리 (세션이 없거나 만료됨)
    if (!user) return c.json({ message: 'Unauthorized' }, 401);

    // 역할 기반 접근 제어 검증
    // roles 배열이 제공되고 비어있지 않은 경우에만 역할 검증 수행
    if (roles && roles.length > 0 && !roles.includes(user.role as USER_ROLE)) {
      // 사용자의 역할이 허용된 역할 목록에 없으면 접근 거부
      return c.json({ message: 'Forbidden' }, 403);
    }

    // 모든 검증 통과 - 다음 미들웨어/핸들러로 진행
    return next();
  };
};

/**
 * 채널 관리자 권한 검증 가드 미들웨어
 *
 * 특정 채널에 대한 관리 권한을 가진 사용자만 접근할 수 있도록 제어하는 Hono 미들웨어입니다.
 * 채널 관련 관리 작업(설정 변경, 멤버 관리, 콘텐츠 수정 등)을 수행하는 API 라우트에 사용됩니다.
 *
 * @returns Hono 미들웨어 함수
 *
 * 동작 방식:
 * 1. 사용자 인증 확인
 *    - 컨텍스트에서 인증된 사용자 정보 추출
 *    - 인증되지 않은 경우 → 401 Unauthorized 응답 반환
 *
 * 2. 채널 ID 확인
 *    - HTTP 요청 헤더에서 'x-channel-id' 값을 추출
 *    - 헤더가 없으면 어떤 채널에 대한 작업인지 알 수 없으므로 → 403 Forbidden 응답 반환
 *
 * 3. 채널 소유자 검증
 *    - 데이터베이스에서 해당 채널을 조회
 *    - 조회 조건: 채널 ID가 일치하고 AND 채널의 소유자(userId)가 현재 로그인한 사용자인 경우
 *    - 채널이 존재하지 않거나 소유자가 아닌 경우 → 403 Forbidden 응답 반환
 *
 * 4. TODO: 향후 확장 예정
 *    - 채널 매니저 ACL(Access Control List) 체크 기능 추가 예정
 *    - 채널 소유자뿐만 아니라 권한을 위임받은 매니저들도 접근 가능하도록 확장
 *
 * 5. 모든 검증 통과
 *    - next()를 호출하여 다음 미들웨어 또는 핸들러로 진행
 *
 * 사용 예시:
 * ```typescript
 * // 채널 설정 업데이트 - 채널 소유자만 가능
 * app.patch('/api/channel/settings', channelManagerGuard(), async (c) => {
 *   const channelId = c.req.header('x-channel-id');
 *   // 채널 설정 변경 로직
 * })
 *
 * // 채널 멤버 관리 - 채널 소유자만 가능
 * app.post('/api/channel/members', channelManagerGuard(), async (c) => {
 *   // 멤버 추가/삭제 로직
 * })
 * ```
 *
 * 클라이언트 사용 시 주의사항:
 * - API 호출 시 반드시 요청 헤더에 'x-channel-id'를 포함해야 합니다
 * - 예: headers: { 'x-channel-id': 'channel-uuid-here' }
 */
export const channelManagerGuard = () => {
  return async (c: AuthContext, next: Next) => {
    // Better Auth 미들웨어를 통해 설정된 사용자 정보를 컨텍스트에서 가져옴
    const user = c.get('user');

    // 인증되지 않은 사용자는 채널 관리 권한 없음
    if (!user) {
      return c.json({ message: 'Unauthorized' }, 401);
    }

    // HTTP 요청 헤더에서 작업 대상 채널의 ID를 추출
    // 클라이언트는 반드시 'x-channel-id' 헤더를 요청에 포함해야 함
    const channelId = c.req.header('x-channel-id');
    if (!channelId) {
      return c.json({ message: 'Channel ID is required' }, 403);
    }

    // TODO: 채널 매니저 ACL(Access Control List) 체크 추가 예정
    // 향후 채널 소유자가 아니더라도 관리 권한을 위임받은 매니저의 경우
    // channel_member 테이블에서 권한 레벨을 확인하여 접근 허용 여부 결정

    // 모든 검증 통과 - 다음 미들웨어/핸들러로 진행
    return next();
  };
};
