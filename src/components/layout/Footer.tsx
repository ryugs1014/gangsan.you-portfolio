'use client';

// components/layout/Footer.tsx
import React from 'react';
import s from './Footer.module.scss';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className={`${s['footer']}`}>
      <div className={s['footer-container']}>
        <ul className={s['footer-wrap']}>
          <li className={s['menu-item']}>
            <Link href="/" className={s['menu-link']}>
              ryugs@gmail.com ↗
            </Link>
          </li>

          <li className={s['menu-item']}>
            <Link href="/" className={s['menu-link']}>
              GitHub ↗
            </Link>
          </li>

          <li className={s['copyright']}>GANGSAN.YOU, ALL RIGHTS RESERVED</li>

          <li className={s['dummy']}></li>
        </ul>
      </div>
    </footer>
  );
}
