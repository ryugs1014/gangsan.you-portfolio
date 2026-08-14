'use client';

import React, { useState, useEffect, useRef } from 'react';
import s from './TabNavigation.module.scss';
import Container from '@/components/layout/Container';
import FadeIn from '@/components/atoms/animation/FadeIn';

export interface TabItem {
  name: string;
  id: string;
}

interface TabNavigationProps {
  tabs: TabItem[];
}

export default function TabNavigation({ tabs }: TabNavigationProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');
  const [isUp, setIsUp] = useState(true);

  const lastScrollY = useRef(0);
  const isReady = useRef(false);
  const tabWrapRef = useRef<HTMLDivElement>(null);

  // =========================================================================
  // 💡 [추가] 클릭으로 인한 강제 스크롤 중인지 판별하기 위한 Ref와 Timer
  // =========================================================================
  const isClickScrolling = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // =========================================================================

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
    const handleActiveTab = () => {
      // 💡 [수정] 클릭해서 이동 중일 때는 위치 계산 로직을 무시하고, 스크롤이 멈출 때까지 기다립니다.
      if (isClickScrolling.current) {
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

        // 스크롤 이벤트가 100ms 동안 멈추면(도착하면) 다시 일반 스크롤 감지를 켭니다.
        scrollTimeoutRef.current = setTimeout(() => {
          isClickScrolling.current = false;
        }, 100);
        return;
      }

      let currentActive = activeTab;

      for (const tab of tabs) {
        const el = document.getElementById(tab.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentActive = tab.id;
          }
        }
      }

      setActiveTab((prev) => (prev !== currentActive ? currentActive : prev));
    };

    window.addEventListener('scroll', handleActiveTab, { passive: true });
    return () => window.removeEventListener('scroll', handleActiveTab);
  }, [activeTab, tabs]);

  useEffect(() => {
    if (!tabWrapRef.current || !activeTab) return;

    const scrollContainer = tabWrapRef.current.parentElement;
    if (!scrollContainer) return;

    const activeBtn = tabWrapRef.current.querySelector(
      `button[data-id="${activeTab}"]`,
    ) as HTMLButtonElement;

    if (activeBtn) {
      const btnRect = activeBtn.getBoundingClientRect();
      const containerRect = scrollContainer.getBoundingClientRect();

      const btnCenter = btnRect.left + btnRect.width / 2;
      const containerCenter = containerRect.left + containerRect.width / 2;

      const scrollAmount = btnCenter - containerCenter;

      scrollContainer.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  }, [activeTab]);

  const handleTabClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const elementTop = element.getBoundingClientRect().top;
      const absolutePosition = elementTop + window.scrollY;

      const isScrollingUp = absolutePosition < window.scrollY;
      const offset = isScrollingUp ? 62 : 0;
      const offsetPosition = absolutePosition - offset;

      // 이미 해당 위치에 있다면 무시
      if (Math.abs(window.scrollY - offsetPosition) < 5) return;

      // 💡 [수정] 클릭 이동 상태 활성화 및 목적지 탭을 즉시 active 시킵니다.
      isClickScrolling.current = true;
      setActiveTab(id);

      const lenis = (window as any).lenisInstance;

      if (lenis) {
        // 💡 1. 데스크탑 (Lenis 활성화 상태)
        lenis.scrollTo(offsetPosition, {
          duration: 1.2,
          force: true, // 기존 이동 중인 애니메이션을 취소하고 강제 이동
          onComplete: () => {
            isClickScrolling.current = false;
          },
        });
      } else {
        // 💡 2. 모바일 (Lenis 미활성화 상태)
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });

        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(() => {
          isClickScrolling.current = false;
        }, 800);
      }
    }
  };

  if (!tabs || tabs.length === 0) return null;

  return (
    <div className={`${s['tab-wrapper']} ${isUp ? s['up'] : ''}`}>
      <FadeIn threshold={0.2}>
        <Container className={s['tab-container']}>
          <div className={s['tab-wrap']} ref={tabWrapRef}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                data-id={tab.id}
                className={`${s['tab-button']} ${activeTab === tab.id ? s['active'] : ''}`}
                onClick={() => handleTabClick(tab.id)}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </Container>
      </FadeIn>
    </div>
  );
}
