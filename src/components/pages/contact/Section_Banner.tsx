'use client';

import React, { useState, useEffect, useRef } from 'react';
import s from './Section_Banner.module.scss';

export default function Section_Banner() {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // 마운트 시점에 비디오가 이미 로드되어 있는지 확인 (캐싱된 영상 대비)
    // readyState가 2(HAVE_CURRENT_DATA) 이상이면 이미 화면에 그릴 준비가 된 것입니다.
    if (videoRef.current && videoRef.current.readyState >= 2) {
      setIsLoaded(true);
    }
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div
      className={`${s['section-container']} ${isLoaded ? s['is-visible'] : ''}`}
    >
      <div className={s['fake-image']}>
        <video
          ref={videoRef}
          src="https://res.cloudinary.com/o2ldruee/video/upload/v1786740161/contact_banner.mp4"
          autoPlay
          muted
          loop
          playsInline
          className={s['video-element']}
          onLoadedData={handleLoad}
          onError={() => console.error('비디오 로드 실패')}
        />
      </div>
    </div>
  );
}
