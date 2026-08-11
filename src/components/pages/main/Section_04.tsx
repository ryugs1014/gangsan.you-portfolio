'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import s from './Section_04.module.scss';
import Link from 'next/link';
import Container from '@/components/layout/Container';
import { fetchPortfolios } from '@/api/portfolio';
import RightArrowSVG from '@/components/atoms/common/RightArrowSVG';
import Image from 'next/image';
import FadeIn from '@/components/atoms/animation/FadeIn';
import BlackArrow from '@public/svg/common/black-arrow.svg';

interface Portfolio {
  id: string;
  'main-image': string;
  'sub-image': string;
  'font-theme': string;
  category: string;
  'work-title': string;
  'work-explan': string;
  'key-features': string;
  github: string;
  link: string;
  [key: string]: any;
}

export default function Section_04() {
  const router = useRouter();

  const [groupedPortfolios, setGroupedPortfolios] = useState<
    Record<string, Portfolio[]>
  >({});
  const [isUp, setIsUp] = useState(true);
  const lastScrollY = useRef(0);
  const isReady = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section id="section-04" className={s['section-container']}>
      <div className={s['section-wrap']}>
        <Container>
          <div className={s['title-section']}>
            <div className={s['text-section']}>
              <div className={s['section-title']}>프로젝트</div>
              <div className={s['section-text']}>
                고객의 이야기를 가장 가까이에서 듣고,
                <br />
                만족을 넘어서는 경험을 제공해요.
              </div>
            </div>

            <div className={s['button-section']}>
              <Link href={'/works'} className={s['site-link']}>
                <button className={s['more-button']}>
                  <span>자세히 보러가기</span>

                  <RightArrowSVG />
                </button>
              </Link>
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
                    <span>Service</span>
                  </div>
                </div>
              </div>

              <ul className={s['portfolio-list']}>
                {items.map((work) => (
                  <FadeIn key={work.id} threshold={0.2}>
                    <li className={s['portfolio-item']}>
                      <div
                        className={s['item-button']}

                        onClick={() => router.push(`/works/${work.id}`)}
                      >
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

                              {/*{work.github && (*/}
                              {/*  <Link*/}
                              {/*    href={work.github}*/}
                              {/*    target="_blank"*/}
                              {/*    rel="noopener noreferrer"*/}
                              {/*    className={s['out-link']}*/}
                              {/*    onClick={(e) => e.stopPropagation()}*/}
                              {/*  >*/}
                              {/*    GitHub ↗*/}
                              {/*  </Link>*/}
                              {/*)}*/}
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

                        <div
                          className={`${s['work-info']} ${work['font-theme'] === 'dark' ? s['dark'] : ''}`}
                        >
                          <div className={s['info-header']}>
                            <h4 className={s['work-title']}>
                              {work['work-title']}
                            </h4>

                            <p className={s['work-explan']}>
                              {work['work-explan']}
                            </p>
                          </div>

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
                      </div>
                    </li>
                  </FadeIn>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
