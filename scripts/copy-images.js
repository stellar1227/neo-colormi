import { cp } from 'fs/promises';

try {
  await cp('src/resources/fe/img', 'dist/resources/fe/img', { recursive: true });
  console.log('✅ 이미지 복사 완료!');
} catch (err) {
  console.error('❌ 이미지 복사 실패:', err);
}
