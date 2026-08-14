'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import s from './Header.module.scss';
import Link from 'next/link';
import Container from '@/components/layout/Container';
import ThemeToggle from '@/components/atoms/buttons/ThemeToggle';
import MobileMenu from './MobileMenu';

import GithubIcon from '@public/svg/layout/header/github.svg';

export const NAV_LINKS = [
  { name: 'ABOUT', path: '/about' },
  { name: 'WORKS', path: '/works' },
  { name: 'STACKS', path: '/stacks' },
  { name: 'CONTACT', path: '/contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [scrollDirection, setScrollDirection] = useState('up');
  const [isActive, setIsActive] = useState(false);

  const lastScrollY = useRef(0);
  const isReady = useRef(false);

  useEffect(() => {
    const handleHeaderActive = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsActive(customEvent.detail);
    };

    window.addEventListener('header-active', handleHeaderActive);

    return () => {
      window.removeEventListener('header-active', handleHeaderActive);
    };
  }, []);

  useEffect(() => {
    const handleHeaderActive = (e: Event) => {
      if (pathname !== '/') return;

      const customEvent = e as CustomEvent;
      setIsActive(customEvent.detail);
    };

    window.addEventListener('header-active', handleHeaderActive);

    return () => {
      window.removeEventListener('header-active', handleHeaderActive);
    };
  }, [pathname]); // 💡 의존성 배열에 pathname 추가

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const timer = setTimeout(() => {
      isReady.current = true;
    }, 0);

    const handleScroll = () => {
      if (!isReady.current) {
        lastScrollY.current = window.scrollY;
        return;
      }

      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY.current) {
        setScrollDirection('up');
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const clearScrollMemory = () => {
    sessionStorage.removeItem('mainScrollY');
    sessionStorage.removeItem('worksScrollY');
  };

  return (
    <header
      className={`${s['header']} ${scrollDirection === 'down' ? s['down'] : ''} ${isActive ? s['active'] : ''}`}
    >
      <div className={s['header-wrap']}>
        <Container className={s['header-container']}>
          <div className={s['logo-wrap']}>
            <Link
              href="/"
              className={s['logo-link']}
              onClick={clearScrollMemory}
            >
              <div className={s['logo']}>
                <div className={s['logo-main']}>GANGSAN.YOU</div>
                <span className={s['logo-sub']}>FE DEV</span>
              </div>
            </Link>
          </div>

          <nav className={s['nav-wrap']}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={s['nav-link']}
                onClick={clearScrollMemory}
              >
                <button className={s['nav-button']}>{link.name}</button>
              </Link>
            ))}
          </nav>

          <div className={s['function-wrap']}>
            <div className={s['pc-function-wrap']}>
              <div className={s['theme-wrap']}>
                <ThemeToggle />
              </div>

              <Link
                href={'https://github.com/ryugs1014?tab=repositories'}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className={s['lang-wrap']}>
                  <GithubIcon width="32" height="32" viewBox="0 0 32 32" />
                </div>
              </Link>
            </div>

            <MobileMenu />
          </div>
        </Container>
      </div>
    </header>
  );
}
