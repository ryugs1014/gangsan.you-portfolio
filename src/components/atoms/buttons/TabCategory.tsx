'use client';

import React, { useState, useEffect, useRef } from 'react';
import s from './TabNavigation.module.scss';
import Container from '@/components/layout/Container';
import FadeIn from '@/components/atoms/animation/FadeIn';

interface TabCategoryProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function TabCategory({
  categories,
  activeCategory,
  onCategoryChange,
}: TabCategoryProps) {
  const [isUp, setIsUp] = useState(true);

  const lastScrollY = useRef(0);
  const isReady = useRef(false);

  // 탭 버튼들을 감싸고 있는 래퍼에 ref 달기
  const tabWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    const timer = setTimeout(() => {
      isReady.current = true;
    }, 0);

    const handleDirection = () => {
      if (!isReady.current) {
        lastScrollY.current = window.scrollY;
        return;
      }
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsUp(false);
      } else if (currentScrollY < lastScrollY.current) {
        setIsUp(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleDirection, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleDirection);
    };
  }, []);

  useEffect(() => {
    if (!tabWrapRef.current || !activeCategory) return;

    // 실제 가로 스크롤바가 생기는 부모 요소(Container)를 타겟으로 잡기
    const scrollContainer = tabWrapRef.current.parentElement;
    if (!scrollContainer) return;

    // data-id 속성으로 현재 활성화된 버튼 요소를 찾기
    const activeBtn = tabWrapRef.current.querySelector(
      `button[data-id="${activeCategory}"]`,
    ) as HTMLButtonElement;

    if (activeBtn) {
      const btnRect = activeBtn.getBoundingClientRect();
      const containerRect = scrollContainer.getBoundingClientRect();

      // 버튼과 스크롤 컨테이너의 화면상 중앙 좌표 계산
      const btnCenter = btnRect.left + btnRect.width / 2;
      const containerCenter = containerRect.left + containerRect.width / 2;

      // 차이만큼만 이동
      const scrollAmount = btnCenter - containerCenter;

      scrollContainer.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  }, [activeCategory]);
  // =========================================================================

  const handleTabClick = (category: string) => {
    if (activeCategory === category) return; // 이미 같은 카테고리면 무시

    // 1. 상태 업데이트
    onCategoryChange(category);

    // 2. 포트폴리오 리스트 최상단으로 스크롤 이동
    const element = document.getElementById('work-list-section');
    if (element) {
      const elementTop = element.getBoundingClientRect().top;
      const absolutePosition = elementTop + window.scrollY;

      // 스크롤 올릴 때/내릴 때 offset 조절 (상단 헤더 여백 확보)
      const isScrollingUp = absolutePosition < window.scrollY;
      const offset = isScrollingUp ? 100 : 50;
      const offsetPosition = absolutePosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={`${s['tab-wrapper']} ${isUp ? s['up'] : ''}`}>
      <FadeIn threshold={0}>
        <Container className={s['tab-container']}>
          <div className={s['tab-wrap']} ref={tabWrapRef}>
            {categories.map((category) => (
              <button
                key={category}
                data-id={category} // DOM에서 요소를 찾기 위해 data-id 주입
                className={`${s['tab-button']} ${activeCategory === category ? s['active'] : ''}`}
                onClick={() => handleTabClick(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </Container>
      </FadeIn>
    </div>
  );
}
