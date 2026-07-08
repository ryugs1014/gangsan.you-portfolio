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
          <div className={s['number']}>{progress}</div>
        </motion.div>
      ) : (
        (null as any)
      )}
    </AnimatePresence>
  );
}
