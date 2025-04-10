import { cp } from 'fs/promises';

try {
  await cp('src/img', 'dist/img', { recursive: true });
  console.log('✅ 이미지 복사 완료!');
} catch (err) {
  console.error('❌ 이미지 복사 실패:', err);
}
