'use client';

import React, { useRef, useEffect, useState } from 'react';
import s from './Section_01.module.scss';
import Container from '@/components/layout/Container';

export default function Section_01() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [overlayOpacity, setOverlayOpacity] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const { top } = sectionRef.current.getBoundingClientRect();

      // 애니메이션이 진행될 스크롤 거리 (화면 높이의 2배 = 200vh)
      const scrollDistance = window.innerHeight * 2;

      // 1. 기존 비디오 진행도 계산 (0 ~ 1 사이 유지)
      let currentProgress = -top / scrollDistance;
      currentProgress = Math.max(0, Math.min(1, currentProgress));
      setProgress(currentProgress);

      // 2. 새로운 오버레이 텍스트 진행도 계산
      // 비디오가 100%가 되는 지점(-top이 scrollDistance를 넘어설 때)부터 페이드인 시작
      // 화면 높이의 절반(0.5vh) 동안 부드럽게 나타나도록 계산
      let currentOpacity = (-top - scrollDistance) / (window.innerHeight * 0.5);
      currentOpacity = Math.max(0, Math.min(1, currentOpacity));
      setOverlayOpacity(currentOpacity);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 초기 렌더링 시 1회 실행

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- 기존 코드 완벽 유지 ---
  const videoWidth = `calc(600px + (100vw - 600px) * ${progress})`;
  const videoHeight = `calc(1080px + (100vh - 281px) * ${progress})`;
  const videoTop = `calc(125% - (75% * ${progress}))`;
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
              opacity: titleOpacity, // 기존에 계산해두신 투명도 변수만 적용했습니다
              transform: `translateY(${titleTranslateY})`,
            }}
          >
            주어진 환경 안에서
            <br />
            최선을 찾는 개발자
          </h1>
        </Container>

        {/* 비디오 영역 */}
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

          {/* 새로 추가된 배경 및 텍스트 오버레이 */}
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
