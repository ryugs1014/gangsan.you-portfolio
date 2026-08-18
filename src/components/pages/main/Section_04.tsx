'use client';

import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import s from './Section_04.module.scss';
import Link from 'next/link';
import { fetchPortfolios } from '@/api/portfolio';
import RightArrowSVG from '@/components/atoms/common/RightArrowSVG';
import Image from 'next/image';
import FadeInPortfolio from '@/components/atoms/animation/FadeInPortfolio';
import FadeInMain from '@/components/atoms/animation/FadeInMain';
import ApkDownloadModal from '@/components/atoms/modal/ApkDownloadModal';

interface Portfolio {
  id: string;
  'logo-icons': string;
  'logo-icons-dark': string;
  'main-image': string;
  'sub-image': string;
  'main-contents'?: string;
  'main-contents-optimized'?: string;
  'font-theme': string;
  category: string;
  'work-title': string;
  'work-title-eng': string;
  'work-explan': string;
  'key-features': string;
  github: string;
  link: string;
  [key: string]: any;
}

const PortfolioItemCard = memo(function PortfolioItemCard({
  work,
  isMobile,
  onOpenApkModal,
}: {
  work: Portfolio;
  isMobile: boolean;
  onOpenApkModal: (url: string) => void;
}) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLLIElement>(null);

  const hasHoverContent = Boolean(work['main-contents-optimized']);
  const isVideo =
    hasHoverContent && work['main-contents-optimized']?.includes('/video/');
  const isScrollImage = hasHoverContent && !isVideo;

  useEffect(() => {
    if (!isMobile || !cardRef.current) {
      if (!isMobile) setIsHovered(false); // 데스크탑 전환 시 상태 초기화
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // entry.isIntersecting: 화면 정중앙 영역에 들어왔는지 여부
          if (entry.isIntersecting) {
            setIsHovered(true);
          } else {
            setIsHovered(false);
          }
        });
      },
      {
        // 화면 위쪽 40%, 아래쪽 40%를 제외한 가운데 20% 영역에 닿았을 때만 작동
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0,
      },
    );

    observer.observe(cardRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isMobile]);

  // 비디오 재생/일시정지 로직을 상태(isHovered)에 동기화
  useEffect(() => {
    if (isVideo && videoRef.current) {
      if (isHovered) {
        // 비디오 플레이 (에러 방지를 위해 catch 처리)
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isHovered, isVideo]);

  // 데스크탑용 마우스 이벤트 (모바일에서는 무시)
  const handleMouseEnter = () => {
    if (isMobile) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setIsHovered(false);
  };

  const handleGoDetail = (e: React.MouseEvent) => {
    e.preventDefault();
    sessionStorage.setItem('mainScrollY', window.scrollY.toString());

    window.dispatchEvent(new Event('trigger-page-exit'));

    setTimeout(() => {
      router.push(`/works/${work.id}?from=main`);
    }, 600);
  };

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    work: Portfolio,
  ) => {
    e.stopPropagation();

    if (work.category === 'Mobile App') {
      e.preventDefault();
      onOpenApkModal(work.link);
    }
  };

  return (
    <li className={s['portfolio-item']} ref={cardRef}>
      <FadeInPortfolio>
        <div
          className={s['item-button']}
          onClick={handleGoDetail}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className={`${s['work-info']} ${work['font-theme'] === 'dark' ? s['dark'] : ''}`}
          >
            <div className={`${s['info-logo']} ${s[`logo-${work.id}`] || ''}`}>
              {work['logo-icon'] ? (
                <>
                  <Image
                    src={work['logo-icon']}
                    alt={`${work.id} logo`}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className={`${s['default-logo']} ${s['light-logo']}`}
                    unoptimized={true}
                  />

                  <Image
                    src={work['logo-icon-dark'] || work['logo-icon']}
                    alt={`${work.id} dark logo`}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className={`${s['default-logo']} ${s['dark-logo']}`}
                    unoptimized={true}
                  />
                </>
              ) : (
                <span></span>
              )}
            </div>

            <div className={s['info-header']}>
              <div className={s['text-info']}>
                <div className={s['work-title-text']}>{work['work-title']}</div>{' '}
                <p>|</p> <span>{work.category}</span>
              </div>
              <div className={s['work-title']}>{work['work-title-eng']}</div>
            </div>
          </div>

          <div className={s['work-image']}>
            {isVideo && (
              <>
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
                  className={`${s['default-image']} ${isHovered ? s['hidden'] : ''}`}
                  unoptimized={true}
                />
                <div
                  className={`${s['hover-content']} ${isHovered ? s['show'] : ''}`}
                >
                  <video
                    ref={videoRef}
                    src={work['main-contents-optimized']}
                    preload="none"
                    muted
                    loop
                    playsInline
                    className={s['hover-video']}
                  />
                </div>
              </>
            )}

            {isScrollImage && (
              <Image
                src={work['main-contents-optimized']!}
                alt={`${work.id} preview`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                // 호버 상태에 따라 스크롤 클래스만 뗐다 붙였다 합니다
                className={`${s['hover-image']} ${isHovered ? s['scrolling'] : ''}`}
                unoptimized={true}
              />
            )}

            {!hasHoverContent && (
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
            )}

            <div className={s['work-links']}>
              <div className={s['web-links']}>
                <Link
                  href={work.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s['site-link']}
                  onClick={(e) => handleLinkClick(e, work)}
                >
                  {/*사이트 방문*/}
                  {work.category === 'Mobile App'
                    ? 'APK 다운로드'
                    : '사이트 방문하기'}
                </Link>
              </div>

              <Link
                href={`/works/${work.id}?from=main`}
                className={s['detail-button']}
                onClick={handleGoDetail}
              >
                <span>자세히 보기</span>
                {/*<div className={`${s['svg-box']}`}>*/}
                {/*  <BlackArrow width="100%" height="100%" viewBox="0 0 36 36" />*/}
                {/*</div>*/}
              </Link>
            </div>
          </div>
        </div>
      </FadeInPortfolio>
    </li>
  );
});

