'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer'; // 추가
import s from './Section_Banner.module.scss';
import Spline from '@splinetool/react-spline';

export default function Section_Banner() {
  const splineApp = useRef<any>(null);

  const [isLoaded, setIsLoaded] = useState(false);

  // 화면에 들어왔는지 감지 (FadeIn 컴포넌트의 기능 가져오기)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const currentZoom = useRef(0.7);
  const targetZoom = useRef(0.7);
  const rafId = useRef<number | null>(null);

  const onLoad = (spline: any) => {
    splineApp.current = spline;
    spline.setZoom(0.7);

    // Spline 로드가 완료되면 상태를 true로 변경
    setIsLoaded(true);
  };

  const animateZoom = () => {
    if (!splineApp.current) return;
    currentZoom.current += (targetZoom.current - currentZoom.current) * 0.05;
    splineApp.current.setZoom(currentZoom.current);
    if (Math.abs(targetZoom.current - currentZoom.current) > 0.001) {
      rafId.current = requestAnimationFrame(animateZoom);
    }
  };

  const handleMouseEnter = () => {
    targetZoom.current = 1;
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(animateZoom);
  };

  const handleMouseLeave = () => {
    targetZoom.current = 0.7;
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(animateZoom);
  };

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  // 화면에 보이고(inView) && 로딩도 끝났을 때(isLoaded) true
  const showAnimation = inView && isLoaded;

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      className={`${s['section-container']} ${showAnimation ? s['is-visible'] : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={s['fake-image']}>
        <div className={s['spline-wrap']}>
          <Spline
            scene="https://prod.spline.design/a-rknXgGB6z2v7Sk/scene.splinecode"
            onLoad={onLoad}
          />
        </div>
      </div>
    </div>
  );
}
