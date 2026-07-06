'use client';

import { useEffect, useState } from 'react';
import s from './ThemeToggle.module.scss';

import DarkIcon from '@public/svg/layout/header/dark-theme.svg';
import LightIcon from '@public/svg/layout/header/light-theme.svg';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 컴포넌트가 브라우저에 마운트되면 로컬 스토리지 값을 읽어옵니다.
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme); // 캐시에 저장
    document.documentElement.setAttribute('data-color-scheme', newTheme); // HTML 속성 변경
  };

  // 💡 Hydration 에러 방지: 브라우저에 마운트되기 전에는 아무것도 보여주지 않습니다.
  if (!mounted) return null;

  return (
    <button className={s['theme-button']} onClick={toggleTheme}>
      {theme === 'light' ? (
        <DarkIcon width="32" height="32" viewBox="0 0 32 32" />
      ) : (
        <LightIcon width="32" height="32" viewBox="0 0 32 32" />
      )}
    </button>
  );
}