export default function Section_04() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [currentApkUrl, setCurrentApkUrl] = useState('');

  const handleOpenApkModal = useCallback((url: string) => {
    setCurrentApkUrl(url);
    setIsApkModalOpen(true);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const data = (await fetchPortfolios()) as Portfolio[];
      setPortfolios(data);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (portfolios.length > 0) {
      const timer = setTimeout(() => {
        if (typeof window !== 'undefined') {
          const lenis = (window as any).lenisInstance;
          if (lenis) lenis.resize();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [portfolios]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (portfolios.length > 0) {
      const timer = setTimeout(() => {
        if (typeof window !== 'undefined') {
          const lenis = (window as any).lenisInstance;
          if (lenis) lenis.resize();

          // 저장된 스크롤 위치가 있다면 복구
          const savedY = sessionStorage.getItem('mainScrollY');
          if (savedY) {
            const targetY = parseInt(savedY, 10);
            window.scrollTo(0, targetY);
            if (lenis) lenis.scrollTo(targetY, { immediate: true });
            sessionStorage.removeItem('mainScrollY'); // 복구 후 삭제
          }
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [portfolios]);

  return (
    <>
      <section id="section-04" className={s['section-container']}>
        <div className={s['section-wrap']}>
          <FadeInMain>
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
          </FadeInMain>

          <div className={s['works-wrap']}>
            <div className={s['category-group']}>
              <ul className={s['portfolio-list']}>
                {portfolios.map((work) => (
                  <PortfolioItemCard
                    key={work.id}
                    work={work}
                    isMobile={isMobile}
                    onOpenApkModal={handleOpenApkModal}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <ApkDownloadModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
        apkUrl={currentApkUrl}
      />
    </>
  );
}
