'use client';

import React, { useState, useEffect, useRef } from 'react';
import s from './Section_05.module.scss';
import Image from 'next/image';
import Container from '@/components/layout/Container';
import { fetchStacks } from '@/api/stack';
import LeftArrow from '@public/svg/common/slide-left-arrow.svg';
import RightArrow from '@public/svg/common/slide-right-arrow.svg';

interface Stack {
  stack: string;
  detail: string;
  'icon-image': string;
  [key: string]: any;
}

export default function Section_05() {
  const [stacks, setStacks] = useState<Stack[]>([]);

  const sliderRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [isGrabbing, setIsGrabbing] = useState(false);

  // 버튼 활성화/비활성화 상태 관리
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchStacks();
      setStacks(data);
    };
    loadData();
  }, []);

  // --- 스크롤 위치에 따라 버튼 상태 업데이트 ---
  const handleScroll = () => {
    if (!sliderRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;

    // 스크롤이 맨 앞인지 확인 (0 이하)
    setIsAtStart(scrollLeft <= 0);

    // 스크롤이 맨 끝인지 확인 (소수점 오차를 고려해 Math.ceil 사용 또는 여유값 1px 부여)
    setIsAtEnd(Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 1);
  };

  // 데이터가 로드되거나 화면 크기가 바뀔 때 초기 상태 세팅
  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, [stacks]);

  // --- 실제 카드의 너비를 동적으로 계산하는 헬퍼 함수 ---
  const getCardWidth = () => {
    if (!sliderRef.current || !sliderRef.current.firstElementChild) return 0;
    // box-sizing: border-box와 padding이 포함된 요소의 전체 너비를 반환합니다.
    return (sliderRef.current.firstElementChild as HTMLElement).offsetWidth;
  };

  const handlePrev = () => {
    if (sliderRef.current) {
      const cardWidth = getCardWidth();
      if (!cardWidth) return;

      const currentScroll = sliderRef.current.scrollLeft;
      const targetIndex = Math.ceil((currentScroll - 1) / cardWidth) - 1;

      sliderRef.current.scrollTo({
        left: targetIndex * cardWidth,
        behavior: 'smooth',
      });
    }
  };

  const handleNext = () => {
    if (sliderRef.current) {
      const cardWidth = getCardWidth();
      if (!cardWidth) return;

      const currentScroll = sliderRef.current.scrollLeft;
      const targetIndex = Math.floor((currentScroll + 1) / cardWidth) + 1;

      sliderRef.current.scrollTo({
        left: targetIndex * cardWidth,
        behavior: 'smooth',
      });
    }
  };

  const snapToGrid = (moved = 0) => {
    if (sliderRef.current) {
      const cardWidth = getCardWidth();
      if (!cardWidth) return;

      const currentScroll = sliderRef.current.scrollLeft;
      let targetIndex;
      const threshold = 30;

      if (moved > threshold) {
        targetIndex = Math.ceil(currentScroll / cardWidth);
      } else if (moved < -threshold) {
        targetIndex = Math.floor(currentScroll / cardWidth);
      } else {
        targetIndex = Math.round(currentScroll / cardWidth);
      }

      sliderRef.current.scrollTo({
        left: targetIndex * cardWidth,
        behavior: 'smooth',
      });
    }
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;
    isDown.current = true;
    setIsGrabbing(true);
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
  };

  const handleDragEnd = () => {
    if (isDown.current && sliderRef.current) {
      isDown.current = false;
      setIsGrabbing(false);
      const moved = sliderRef.current.scrollLeft - scrollLeft.current;
      snapToGrid(moved);
    }
  };

  const onMouseLeave = handleDragEnd;
  const onMouseUp = handleDragEnd;

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDown.current || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  // ==========================================
  // 터치 이벤트 핸들러 (Mobile / Tablet)
  // ==========================================
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;
    isDown.current = true;
    setIsGrabbing(true);
    // 터치 이벤트는 touches 배열의 첫 번째 요소를 사용합니다.
    startX.current = e.touches[0].pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
  };

  const onTouchEnd = handleDragEnd;
  const onTouchCancel = handleDragEnd;

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDown.current || !sliderRef.current) return;
    const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <section id="section-05" className={s['section-container']}>
      <Container>
        <div className={s['section-wrap']}>
          <div className={s['title-section']}>
            <div className={s['text-section']}>
              <div className={s['section-title']}>기술 · 스택</div>
              <div className={s['section-text']}>
                트렌드를 유연하게 받아들이고,
                <br />
                완성도 높은 결과물로 다듬어냅니다.
              </div>
            </div>

            <div className={s['button-section']}>
              <button
                className={`${s['arrow-btn']} ${s['prev']} ${isAtStart ? s['disabled'] : ''}`}
                onClick={handlePrev}
                aria-label="이전 스택"
                disabled={isAtStart}
              >
                <div className={s['svg-box']}>
                  <LeftArrow width="20" height="20" viewBox="0 0 20 20" />
                </div>
              </button>
              <button
                className={`${s['arrow-btn']} ${s['next']} ${isAtEnd ? s['disabled'] : ''}`}
                onClick={handleNext}
                aria-label="다음 스택"
                disabled={isAtEnd}
              >
                <div className={s['svg-box']}>
                  <RightArrow width="20" height="20" viewBox="0 0 20 20" />
                </div>
              </button>
            </div>
          </div>

          <div className={s['slider-wrapper']} ref={wrapperRef}>
            <div
              ref={sliderRef}
              className={`${s['slider-track']} ${isGrabbing ? s['grabbing'] : ''}`}
              // 마우스 이벤트
              onMouseDown={onMouseDown}
              onMouseLeave={onMouseLeave}
              onMouseUp={onMouseUp}
              onMouseMove={onMouseMove}
              // 터치 이벤트
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onTouchCancel={onTouchCancel}
              onScroll={handleScroll}
            >
              {stacks.map((item, idx) => (
                <div key={idx} className={s['stack-card']}>
                  <div className={s['stack-wrap']}>
                    <div className={s['icon-box']}>
                      <Image
                        src={item['icon-image']}
                        alt={`total`}
                        fill
                        sizes="10vw"
                        style={{
                          objectFit: 'cover',
                        }}
                      />
                    </div>

                    <div className={s['card-info']}>
                      <h3 className={s['stack-name']}>{item.stack}</h3>
                      <p className={s['stack-detail']}>{item.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
