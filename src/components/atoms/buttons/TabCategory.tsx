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

  // ✅ 추가: 카테고리 변경 및 스크롤 이동 로직
  const handleTabClick = (category: string) => {
    // 1. 카테고리 상태 변경
    onCategoryChange(category);

    // 2. WorkList 최상단으로 스크롤 이동
    const element = document.getElementById('work-list-section');
    if (element) {
      const elementTop = element.getBoundingClientRect().top;
      const absolutePosition = elementTop + window.scrollY;

      // 상단에 고정되는 헤더(GNB)나 탭 네비게이션 높이를 고려한 여백(offset) 값 설정
      // 화면이 가려진다면 이 숫자를 더 크게 조절해 보세요. (예: 100 -> 150)
      const offset = 100;

      window.scrollTo({
        top: absolutePosition - offset,
        behavior: 'smooth', // 부드럽게 이동
      });
    }
  };

  return (
    <div className={`${s['tab-wrapper']} ${isUp ? s['up'] : ''}`}>
      <FadeIn threshold={0.2}>
        <Container className={s['tab-container']}>
          <div className={s['tab-wrap']}>
            {categories.map((category) => (
              <button
                key={category}
                className={`${s['tab-button']} ${activeCategory === category ? s['active'] : ''}`}
                // ✅ onClick 이벤트에 handleTabClick 함수 연결
                onClick={() => handleTabClick(category)}
              >
                {category.toUpperCase()}
              </button>
            ))}
          </div>
        </Container>
      </FadeIn>
    </div>
  );
}
