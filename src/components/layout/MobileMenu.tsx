'use client';

import React, { useState, useEffect } from 'react';
import s from './Header.module.scss';
import Link from 'next/link';
import { NAV_LINKS } from './Header';
import ThemeToggle from '@/components/atoms/buttons/ThemeToggle';

import GithubIcon from '@public/svg/layout/header/github.svg';
import MenuIcon from '@public/svg/layout/header/menu.svg';
import CloseIcon from '@public/svg/layout/header/close.svg';
import RightArrow from '@public/svg/layout/header/right-menu-arrow.svg';
import RotateArrow from '@public/svg/layout/header/rotate-arrow.svg';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);

  // 모달이 열려있을 때 배경 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleMenuClick = () => {
    sessionStorage.removeItem('mainScrollY');
    sessionStorage.removeItem('worksScrollY');
    closeMenu();
  };

  return (
    <>
      <div className={s['mobile-menu-wrapper']}>
        <button
          className={s['menu-button']}
          onClick={openMenu}
          aria-label="Menu"
        >
          <div className={s['menu-wrap']}>
            <MenuIcon width="24" height="24" viewBox="0 0 24 24" />
          </div>
        </button>

        <div className={`${s['mobile-fullscreen']} ${isOpen ? s.open : ''}`}>
          <div className={s['mobile-header']}>
            <div className={s['mobile-actions']}>
              <div className={s['button-wrap']}>
                <div className={s['theme-wrap']}>
                  <ThemeToggle />
                </div>
              </div>

              <div className={s['button-wrap']}>
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
            </div>

            <button
              className={s['close-button']}
              onClick={closeMenu}
              aria-label="Close"
            >
              <div className={s['close-wrap']}>
                <CloseIcon width="24" height="24" viewBox="0 0 24 24" />
              </div>
            </button>
          </div>

          <nav className={s['mobile-nav']}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={s['mobile-nav-link']}
                onClick={handleMenuClick}
              >
                <span> {link.name}</span>

                <div className={s['svg-box']}>
                  <RightArrow width="36" height="36" viewBox="0 0 36 36" />
                </div>
              </Link>
            ))}
          </nav>

          <ul className={s['mobile-footer-wrap']}>
            <li className={s['menu-item']}>
              <Link href="/" className={s['menu-link']}>
                <span>ryugs@gmail.com</span>

                <div className={s['svg-box']}>
                  <RotateArrow width="24" height="24" viewBox="0 0 36 36" />
                </div>
              </Link>
            </li>

            <li className={s['menu-item']}>
              <Link href="/" className={s['menu-link']}>
                <span>GitHub</span>

                <div className={s['svg-box']}>
                  <RotateArrow width="24" height="24" viewBox="0 0 36 36" />
                </div>
              </Link>
            </li>

            <li className={s['copyright']}>GANGSAN.YOU, ALL RIGHTS RESERVED</li>
          </ul>
        </div>
      </div>

      <div
        className={`${s['close-bg']} ${isOpen ? s.open : ''}`}
        onClick={closeMenu}
      />
    </>
  );
}
