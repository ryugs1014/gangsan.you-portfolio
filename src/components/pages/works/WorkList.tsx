'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Container from '@/components/layout/Container';
import s from './WorkList.module.scss';
import RightArrowSVG from '@/components/atoms/common/RightArrowSVG';
import FadeIn from '@/components/atoms/animation/FadeIn';
import Image from 'next/image';
import BlackArrow from '@public/svg/common/black-arrow.svg';

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          <FadeIn key={work.id} threshold={0.2}>
            <li className={s['portfolio-item-wrap']}>
              <div
                className={s['detail-button']}
                onClick={() => router.push(`/works/${work.id}`)}
              >
                <div className={s['portfolio-item']}>
                  <div className={s['work-image']}>
                    <Image
                      src={
                        isMobile && work['sub-image']
                          ? work['sub-image']
                          : work['main-image']
                      }
                      alt={`${work.id} icon`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ objectFit: 'cover' }}
                      unoptimized={true}
                    />

                    <div className={s['work-links']}>
                      <div className={s['web-links']}>
                        <Link
                          href={work.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={s['site-link']}
                          onClick={(e) => e.stopPropagation()}
                        >
                          사이트 방문 ↗
                        </Link>

                        {/*<Link*/}
                        {/*  href={work.github}*/}
                        {/*  target="_blank"*/}
                        {/*  rel="noopener noreferrer"*/}
                        {/*  className={s['out-link']}*/}
                        {/*  onClick={(e) => e.stopPropagation()}*/}
                        {/*>*/}
                        {/*  GitHub ↗*/}
                        {/*</Link>*/}
                      </div>

                      <Link
                        href={`/works/${work.id}`}
                        className={s['detail-button']}
                      >
                        <span>상세보기</span>

                        <div className={`${s['svg-box']}`}>
                          <BlackArrow
                            width="100%"
                            height="100%"
                            viewBox="0 0 36 36"
                          />
                        </div>
                      </Link>
                    </div>
                  </div>

                  <div className={s['work-info']}>
                    <div className={s['title-wrap']}>
                      <h4 className={s['work-title']}>{work['work-title']}</h4>
                    </div>

                    <p className={s['work-explan']}>{work['work-explan']}</p>
                  </div>
                </div>
              </div>
            </li>
          </FadeIn>
        ))}
      </ul>
    </Container>
  );
}
