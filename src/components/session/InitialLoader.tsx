'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function InitialLoader() {
  const pathname = usePathname();
  // 💡 앱이 처음 렌더링될 때 경로가 '/'인 경우에만 초기 로딩을 true로 설정합니다.
  const [isLoading, setIsLoading] = useState(pathname === '/');
  const [progress, setProgress] = useState(0);

  // 💡 사이트 내 이동 시 로딩이 중복으로 뜨지 않도록 추적하는 변수 (새로고침 시 초기화됨)
  const hasRunRef = useRef(false);

  useEffect(() => {
    // 1. 이미 로딩 과정을 거쳤거나, 현재 경로가 메인('/')이 아니면 즉시 로딩을 해제합니다.
    if (hasRunRef.current || pathname !== '/') {
      setIsLoading(false);
      hasRunRef.current = true; // 다른 페이지로 접속한 경우에도 로딩을 스킵한 것으로 간주
      return;
    }

    // 2. 강제 3초 로딩 타이머 설정
    const interval = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = prev + 1;

        // 100%에 도달했을 때
        if (nextProgress >= 100) {
          clearInterval(interval); // 타이머 종료

          // 3. 100%를 0.3초 동안 보여준 뒤 로딩창 제거 및 완료 처리
          setTimeout(() => {
            setIsLoading(false);
            hasRunRef.current = true;
          }, 300);

          return 100;
        }

        return nextProgress;
      });
    }, 10); // (10ms * 100 = 1000ms지만 React 상태 업데이트 지연 고려 시 원하시는 속도에 맞춰 조정 필요)

    return () => clearInterval(interval);
  }, [pathname]); // pathname이 변경될 때마다 검사

  return (
    <AnimatePresence>
      {isLoading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'var(--color-bg-normal)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            {progress}%
          </div>
        </motion.div>
      ) : (
        (null as any)
      )}
    </AnimatePresence>
  );
}
