/**
 * NOTE 기본데이터 시드 입력
 */

import { prisma } from '../../src/lib/setting/prisma/prisma.server';
import { seedTerms } from './terms';

async function main() {
  console.log('🌱 시드 데이터를 시작합니다...');

  // 약관 시딩 실행
  await seedTerms(prisma);

  console.log('✅ 시드 데이터 생성이 완료되었습니다!');
}

main()
  .catch((e) => {
    console.error('❌ 시드 데이터 생성 중 오류가 발생했습니다:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
