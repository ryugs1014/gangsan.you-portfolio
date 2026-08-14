'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Container from '@/components/layout/Container';
import s from './WorkDetail.module.scss';
import Image from 'next/image';
import FadeIn from '@/components/atoms/animation/FadeIn';
import LeftArrow from '@public/svg/common/left-arrow.svg';
import RightArrow from '@public/svg/common/right-arrow.svg';
import SlideLeftArrow from '@public/svg/common/slide-left-arrow.svg';
import SlideRightArrow from '@public/svg/common/slide-right-arrow.svg';

// 타입 정의
export interface FeatureItem {
  title: string;
  description: string[];
  images?: string[];
}

export interface IssueItem {
  title: string;
  content: string;
  contentImages?: string[];
  cause: string;
  causeImages?: string[];
  solution: string;
  solutionImages?: string[];
  result: string;
  resultImages?: string[];
}

export interface Portfolio {
  id: string;
  'main-color': string;
  'sub-color': string;
  'color-theme': string;
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
  features?: FeatureItem[]; // 변경된 구조
  issues?: IssueItem[]; // 변경된 구조
  next?: {
    id: string;
    title: string;
    color: string;
    theme: string;
  };
  [key: string]: any;
}

// ==========================================
// 가볍고 부드러운 드래그 & 슬라이드 컴포넌트
// ==========================================
const ImageSlider = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);

  if (!images || images.length === 0) return null;

  // 버튼 이동 로직
  const handlePrev = () => setCurrentIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => Math.min(images.length - 1, prev + 1));

  // --- 드래그(스와이프) 시작 ---
  const handleDragStart = (clientX: number) => {
    startX.current = clientX;
    setIsDragging(true);
  };

  // --- 드래그(스와이프) 중 ---
  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const delta = clientX - startX.current;

    // 첫 이미지나 끝 이미지에서 바깥으로 드래그할 때 저항감(텐션) 주기
    if (
      (currentIndex === 0 && delta > 0) ||
      (currentIndex === images.length - 1 && delta < 0)
    ) {
      setDragOffset(delta * 0.3); // 저항감 적용
    } else {
      setDragOffset(delta);
    }
  };

  // --- 드래그(스와이프) 종료 ---
  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 50; // 이 픽셀(px) 이상 넘겨야 다음 이미지로 이동

    if (dragOffset > threshold && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1); // 왼쪽으로 넘김
    } else if (dragOffset < -threshold && currentIndex < images.length - 1) {
      setCurrentIndex((prev) => prev + 1); // 오른쪽으로 넘김
    }

    setDragOffset(0); // 드래그 잔여물 초기화
  };

  // 마우스 이벤트 (PC)
  const onMouseDown = (e: React.MouseEvent) => handleDragStart(e.pageX);
  const onMouseMove = (e: React.MouseEvent) => {
    e.preventDefault(); // 이미지 드래그 고스트 현상 방지
    handleDragMove(e.pageX);
  };
  const onMouseUp = handleDragEnd;
  const onMouseLeave = handleDragEnd;

  // 터치 이벤트 (Mobile)
  const onTouchStart = (e: React.TouchEvent) =>
    handleDragStart(e.touches[0].pageX);
  const onTouchMove = (e: React.TouchEvent) =>
    handleDragMove(e.touches[0].pageX);
  const onTouchEnd = handleDragEnd;

  const isAtStart = currentIndex === 0;
  const isAtEnd = currentIndex === images.length - 1;

  return (
    <div className={s['image-slider-container']}>
      {/* 컨트롤 버튼 */}
      {images.length > 1 && (
        <div className={s['slider-controls']}>
          <span className={s['slide-counter']}>
            {currentIndex + 1} / {images.length}
          </span>
          <button
            className={`${s['arrow-btn']} ${isAtStart ? s['disabled'] : ''}`}
            onClick={handlePrev}
            disabled={isAtStart}
          >
            <SlideLeftArrow width="20" height="20" viewBox="0 0 20 20" />
          </button>
          <button
            className={`${s['arrow-btn']} ${isAtEnd ? s['disabled'] : ''}`}
            onClick={handleNext}
            disabled={isAtEnd}
          >
            <SlideRightArrow width="20" height="20" viewBox="0 0 20 20" />
          </button>
        </div>
      )}

      {/* 슬라이드 영역 */}
      <div className={s['slider-wrapper']}>
        <div
          className={`${s['slider-track']} ${isDragging ? s['dragging'] : ''}`}
          // 드래그 중에는 애니메이션(transition)을 끄고 마우스를 즉각 따라가게 함
          style={{
            transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {images.map((imgSrc, idx) => (
            <div key={idx} className={s['slide-image-item']}>
              <div className={s['image-ratio-box']}>
                <Image
                  src={imgSrc}
                  alt={`feature image ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 80vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 메인 상세 페이지 컴포넌트
// ==========================================
interface WorkDetailProps {
  data: Portfolio;
}

export default function WorkDetail({ data }: WorkDetailProps) {
  const router = useRouter();
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isUp, setIsUp] = useState(true);

  const lastScrollY = useRef(0);
  const isReady = useRef(false);
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

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
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (!data.next) return;
    hoverTimerRef.current = setTimeout(() => {
      window.dispatchEvent(new Event('trigger-page-exit'));
      setTimeout(() => {
        router.push(`/works/${data.next!.id}`);
      }, 600);
    }, 5000);
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  const scrollToTarget = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 120; // 고정 헤더(GNB) 높이 여백

      // 💡 Lenis 인스턴스를 가져옵니다.
      const lenis = (window as any).lenisInstance;

      if (lenis) {
        // Lenis가 존재할 경우: Lenis 전용 scrollTo 사용 (가장 부드럽고 충돌 없음)
        lenis.scrollTo(element, {
          offset: -headerOffset, // 헤더 높이만큼 뺌
          duration: 1.2, // 이동 시간 (초)
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // 부드러운 이징
        });
      } else {
        // Fallback (Lenis가 없을 경우 기본 브라우저 방식)
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }
  };

  const handleGoBack = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new Event('trigger-page-exit')); // 페이드아웃 켜기

    setTimeout(() => {
      if (from === 'main' || from === 'works') {
        router.back(); // 스크롤 기억 복구
      } else {
        router.push('/works');
      }
    }, 600);
  };

  const handleNextClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!data.next) return;
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);

    window.dispatchEvent(new Event('trigger-page-exit'));
    setTimeout(() => {
      router.push(`/works/${data.next!.id}`);
    }, 600);
  };

  if (!data) return null;

  return (
    <article className={s['detail-container']}>
      {/* --- HERO SECTION --- */}
      <section className={s['hero-section']}>
        {/* 기존 Hero 컴포넌트 유지... */}
        <div className={s['hero-header']}>
          <FadeIn>
            <h1 className={s['header-title']}>{data['work-title']}</h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className={s['action-links']}>
              <button
                onClick={handleGoBack}
                className={`${s['back-button']}`}
                data-manual-routing="true"
              >
                <div className={s['svg-box']}>
                  <LeftArrow width="100%" height="100%" viewBox="0 0 36 36" />
                </div>
                <span>목록 돌아가기</span>
              </button>
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
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </FadeIn>
      </section>

      {/* ==========================================
          [사이드바 + 주요기능 + 주요이슈 컨테이너]
      ========================================== */}
      {data.features?.length || data.issues?.length ? (
        <Container>
          <div className={s['content-with-sidebar']}>
            {/* 좌측 Sticky 네비게이션 */}
            <aside className={`${s['sidebar']} ${isUp ? s['up'] : ''}`}>
              <nav className={s['sticky-nav']}>
                {/* 1. 뒤로가기 */}
                <button onClick={handleGoBack} className={s['nav-back-btn']}>
                  {/*<div className={s['svg-box']}>*/}
                  {/*  <LeftArrow width="100%" height="100%" viewBox="0 0 36 36" />*/}
                  {/*</div>*/}
                  <span>← 돌아가기</span>
                </button>

                <ul className={s['nav-list']}>
                  {/* 2. 개요 (Info) */}
                  <li className={s['nav-item']}>
                    <button onClick={() => scrollToTarget('info-section')}>
                      프로젝트 개요
                    </button>
                  </li>

                  {/* 3. 주요 기능 */}
                  {data.features && data.features.length > 0 && (
                    <li className={s['nav-group']}>
                      <span className={s['nav-group-title']}>주요 기능</span>
                      <ul className={s['nav-sub-list']}>
                        {data.features.map((feature, idx) => (
                          <li
                            key={`nav-feat-${idx}`}
                            className={s['nav-sub-item']}
                          >
                            <button
                              onClick={() => scrollToTarget(`feature-${idx}`)}
                            >
                              {feature.title}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </li>
                  )}

                  {/* 4. 주요 이슈 */}
                  {data.issues && data.issues.length > 0 && (
                    <li className={s['nav-group']}>
                      <span className={s['nav-group-title']}>주요 이슈</span>
                      <ul className={s['nav-sub-list']}>
                        {data.issues.map((issue, idx) => (
                          <li
                            key={`nav-issue-${idx}`}
                            className={s['nav-sub-item']}
                          >
                            <button
                              onClick={() => scrollToTarget(`issue-${idx}`)}
                            >
                              {issue.title}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </li>
                  )}
                </ul>
              </nav>
            </aside>

            {/* 우측 메인 콘텐츠 (기능 & 이슈) */}
            <div className={s['main-content']}>
              <section id="info-section" className={s['info-section']}>
                {/* 기존 info-grid 유지... */}
                <div className={s['info-grid']}>
                  <div className={s['grid-wrap']}>
                    <div className={s['info-title']}>
                      <span className={s['value']}>
                        {data['full-work-title']}
                      </span>
                    </div>
                    <div className={s['info-wrap']}>
                      {data.client && (
                        <div className={s['info-item']}>
                          <span className={s['label']}>클라이언트</span>
                          <span className={s['value']}>{data.client}</span>
                        </div>
                      )}
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
                      GitHub ↗
                    </a>
                    <a
                      href={data.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={s['site-link']}
                    >
                      사이트 방문 ↗
                    </a>
                  </div>
                </div>
              </section>

              {/* [주요 기능] SECTION */}
              {data.features && data.features.length > 0 && (
                <section className={s['feature-list-section']}>
                  <FadeIn threshold={0}>
                    <h2 className={s['section-main-title']}>주요 기능</h2>
                  </FadeIn>

                  <div className={s['feature-list-wrapper']}>
                    {data.features.map((feature, idx) => (
                      <FadeIn key={idx} threshold={0}>
                        {/* ✅ 타겟 ID 부여 */}
                        <div
                          id={`feature-${idx}`}
                          className={s['feature-block']}
                        >
                          <div className={s['text-area']}>
                            <h3 className={s['feature-title']}>
                              {idx + 1}. {feature.title}
                            </h3>
                            <div className={s['feature-explan-group']}>
                              {feature.description.map((desc, descIdx) => (
                                <p
                                  key={descIdx}
                                  className={s['feature-explan']}
                                >
                                  {desc}
                                </p>
                              ))}
                            </div>
                          </div>
                          {feature.images && feature.images.length > 0 && (
                            <ImageSlider images={feature.images} />
                          )}
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                </section>
              )}

              {/* [주요 이슈] SECTION */}
              {data.issues && data.issues.length > 0 && (
                <section className={s['issue-list-section']}>
                  <FadeIn threshold={0}>
                    <h2 className={s['section-main-title']}>주요 이슈</h2>
                  </FadeIn>

                  <div className={s['issue-list-wrapper']}>
                    {data.issues.map((issue, idx) => (
                      <FadeIn key={idx} threshold={0}>
                        {/* ✅ 타겟 ID 부여 */}
                        <div id={`issue-${idx}`} className={s['issue-block']}>
                          <div className={s['issue-row']}>
                            <h3 className={s['issue-title']}>{issue.title}</h3>
                            <p className={s['issue-content']}>
                              {issue.content}
                            </p>
                            {issue.contentImages &&
                              issue.contentImages.length > 0 && (
                                <div className={s['issue-sequential-images']}>
                                  {issue.contentImages.map((imgSrc, i) => (
                                    <div
                                      key={i}
                                      className={s['sequential-image-box']}
                                    >
                                      <Image
                                        src={imgSrc}
                                        alt={`content image ${i + 1}`}
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
                                  ))}
                                </div>
                              )}
                          </div>

                          <div className={s['issue-details-box']}>
                            <div className={s['issue-row']}>
                              <h4 className={s['issue-label']}>이슈 원인</h4>
                              <p className={s['issue-desc']}>{issue.cause}</p>
                              {issue.causeImages &&
                                issue.causeImages.length > 0 && (
                                  <div className={s['issue-sequential-images']}>
                                    {issue.causeImages.map((imgSrc, i) => (
                                      <div
                                        key={i}
                                        className={s['sequential-image-box']}
                                      >
                                        <Image
                                          src={imgSrc}
                                          alt={`cause image ${i + 1}`}
                                          width={0}
                                          height={0}
                                          sizes="100vw"
                                          style={{
                                            width: '100%',
                                            height: 'auto',
                                            display: 'block',
                                            borderRadius: '12px',
                                          }}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                )}
                            </div>

                            <div className={s['issue-row']}>
                              <h4 className={s['issue-label']}>해결 과정</h4>
                              <p className={s['issue-desc']}>
                                {issue.solution}
                              </p>
                              {issue.solutionImages &&
                                issue.solutionImages.length > 0 && (
                                  <div className={s['issue-sequential-images']}>
                                    {issue.solutionImages.map((imgSrc, i) => (
                                      <div
                                        key={i}
                                        className={s['sequential-image-box']}
                                      >
                                        <Image
                                          src={imgSrc}
                                          alt={`solution image ${i + 1}`}
                                          width={0}
                                          height={0}
                                          sizes="100vw"
                                          style={{
                                            width: '100%',
                                            height: 'auto',
                                            display: 'block',
                                            borderRadius: '12px',
                                          }}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                )}
                            </div>

                            <div className={s['issue-row']}>
                              <h4 className={s['issue-label']}>결과</h4>
                              <p className={s['issue-desc']}>{issue.result}</p>
                              {issue.resultImages &&
                                issue.resultImages.length > 0 && (
                                  <div className={s['issue-sequential-images']}>
                                    {issue.resultImages.map((imgSrc, i) => (
                                      <div
                                        key={i}
                                        className={s['sequential-image-box']}
                                      >
                                        <Image
                                          src={imgSrc}
                                          alt={`result image ${i + 1}`}
                                          width={0}
                                          height={0}
                                          sizes="100vw"
                                          style={{
                                            width: '100%',
                                            height: 'auto',
                                            display: 'block',
                                            borderRadius: '12px',
                                          }}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </Container>
      ) : null}

      {/* --- FOOTER BUTTON --- */}
      <Container>
        <FadeIn threshold={0}>
          <div className={s['footer-button-section']}>
            <button
              onClick={handleGoBack}
              className={`${s['footer-back-button']}`}
            >
              <div className={s['svg-box']}>
                <LeftArrow width="100%" height="100%" viewBox="0 0 36 36" />
              </div>
              <span>목록 돌아가기</span>
            </button>
          </div>
        </FadeIn>
      </Container>

      {/* --- NEXT PROJECT --- */}
      {data.next && (
        <a
          href={`/works/${data.next.id}`}
          className={`${s['footer-next-section']} ${data.next['theme'] == 'dark' ? s['dark'] : s['light']}`}
          style={{ '--dynamic-bg': data.next['color'] } as React.CSSProperties}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleNextClick}
          data-manual-routing="true"
        >
          <div className={s['next-button-section']}>
            <div className={s['next-button']}>
              <span>Next Work</span>
              <div className={s['svg-box']}>
                <RightArrow width="100%" height="100%" viewBox="0 0 36 36" />
              </div>
            </div>
            <span className={s['next-title']}>{data.next.title} </span>
          </div>
        </a>
      )}
    </article>
  );
}
