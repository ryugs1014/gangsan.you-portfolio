'use client';

import React from 'react';
import s from './Section_02.module.scss';
import Container from '@/components/layout/Container';

export default function Section_02() {
  const BAR_COUNT = 14;
  const bars = Array.from({ length: BAR_COUNT });

  return (
    <div className={s['section-container']}>
      <Container className={s['title-container']}>
        <div className={s['bar-wrapper']}>
          {bars.map((_, i) => (
            <div
              key={i}
              className={s['bar']}
              style={{ '--i': i } as React.CSSProperties}
            />
          ))}
        </div>
      </Container>
    </div>
  );
}
