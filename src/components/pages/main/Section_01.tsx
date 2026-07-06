'use client';

import React, { useRef, useEffect, useState } from 'react';
import s from './Section_01.module.scss';
import Container from '@/components/layout/Container';

export default function Section_01() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      // 현재 섹션의 화면 상단(viewport) 기준 위치를 가져옵니다.
      const { top } = sectionRef.current.getBoundingClientRect();

      // 애니메이션이 진행될 스크롤 거리 (화면 높이의 2배 = 200vh)
      const scrollDistance = window.innerHeight * 2;

      // 진행도 계산: top이 0 이하로 내려갈 때부터 시작 (음수값을 양수로 변환)
      let currentProgress = -top / scrollDistance;

      // 진행도를 0(시작점) ~ 1(도착점) 사이로 제한
      currentProgress = Math.max(0, Math.min(1, currentProgress));

      setProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 초기 렌더링 시 1회 실행

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- 스크롤 진행도(progress)에 따른 동적 스타일 계산 ---

  // 1. 영상 너비: 500px -> 100vw(전체 화면)
  const videoWidth = `calc(600px + (100vw - 600px) * ${progress})`;

  // 2. 영상 높이: 281px(16:9 비율) -> 100vh(전체 화면)
  const videoHeight = `calc(1080px + (100vh - 281px) * ${progress})`;

  // 3. 위치(위로 올라감): 화면 65% 지점(제목 아래) -> 50% 지점(정중앙)
  const videoTop = `calc(125% - (75% * ${progress}))`;

  // 4. 테두리 둥글기: 24px -> 0px (전체화면일 때는 각지게)
  const videoRadius = `${24 * (1 - progress)}px`;

  // 5. 제목 투명도 및 위로 밀림 효과 (스크롤 절반쯤에 완전히 사라짐)
  const titleOpacity = 1 - progress * 2.5;
  const titleTranslateY = `-${progress * 50}px`;

  return (
    <div ref={sectionRef} className={s['section-container']}>
      {/* 화면에 고정되는 끈적이(Sticky) 래퍼 */}
      <div className={s['sticky-wrap']}>
        {/* 제목 영역 */}
        <Container className={s['title-container']}>
          <h1
            className={s['title']}
            style={{
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
        </div>
      </div>
    </div>
  );
}
