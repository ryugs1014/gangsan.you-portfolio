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
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

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
          <div className={s['number']}>{progress}</div>
        </motion.div>
      ) : (
        (null as any)
      )}
    </AnimatePresence>
  );
}
