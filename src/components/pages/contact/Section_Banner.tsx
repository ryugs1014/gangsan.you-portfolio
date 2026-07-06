'use client';

import React, { useRef, useEffect, useState } from 'react';
import s from './Section_Banner.module.scss';
import Spline from '@splinetool/react-spline';
import { useInView } from 'react-intersection-observer';

export default function Section_Banner() {
  const splineApp = useRef<any>(null);

  // ✅ Spline 로딩 완료 상태 추가
  const [isLoaded, setIsLoaded] = useState(false);

  // ✅ 화면에 들어왔는지 감지 (FadeIn 컴포넌트의 기능 가져오기)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // 애니메이션 상태를 관리하는 Ref
  const currentZoom = useRef(0.7);
  const targetZoom = useRef(0.7);
  const rafId = useRef<number | null>(null);

  const onLoad = (spline: any) => {
    splineApp.current = spline;
    spline.setZoom(0.7);

    // ✅ Spline 로드가 완료되면 상태를 true로 변경
    setIsLoaded(true);
  };

  // 부드럽게 값을 변경하는 보간(Lerp) 함수
  const animateZoom = () => {
    if (!splineApp.current) return;

    // 현재 줌에서 목표 줌으로 5%씩 부드럽게 이동 (0.05 조절로 속도 제어 가능)
    currentZoom.current += (targetZoom.current - currentZoom.current) * 0.05;
    splineApp.current.setZoom(currentZoom.current);

    // 목표치에 거의 도달할 때까지 애니메이션 반복
    if (Math.abs(targetZoom.current - currentZoom.current) > 0.001) {
      rafId.current = requestAnimationFrame(animateZoom);
    }
  };

  const handleMouseEnter = () => {
    targetZoom.current = 1; // 목표 줌인 수치
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(animateZoom);
  };

  const handleMouseLeave = () => {
    targetZoom.current = 0.7; // 원래 수치로 복구
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(animateZoom);
  };

  // 컴포넌트 언마운트 시 애니메이션 정리
  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  // ✅ 화면에 보이고(inView) && 로딩도 끝났을 때(isLoaded) true
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
            scene="https://prod.spline.design/MlNLnYASh38kFEZo/scene.splinecode"
            onLoad={onLoad}
          />
        </div>
      </div>
    </div>
  );
}
