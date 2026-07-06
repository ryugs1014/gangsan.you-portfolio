'use client';

import React, { useState, useEffect, useRef } from 'react';
import Container from '@/components/layout/Container';
import s from './Section_05.module.scss';
import { fetchStacks } from '@/api/stack';
import Image from 'next/image';

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

  const handlePrev = () => {
    if (sliderRef.current && wrapperRef.current) {
      // ✅ sliderRef(화면 전체 넓이)가 아닌 wrapperRef(컨테이너 넓이) 기준으로 1/4 계산
      const cardWidth = wrapperRef.current.clientWidth / 4;
      const currentScroll = sliderRef.current.scrollLeft;

      const targetIndex = Math.ceil((currentScroll - 1) / cardWidth) - 1;

      sliderRef.current.scrollTo({
        left: targetIndex * cardWidth,
        behavior: 'smooth',
      });
    }
  };

  const handleNext = () => {
    if (sliderRef.current && wrapperRef.current) {
      const cardWidth = wrapperRef.current.clientWidth / 4;
      const currentScroll = sliderRef.current.scrollLeft;

      const targetIndex = Math.floor((currentScroll + 1) / cardWidth) + 1;

      sliderRef.current.scrollTo({
        left: targetIndex * cardWidth,
        behavior: 'smooth',
      });
    }
  };

  const snapToGrid = (moved = 0) => {
    if (sliderRef.current && wrapperRef.current) {
      const cardWidth = wrapperRef.current.clientWidth / 4;
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
                ←
              </button>
              <button
                className={`${s['arrow-btn']} ${s['next']}`}
                onClick={handleNext}
                aria-label="다음 스택"
              >
                →
              </button>
            </div>
          </div>

          {/* ✅ wrapperRef 부착 */}
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
