'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation'; // 💡 추가

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // 💡 현재 URL 경로 가져오기

  return (
    <>
      <motion.div
        // 💡 핵심: 경로가 바뀔 때마다 이 태그를 완전히 새로고침하여 애니메이션을 초기화함
        key={pathname}

        initial={{ opacity: 1 }}
        animate={{ opacity: 0, transitionEnd: { display: 'none' } }}
        transition={{
          delay: 0.5, // 💡 팁: 페이지 이동 시 2초 대기는 사이트가 멈춘 것처럼 느껴질 수 있어 0.3초 정도로 줄이는 것을 권장합니다.
          duration: 1.5,
          ease: 'easeInOut',
        }}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'var(--color-bg-normal)',
          zIndex: 999998,
          pointerEvents: 'none',
        }}
      />
      {children}
    </>
  );
}
