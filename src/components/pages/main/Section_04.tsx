'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Container from '@/components/layout/Container';
import s from './Section_04.module.scss';
import { fetchPortfolios } from '@/api/portfolio';
import RightArrowSVG from '@/components/atoms/common/RightArrowSVG';

interface Portfolio {
  id: string;
  category: string;
  'work-title': string;
  'work-explan': string;
  'key-features': string;
  github: string;
  link: string;
  [key: string]: any;
}

export default function Section_04() {
  const [groupedPortfolios, setGroupedPortfolios] = useState<
    Record<string, Portfolio[]>
  >({});
  const [isUp, setIsUp] = useState(true);
  const lastScrollY = useRef(0);
  const isReady = useRef(false);

  useEffect(() => {
    const loadData = async () => {
      const data = (await fetchPortfolios()) as Portfolio[];

      const grouped = data.reduce(
        (acc: Record<string, Portfolio[]>, work: Portfolio) => {
          const cat = work.category;
          if (!acc[cat]) {
            acc[cat] = [];
          }
          acc[cat].push(work);
          return acc;
        },
        {} as Record<string, Portfolio[]>,
      );

      setGroupedPortfolios(grouped);
    };

    loadData();
  }, []);

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

  return (
    <section id="section-04" className={s['section-container']}>
      <div className={s['section-wrap']}>
        <Container>
          <div className={s['title-section']}>
            <div className={s['text-section']}>
              <div className={s['section-title']}>Works</div>
              <div className={s['section-text']}>
                고객의 이야기를 가장 가까이에서 듣고,
                <br />
                만족을 넘어서는 경험을 제공해요.
              </div>
            </div>

            <div className={s['button-section']}>
              <button className={s['more-button']}>
                <span>자세히 보러가기</span>

                <RightArrowSVG />
              </button>
            </div>
          </div>
        </Container>

        <div className={s['works-wrap']}>
          {Object.entries(groupedPortfolios).map(([category, items]) => (
            <div key={category} className={s['category-group']}>
              <div className={`${s['category-name']} ${isUp ? s['up'] : ''}`}>
                <div className={s['category-wrap']}>
                  <div className={s['category-content']}>
                    <span>{category}</span>
                    <span>Category</span>
                  </div>
                </div>
              </div>

              <ul className={s['portfolio-list']}>
                {items.map((work) => (
                  <li key={work.id} className={s['portfolio-item']}>
                    <div className={s['work-info']}>
                      <h4 className={s['work-title']}>{work['work-title']}</h4>

                      <p className={s['work-explan']}>{work['work-explan']}</p>

                      <div className={s['key-features']}>
                        {work['key-features']
                          ?.split(',')
                          .map((feature, idx) => (
                            <span key={idx} className={s['features-block']}>
                              {feature.trim()}
                            </span>
                          ))}
                      </div>
                    </div>

                    <div className={s['work-image']}></div>

                    <div className={s['work-links']}>
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

                      <Link
                        href={`/works/${work.id}`}
                        className={s['detail-button']}
                      >
                        <span>상세보기</span>

                        <RightArrowSVG responsivSize={true} />
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
