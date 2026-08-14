'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from '@studio-freight/lenis';

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.innerWidth <= 768) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // 💡 타입 에러를 일으키던 smoothTouch 옵션을 제거했습니다.
      // (제거해도 모바일/터치 기기에서는 기본적으로 스무스 스크롤이 적용되지 않습니다.)
    });

    (window as any).lenisInstance = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    const resizeObserver = new ResizeObserver(() => {
      lenis.resize();
    });

    const wrapper = document.querySelector('.app-wrapper') || document.body;
    resizeObserver.observe(wrapper);

    return () => {
      resizeObserver.disconnect();
      lenis.destroy();
      (window as any).lenisInstance = null;
    };
  }, []);

  useEffect(() => {
    const lenis = (window as any).lenisInstance as Lenis | undefined;

    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
