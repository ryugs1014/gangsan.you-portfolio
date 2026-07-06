'use client';

import React, { useState, useEffect, useRef } from 'react';
import s from './TabNavigation.module.scss';
import Container from '@/components/layout/Container';

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

  const handleTabClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const elementTop = element.getBoundingClientRect().top;
      const absolutePosition = elementTop + window.scrollY;

      const isScrollingUp = absolutePosition < window.scrollY;

      const offset = isScrollingUp ? 62 : 0;
      const offsetPosition = absolutePosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  if (!tabs || tabs.length === 0) return null;

  return (
    <div className={`${s['tab-wrapper']} ${isUp ? s['up'] : ''}`}>
      <Container className={s['tab-container']}>
        <div className={s['tab-wrap']}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${s['tab-button']} ${activeTab === tab.id ? s['active'] : ''}`}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </Container>
    </div>
  );
}
