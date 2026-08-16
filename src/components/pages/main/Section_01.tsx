'use client';

import React, { useState, useEffect, useRef } from 'react';
import s from './Section_01.module.scss';
import Container from '@/components/layout/Container';

export default function Section_01() {
  const headerActiveRef = useRef(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(0);
  const [overlayOpacity, setOverlayOpacity] = useState(0);

  const [text1, setText1] = useState({ opacity: 0, translateY: 100 });
  const [text2, setText2] = useState({ opacity: 0, translateY: 100 });
  const [text3, setText3] = useState({ opacity: 0, translateY: 100 });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const { top, bottom } = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollY = -top;

      // 전체 컨테이너가 1000svh이고 sticky가 100svh
      // 실제 스크롤이 작동하는 구간은 0 ~ 900vh

      // 비디오 확장 (0 ~ 150vh 구간)
      let currentProgress = scrollY / (1.5 * vh);
      currentProgress = Math.max(0, Math.min(1, currentProgress));
      setProgress(currentProgress);

      const isNowActive = currentProgress === 1 && bottom >= vh;
      if (headerActiveRef.current !== isNowActive) {
        headerActiveRef.current = isNowActive;
        window.dispatchEvent(
          new CustomEvent('header-active', { detail: isNowActive }),
        );
      }

      // 비디오 확장 후 배경 오버레이 어두워짐 (150vh ~ 200vh 구간)
      let bgOp = (scrollY - 1.5 * vh) / (0.5 * vh);
      setOverlayOpacity(Math.max(0, Math.min(1, bgOp)));

      // --- 첫 번째 텍스트 (200vh ~ 380vh) -> 살짝 단축 ---
      let t1Op = 1;
      let t1Y = 100;
      if (scrollY >= 2.0 * vh && scrollY < 2.6 * vh) {
        t1Y = 100 - ((scrollY - 2.0 * vh) / (0.6 * vh)) * 100; // 올라옴
      } else if (scrollY >= 2.6 * vh && scrollY < 3.3 * vh) {
        t1Y = 0; // 머무름
      } else if (scrollY >= 3.3 * vh && scrollY < 3.8 * vh) {
        t1Y = 0;
        t1Op = 1 - (scrollY - 3.3 * vh) / (0.5 * vh); // 사라짐
      } else if (scrollY >= 3.8 * vh) {
        t1Y = 0;
        t1Op = 0;
      } else if (scrollY < 2.0 * vh) {
        t1Op = 0;
      }
      setText1({ opacity: t1Op, translateY: t1Y });

      // --- 두 번째 텍스트 (410vh ~ 590vh) -> 살짝 단축 ---
      let t2Op = 1;
      let t2Y = 100;
      if (scrollY >= 4.1 * vh && scrollY < 4.7 * vh) {
        t2Y = 100 - ((scrollY - 4.1 * vh) / (0.6 * vh)) * 100; // 올라옴
      } else if (scrollY >= 4.7 * vh && scrollY < 5.4 * vh) {
        t2Y = 0; // 머무름
      } else if (scrollY >= 5.4 * vh && scrollY < 5.9 * vh) {
        t2Y = 0;
        t2Op = 1 - (scrollY - 5.4 * vh) / (0.5 * vh); // 사라짐
      } else if (scrollY >= 5.9 * vh) {
        t2Y = 0;
        t2Op = 0;
      } else if (scrollY < 4.1 * vh) {
        t2Op = 0;
      }
      setText2({ opacity: t2Op, translateY: t2Y });

      // --- 세 번째 텍스트 (620vh ~ 끝) -> 확실하게 넓고 여유로운 구간 확보 ---
      let t3Op = 1;
      let t3Y = 100;
      if (scrollY >= 6.2 * vh && scrollY < 7.2 * vh) {
        t3Y = 100 - ((scrollY - 6.2 * vh) / (1.0 * vh)) * 100; // 천천히 여유롭게 올라옴 (1vh 구간 할당)
      } else if (scrollY >= 7.2 * vh) {
        t3Y = 0;
        t3Op = 1; // 남은 스크롤 구간 동안 아주 넉넉하게 유지됨
      } else if (scrollY < 6.2 * vh) {
        t3Op = 0;
      }
      setText3({ opacity: t3Op, translateY: t3Y });
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
      window.dispatchEvent(new CustomEvent('header-active', { detail: false }));
    };
  }, []);

  const startWidth = isMobile ? '60vw' : '600px';
  const videoWidth = `calc(${startWidth} + (100vw - ${startWidth}) * ${progress})`;
  const videoHeight = `calc(480px + (100% - 480px) * ${progress})`;
  const videoTop = `calc(70% - (70% * ${progress}))`;
  const videoRadius = `${24 * (1 - progress)}px`;

  const titleOpacity = 1 - progress * 2.5;
  const titleTranslateY = `-${progress * 50}px`;

  const handleVideoLoaded = () => {
    window.dispatchEvent(new CustomEvent('video-loaded'));
  };

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
            새로운 변화 속에서
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
            onCanPlayThrough={handleVideoLoaded}
          />

          <div
            className={s['overlay']}
            style={{
              opacity: overlayOpacity,
              pointerEvents: overlayOpacity > 0 ? 'auto' : 'none',
            }}
          >
            <div className={s['overlay-bg']} />

            <div className={s['text-container']}>
              <div
                className={s['overlay-text-wrapper']}
                style={{ opacity: text1.opacity }}
              >
                <div className={s['reveal-box']}>
                  <p style={{ transform: `translateY(${text1.translateY}%)` }}>
                    사용자의 시각에서 생각하는
                  </p>
                </div>
                <div className={s['reveal-box']}>
                  <p style={{ transform: `translateY(${text1.translateY}%)` }}>
                    프론트엔드 개발자입니다
                  </p>
                </div>
              </div>

              <div
                className={s['overlay-text-wrapper']}
                style={{ opacity: text2.opacity }}
              >
                <div className={s['reveal-box']}>
                  <p style={{ transform: `translateY(${text2.translateY}%)` }}>
                    끊임없이 고민하고
                  </p>
                </div>
                <div className={s['reveal-box']}>
                  <p style={{ transform: `translateY(${text2.translateY}%)` }}>
                    최적의 경험을 만듭니다
                  </p>
                </div>
              </div>

              <div
                className={s['overlay-text-wrapper']}
                style={{ opacity: text3.opacity }}
              >
                <div className={s['reveal-box']}>
                  <p style={{ transform: `translateY(${text3.translateY}%)` }}>
                    유연하게 소통하며
                  </p>
                </div>
                <div className={s['reveal-box']}>
                  <p style={{ transform: `translateY(${text3.translateY}%)` }}>
                    서비스의 가치를 높입니다
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
