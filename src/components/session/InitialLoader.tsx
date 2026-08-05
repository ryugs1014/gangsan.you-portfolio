'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import s from './InitialLoader.module.scss';

export default function InitialLoader() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(pathname === '/');
  const [progress, setProgress] = useState(0);

  const hasRunRef = useRef(false);
  const isVideoLoadedRef = useRef(false);

  useEffect(() => {
    const preventScroll = (e: Event) => {
      e.preventDefault();
    };

    if (isLoading) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      window.addEventListener('touchmove', preventScroll, { passive: false });
      window.addEventListener('wheel', preventScroll, { passive: false });
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'auto';

      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('wheel', preventScroll);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'auto';
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('wheel', preventScroll);
    };
  }, [isLoading]);

  useEffect(() => {
    const handleVideoLoaded = () => {
      isVideoLoadedRef.current = true;
    };
    window.addEventListener('video-loaded', handleVideoLoaded);

    // 안전장치(Fallback): 네트워크 문제로 비디오 로드가 실패하더라도
    // 8초 뒤에는 강제로 로더가 닫히도록 설정 (무한 로딩 방지)
    const fallbackTimer = setTimeout(() => {
      isVideoLoadedRef.current = true;
    }, 8000);

    return () => {
      window.removeEventListener('video-loaded', handleVideoLoaded);
      clearTimeout(fallbackTimer);
    };
  }, []);

  useEffect(() => {
    if (hasRunRef.current || pathname !== '/') {
      setIsLoading(false);
      hasRunRef.current = true;
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        // 비디오가 아직 로드되지 않았다면 99%에서 대기
        if (prev >= 99 && !isVideoLoadedRef.current) {
          return 99;
        }

        // 비디오가 로드되었다면 가속해서 100%로 도달
        const increment = isVideoLoadedRef.current ? 3 : 1;
        const nextProgress = Math.min(prev + increment, 100);

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
          <div className={s['number']}>{progress}</div>
        </motion.div>
      ) : (
        (null as any)
      )}
    </AnimatePresence>
  );
}
