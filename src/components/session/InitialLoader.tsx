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

  // 스크롤 방지 로직 (기존과 동일)
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

  // 비디오 로드 감지 및 5초 강제 통과
  useEffect(() => {
    const handleVideoLoaded = () => {
      isVideoLoadedRef.current = true;
    };
    window.addEventListener('video-loaded', handleVideoLoaded);

    // 무한 로딩 방지용 안전장치를 8초에서 5초로 단축 (5000ms)
    const fallbackTimer = setTimeout(() => {
      isVideoLoadedRef.current = true;
    }, 5000);

    return () => {
      window.removeEventListener('video-loaded', handleVideoLoaded);
      clearTimeout(fallbackTimer);
    };
  }, []);

  // 숫자 카운팅 로직 (98, 99에서 속도 늦추기)
  useEffect(() => {
    if (hasRunRef.current || pathname !== '/') {
      setIsLoading(false);
      hasRunRef.current = true;
      return;
    }

    // 이미 100에 도달했으면 더 이상 타이머를 돌리지 않음
    if (progress >= 100) return;

    let timer: NodeJS.Timeout;

    const tick = () => {
      // 98에 도달했는데 아직 비디오가 안 불러와졌다면 50ms마다 다시 체크(대기)
      if (progress >= 98 && !isVideoLoadedRef.current) {
        timer = setTimeout(tick, 50);
        return;
      }

      // Math.min을 통해 96 -> 99로 건너뛰지 않고 무조건 98에 딱 멈추도록 보정
      const nextProgress =
        progress < 98
          ? Math.min(progress + 3, 98)
          : Math.min(progress + 1, 100);

      if (nextProgress === 100) {
        setProgress(100);
        setTimeout(() => {
          setIsLoading(false);
          hasRunRef.current = true;
        }, 500); // 100이 된 후 0.5초 대기하고 페이드아웃
      } else {
        setProgress(nextProgress);
      }
    };

    const delay = progress >= 98 ? 400 : 30;
    timer = setTimeout(tick, delay);

    return () => clearTimeout(timer);
  }, [progress, pathname]); // progress가 바뀔 때마다 useEffect가 다시 실행되며 유동적인 속도 적용

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
