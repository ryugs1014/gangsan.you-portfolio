'use client';

import React, { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/layout/Container';
import s from './WorkDetail.module.scss';
import Image from 'next/image';
import FadeIn from '@/components/atoms/animation/FadeIn';

export interface PortfolioDetailItem {
  'detail-title': string;
  'detail-explan': string;
  'detail-image': string;
}

export interface Portfolio {
  id: string;
  'main-color': string;
  'main-image': string;
  'logo-image': string;
  'work-title': string;
  'full-work-title': string;
  'work-explan': string;
  client: string;
  category: string;
  'work-start': string;
  'work-end': string;
  'work-contribution': string;
  'key-features': string;
  'key-techs': string;
  github: string;
  link: string;
  detail: PortfolioDetailItem[];
  next?: {
    id: string;
    title: string;
  };
  [key: string]: any;
}

interface WorkDetailProps {
  data: Portfolio;
}

export default function WorkDetail({ data }: WorkDetailProps) {
  const router = useRouter();
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ✅ 컴포넌트가 언마운트(다른 페이지로 이동)될 때 혹시 모를 타이머 찌꺼기 제거
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  // ✅ 마우스가 요소 위에 올라왔을 때 (5초 타이머 시작)
  const handleMouseEnter = () => {
    if (!data.next) return;

    hoverTimerRef.current = setTimeout(() => {
      // 5초(5000ms) 뒤에 다음 프로젝트 페이지로 이동
      router.push(`/works/${data.next!.id}`);
    }, 5000);
  };

  // ✅ 마우스가 5초 전에 요소 밖으로 나갔을 때 (타이머 취소)
  const handleMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  if (!data) return null;

  return (
    <article className={s['detail-container']}>
      <section className={s['hero-section']}>
        <div className={s['hero-header']}>
          <FadeIn>
            <h1 className={s['header-title']}>{data['work-title']}</h1>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className={s['action-links']}>
              <a href={'/works'} className={`${s['back-button']}`}>
                ← 목록 돌아가기{' '}
              </a>

              <a
                href={data.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`${s['link-btn']} ${s['primary']}`}
              >
                사이트 방문하기
              </a>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.6}>
          <div className={s['main-image-box']}>
            <Image
              src={data['main-image']}
              alt={data['work-title']}
              width={0}
              height={0}
              sizes="100vw"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>
        </FadeIn>

        {/*<div className={s['logo-box']}>*/}
        {/*  /!* 실제 프로젝트에서는 로고 이미지를 렌더링 *!/*/}
        {/*  <img*/}
        {/*    src={data['logo-image']}*/}
        {/*    alt={data['work-title']}*/}
        {/*    onError={(e) => (e.currentTarget.style.display = 'none')}*/}
        {/*  />*/}
        {/*</div>*/}
      </section>

      <Container>
        <FadeIn threshold={0.2}>
          <section className={s['info-section']}>
            <div className={s['info-grid']}>
              <div className={s['grid-wrap']}>
                <div className={s['info-title']}>
                  <span className={s['value']}>{data['full-work-title']}</span>
                </div>

                <div className={s['info-wrap']}>
                  <div className={s['info-item']}>
                    <span className={s['label']}>클라이언트</span>
                    <span className={s['value']}>{data.client}</span>
                  </div>

                  <div className={s['info-item']}>
                    <span className={s['label']}>카테고리</span>
                    <span className={s['value']}>
                      {data.category.toUpperCase()}
                    </span>
                  </div>

                  <div className={s['info-item']}>
                    <span className={s['label']}>진행 기간</span>
                    <span className={s['value']}>
                      {data['work-start']} ~ {data['work-end']}
                    </span>
                  </div>

                  <div className={s['info-item']}>
                    <span className={s['label']}>기여도</span>
                    <span className={s['value']}>
                      {data['work-contribution']}
                    </span>
                  </div>

                  <div className={s['info-item']}>
                    <span className={s['label']}>주요 기능</span>
                    <div className={s['tags']}>{data['key-features']}</div>
                  </div>

                  <div className={s['info-item']}>
                    <span className={s['label']}>주요 기술</span>
                    <div className={s['tags']}>
                      {data['key-techs']?.split(',').map((feature, idx) => (
                        <span key={idx} className={s['tag']}>
                          {feature.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className={s['grid-wrap']}>
                <p className={s['explan']}>{data['work-explan']}</p>
              </div>

              <div className={s['button-wrap']}>
                <a
                  href={data.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s['out-link']}
                >
                  GitHub
                </a>
                <a
                  href={data.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s['site-link']}
                >
                  사이트 방문
                </a>
              </div>
            </div>
          </section>
        </FadeIn>
      </Container>

      <Container>
        <section className={s['detail-list-section']}>
          {data.detail?.map((item, idx) => (
            <FadeIn key={idx} threshold={0.2}>
              <div className={s['detail-block']}>
                <div className={s['text-area']}>
                  <h3 className={s['detail-title']}>{item['detail-title']}</h3>
                  <p className={s['detail-explan']}>{item['detail-explan']}</p>
                </div>

                <div className={s['detail-image-box']}>
                  <Image
                    src={item['detail-image']}
                    alt={item['detail-title']}
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                    }}
                  />
                </div>
              </div>
            </FadeIn>
          ))}
        </section>
      </Container>

      <Container>
        <FadeIn threshold={0.2}>
          <div className={s['footer-button-section']}>
            <a href={'/works'} className={`${s['footer-back-button']}`}>
              ← 목록 돌아가기{' '}
            </a>
          </div>
        </FadeIn>
      </Container>

      {data.next && (
        <a
          href={`/works/${data.next.id}`}
          className={s['footer-next-section']}
          style={{ '--dynamic-bg': data['main-color'] } as React.CSSProperties}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className={s['next-button-section']}>
            <div className={s['next-button']}>Next Work →</div>

            <span className={s['next-title']}>{data.next.title} </span>
          </div>
        </a>
      )}
    </article>
  );
}
