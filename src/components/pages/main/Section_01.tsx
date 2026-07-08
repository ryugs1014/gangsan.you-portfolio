'use client';

import React, { useRef, useEffect, useState } from 'react';
import s from './Section_01.module.scss';
import Container from '@/components/layout/Container';

export default function Section_01() {
  const headerActiveRef = useRef(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const { top, bottom } = sectionRef.current.getBoundingClientRect();
      const scrollDistance = window.innerHeight * 2;

      let currentProgress = -top / scrollDistance;
      currentProgress = Math.max(0, Math.min(1, currentProgress));
      setProgress(currentProgress);

      const isNowActive = currentProgress === 1 && bottom >= window.innerHeight;
      if (headerActiveRef.current !== isNowActive) {
        headerActiveRef.current = isNowActive;
        // 커스텀 이벤트 발송 (detail에 true/false 값 담기)
        window.dispatchEvent(
          new CustomEvent('header-active', { detail: isNowActive }),
        );
      }

      let currentOpacity = (-top - scrollDistance) / (window.innerHeight * 0.5);
      currentOpacity = Math.max(0, Math.min(1, currentOpacity));
      setOverlayOpacity(currentOpacity);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    handleScroll();
    handleResize();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      // 언마운트 시 Header active 해제 (안전장치)
      window.dispatchEvent(new CustomEvent('header-active', { detail: false }));
    };
  }, []);

  // --- 스크롤 진행도(progress)에 따른 동적 스타일 계산 ---
  const startWidth = isMobile ? '60vw' : '600px';

  const videoWidth = `calc(${startWidth} + (100vw - ${startWidth}) * ${progress})`;

  const videoHeight = `calc(480px + (100% - 480px) * ${progress})`;
  const videoTop = `calc(70% - (70% * ${progress}))`;
  const videoRadius = `${24 * (1 - progress)}px`;

  const titleOpacity = 1 - progress * 2.5;
  const titleTranslateY = `-${progress * 50}px`;

  return (
    <div ref={sectionRef} className={s['section-container']}>
      <div className={s['sticky-wrap']}>
        <Container className={s['title-container']}>
          <h1
            className={s['title']}
            style={{
              opacity: titleOpacity,
              transform: `translateY(${titleTranslateY})`,
            }}
          >
            주어진 환경 안에서
            <br />
            최선을 찾는 개발자
          </h1>
        </Container>

        <div
          className={s['video-wrapper']}
          style={{
            width: videoWidth,
            height: videoHeight,
            top: videoTop,
            borderRadius: videoRadius,
          }}
        >
          <video
            src="/video/main_video.mp4"
            autoPlay
            muted
            loop
            playsInline
            className={s['video-element']}
          />

          <div
            className={s['overlay']}
            style={{
              opacity: overlayOpacity,
              pointerEvents: overlayOpacity > 0 ? 'auto' : 'none',
            }}
          >
            <div className={s['overlay-bg']} />
            <div className={s['overlay-text']}>
              <p>새로운 비전을 제시하는</p>
              <p>프론트엔드 개발자입니다</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
