'use client';

import React, { useState, useEffect, useRef } from 'react';
import Container from '@/components/layout/Container';
import s from './Section_05.module.scss';
import { fetchStacks } from '@/api/stack';
import Image from 'next/image';
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

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchStacks();
      setStacks(data);
    };
    loadData();
  }, []);

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

  return (
    <section id="section-05" className={s['section-container']}>
      <Container>
        <div className={s['section-wrap']}>
          <div className={s['title-section']}>
            <div className={s['text-section']}>
              <div className={s['section-title']}>Stacks</div>
              <div className={s['section-text']}>
                기술을 유연하게 받아들이고,
                <br />
                완성도 높은 결과물로 다듬어냅니다.
              </div>
            </div>

            <div className={s['button-section']}>
              <button
                className={`${s['arrow-btn']} ${s['prev']}`}
                onClick={handlePrev}
                aria-label="이전 스택"
              >
                <div className={s['svg-box']}>
                  <LeftArrow width="20" height="20" viewBox="0 0 20 20" />
                </div>
              </button>
              <button
                className={`${s['arrow-btn']} ${s['next']}`}
                onClick={handleNext}
                aria-label="다음 스택"
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
              onMouseDown={onMouseDown}
              onMouseLeave={onMouseLeave}
              onMouseUp={onMouseUp}
              onMouseMove={onMouseMove}
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
