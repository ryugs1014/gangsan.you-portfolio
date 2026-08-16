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
import PlayIcon from '@public/svg/common/play.svg';
import PauseIcon from '@public/svg/common/pause.svg';

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
  features?: FeatureItem[];
  issues?: IssueItem[];
  next?: {
    id: string;
    title: string;
    color: string;
    theme: string;
  };
  [key: string]: any;
}

const ImageSlider = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);

  if (!images || images.length === 0) return null;

  const handlePrev = () => setCurrentIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => Math.min(images.length - 1, prev + 1));

  const handleDragStart = (clientX: number) => {
    startX.current = clientX;
    setIsDragging(true);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const delta = clientX - startX.current;

    if (
      (currentIndex === 0 && delta > 0) ||
      (currentIndex === images.length - 1 && delta < 0)
    ) {
      setDragOffset(delta * 0.3);
    } else {
      setDragOffset(delta);
    }
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 50;

    if (dragOffset > threshold && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else if (dragOffset < -threshold && currentIndex < images.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }

    setDragOffset(0);
  };

  const onMouseDown = (e: React.MouseEvent) => handleDragStart(e.pageX);
  const onMouseMove = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragMove(e.pageX);
  };
  const onMouseUp = handleDragEnd;
  const onMouseLeave = handleDragEnd;

  const onTouchStart = (e: React.TouchEvent) =>
    handleDragStart(e.touches[0].pageX);
  const onTouchMove = (e: React.TouchEvent) =>
    handleDragMove(e.touches[0].pageX);
  const onTouchEnd = handleDragEnd;

  const isAtStart = currentIndex === 0;
  const isAtEnd = currentIndex === images.length - 1;

  return (
    <div className={s['image-slider-container']}>
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

      <div className={s['slider-wrapper']}>
        <div
          className={`${s['slider-track']} ${isDragging ? s['dragging'] : ''}`}
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

interface WorkDetailProps {
  data: Portfolio;
}

export default function WorkDetail({ data }: WorkDetailProps) {
  const router = useRouter();
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isUp, setIsUp] = useState(true);

  // 미디어 렌더링 상태 관리를 위한 State와 Ref
  const mediaBoxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(false); // 💡 일시정지 상태 추가

  // 데이터 유형 판별 로직
  const hasHoverContent = Boolean(data?.['main-contents']);
  const isVideo = hasHoverContent && data['main-contents']?.includes('/video/');
  const isScrollImage = hasHoverContent && !isVideo;

  const lastScrollY = useRef(0);
  const isReady = useRef(false);
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  // 스크롤 방향 감지 로직
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

  // 화면 중앙 감지 (Intersection Observer)
  useEffect(() => {
    if (!mediaBoxRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 화면의 가상 선(위아래 20%를 제외한 중간 60%) 영역에 닿으면 true
          if (entry.isIntersecting) {
            setIsActive(true);
          } else {
            setIsActive(false);
          }
        });
      },
      {
        rootMargin: '-20% 0px -20% 0px', // 화면 위아래 20%를 트리거 라인으로 설정
        threshold: 0,
      },
    );

    observer.observe(mediaBoxRef.current);
    return () => observer.disconnect();
  }, []);

  // 비디오 재생/정지 제어 (새로고침 시 재생 안되는 이슈 해결)
  useEffect(() => {
    if (isVideo && videoRef.current) {
      //    브라우저 정책(새로고침 시 자동재생 차단)을 우회하기 위해
      //    DOM 요소에 직접 음소거 상태임을 한 번 더 강력하게 못 박아줍니다.
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;

      if (isActive && !isPaused) {
        // 비디오 재생 시도 (비동기 처리)
        const playPromise = videoRef.current.play();

        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            // 로딩이 덜 되었거나 정책에 막혔을 때 에러를 삼키고 넘어갑니다.
            console.warn('Video auto-play prevented:', error);
          });
        }
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive, isVideo, isPaused, isMediaLoaded]); // isMediaLoaded를 추가하여 영상이 준비된 순간 다시 실행되게 함

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
      const headerOffset = 120;
      const lenis = (window as any).lenisInstance;

      if (lenis) {
        lenis.scrollTo(element, {
          offset: -headerOffset,
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
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
    window.dispatchEvent(new Event('trigger-page-exit'));

    setTimeout(() => {
      if (from === 'main' || from === 'works') {
        router.back();
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
      <section className={s['hero-section']}>
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
          <div
            className={s['main-image-box']}
            ref={mediaBoxRef}
            style={{ position: 'relative', overflow: 'hidden' }}
            onClick={() => {
              if (hasHoverContent) setIsPaused(!isPaused);
            }}
          >
            {hasHoverContent && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // 부모(화면) 클릭 이벤트와 겹치지 않게 방지
                  setIsPaused(!isPaused);
                }}
                className={s['control-button']}
              >
                {isPaused ? (
                  <div className={s['svg-box']}>
                    <PlayIcon width="100%" height="100%" viewBox="0 0 36 36" />
                  </div>
                ) : (
                  <div className={s['svg-box']}>
                    <PauseIcon width="100%" height="100%" viewBox="0 0 36 36" />
                  </div>
                )}
              </button>
            )}

            <Image
              src={data['main-image']}
              alt="layout-placeholder"
              width={0}
              height={0}
              sizes="100vw"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                opacity: 0,
              }}
            />

            {!isMediaLoaded && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'var(--color-bg-normal)',
                  zIndex: 2,
                }}
              />
            )}

            {isVideo && (
              <video
                ref={videoRef}
                src={data['main-contents']}
                muted
                loop
                playsInline
                onLoadedData={() => setIsMediaLoaded(true)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: 1,
                }}
              />
            )}

            {isScrollImage && (
              <Image
                src={data['main-contents']!}
                alt={`${data['work-title']} preview`}
                fill
                sizes="100vw"
                style={{ objectFit: 'cover', zIndex: 1 }}
                // 💡 [수정] isPaused 상태일 때 paused 클래스가 추가됨
                className={`${s['hover-image']} ${isActive ? s['scrolling'] : ''} ${isPaused ? s['paused'] : ''}`}
                onLoad={() => setIsMediaLoaded(true)}
                unoptimized={true}
              />
            )}

            {!hasHoverContent && (
              <Image
                src={data['main-image']}
                alt={data['work-title']}
                fill
                sizes="100vw"
                style={{ objectFit: 'cover', zIndex: 1 }}
                onLoad={() => setIsMediaLoaded(true)}
                unoptimized={true}
              />
            )}
          </div>
        </FadeIn>
      </section>

      {data.features?.length || data.issues?.length ? (
        <Container>
          <div className={s['content-with-sidebar']}>
            <aside className={`${s['sidebar']} ${isUp ? s['up'] : ''}`}>
              <nav className={s['sticky-nav']}>
                <button onClick={handleGoBack} className={s['nav-back-btn']}>
                  <span>← 돌아가기</span>
                </button>
                <ul className={s['nav-list']}>
                  <li className={s['nav-item']}>
                    <button onClick={() => scrollToTarget('info-section')}>
                      프로젝트 개요
                    </button>
                  </li>
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
            <div className={s['main-content']}>
              <section id="info-section" className={s['info-section']}>
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

              {data.features && data.features.length > 0 && (
                <section className={s['feature-list-section']}>
                  <FadeIn threshold={0}>
                    <h2 className={s['section-main-title']}>주요 기능</h2>
                  </FadeIn>
                  <div className={s['feature-list-wrapper']}>
                    {data.features.map((feature, idx) => (
                      <FadeIn key={idx} threshold={0}>
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

              {data.issues && data.issues.length > 0 && (
                <section className={s['issue-list-section']}>
                  <FadeIn threshold={0}>
                    <h2 className={s['section-main-title']}>주요 이슈</h2>
                  </FadeIn>
                  <div className={s['issue-list-wrapper']}>
                    {data.issues.map((issue, idx) => (
                      <FadeIn key={idx} threshold={0}>
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
