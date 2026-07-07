'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function InitialLoader() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(pathname === '/');
  const [progress, setProgress] = useState(0);

  const hasRunRef = useRef(false);

  // 💡 스크롤 방지 로직 추가
  useEffect(() => {
    if (isLoading) {
      // 로딩 중일 때 스크롤 막기
      document.body.style.overflow = 'hidden';
    } else {
      // 로딩이 끝나면 스크롤 다시 활성화
      document.body.style.overflow = '';
    }

    // 컴포넌트가 언마운트될 때 혹시 모를 상황을 대비해 스크롤을 다시 풀어줍니다.
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoading]);

  useEffect(() => {
    if (hasRunRef.current || pathname !== '/') {
      setIsLoading(false);
      hasRunRef.current = true;
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = prev + 1;

        if (nextProgress >= 100) {
          clearInterval(interval);

          setTimeout(() => {
            setIsLoading(false);
            hasRunRef.current = true;
          }, 500);

          return 100;
        }

        return nextProgress;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [pathname]);

  return (
    <AnimatePresence>
      {isLoading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999999,
            backgroundColor: 'var(--color-bg-normal)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: '20rem', fontWeight: 'bold' }}>
            {progress}
          </div>
        </motion.div>
      ) : (
        (null as any)
      )}
    </AnimatePresence>
  );
}
