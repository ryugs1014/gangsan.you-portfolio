'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LINKS } from './Header';
import ThemeToggle from '@/components/atoms/buttons/ThemeToggle';
import s from './Header.module.scss';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className={s.mobileMenuWrapper}>
      {/* 햄버거 버튼 */}
      <button className={s.hamburgerBtn} onClick={toggleMenu} aria-label="Menu">
        {isOpen ? '✕' : '☰'}
      </button>

      {/* 모바일 오버레이 메뉴 */}
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className={s.mobileOverlay}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <nav className={s.mobileNav}>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  className={s.mobileNavLink}
                  onClick={closeMenu}
                >
                  {link.name}
                </Link>
              ))}

              <div className={s.mobileThemeArea}>
                <span>다크 모드</span>
                <ThemeToggle />
              </div>
            </nav>
          </motion.div>
        ) : (
          (null as any)
        )}
      </AnimatePresence>
    </div>
  );
}
