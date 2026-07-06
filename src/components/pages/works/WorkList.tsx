'use client';

import React from 'react';
import Link from 'next/link';
import Container from '@/components/layout/Container';
import s from './WorkList.module.scss';

export interface Portfolio {
  id: string;
  category: string;
  'work-title': string;
  'work-explan': string;
  'key-features': string;
  github: string;
  link: string;
  [key: string]: any;
}

interface WorkListProps {
  portfolios: Portfolio[];
}

export default function WorkList({ portfolios }: WorkListProps) {
  if (!portfolios || portfolios.length === 0) {
    return (
      <Container>
        <div style={{ padding: '100px 0', textAlign: 'center' }}>
          등록된 포트폴리오가 없습니다.
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <ul className={s['portfolio-list']}>
        {portfolios.map((work) => (
          <li key={work.id} className={s['portfolio-item']}>
            <div className={s['work-image']}>
              <div className={s['web-links']}>
                <a
                  href={work.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s['out-link']}
                >
                  GitHub
                </a>
                <a
                  href={work.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s['site-link']}
                >
                  사이트 방문
                </a>
              </div>
            </div>

            <div className={s['work-info']}>
              <div className={s['title-container']}>
                <h4 className={s['work-title']}>{work['work-title']}</h4>

                <Link href={`/works/${work.id}`} className={s['detail-button']}>
                  →
                </Link>
              </div>

              <p className={s['work-explan']}>{work['work-explan']}</p>
            </div>
          </li>
        ))}
      </ul>
    </Container>
  );
}
