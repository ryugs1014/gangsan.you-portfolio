'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <motion.div
        key={pathname}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0, transitionEnd: { display: 'none' } }}
        transition={{
          delay: 0.5,
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
