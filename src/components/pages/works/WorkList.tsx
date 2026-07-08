'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Container from '@/components/layout/Container';
import s from './WorkList.module.scss';
import RightArrowSVG from '@/components/atoms/common/RightArrowSVG';

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
  const router = useRouter();

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
          <li key={work.id} className={s['portfolio-item-wrap']}>
            <div
              className={s['detail-button']}
              onClick={() => router.push(`/works/${work.id}`)}
            >
              <div className={s['portfolio-item']}>
                <div className={s['work-image']}>
                  <div className={s['web-links']}>
                    <Link
                      href={work.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={s['out-link']}
                      onClick={(e) => e.stopPropagation()}
                    >
                      GitHub
                    </Link>
                    <Link
                      href={work.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={s['site-link']}
                      onClick={(e) => e.stopPropagation()}
                    >
                      사이트 방문
                    </Link>
                  </div>
                </div>

                <div className={s['work-info']}>
                  <div className={s['title-container']}>
                    <h4 className={s['work-title']}>{work['work-title']}</h4>

                    <RightArrowSVG responsivSize={true} />
                  </div>

                  <p className={s['work-explan']}>{work['work-explan']}</p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Container>
  );
}
