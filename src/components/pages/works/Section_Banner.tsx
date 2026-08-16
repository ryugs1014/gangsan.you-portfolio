'use client';

import React, { useState } from 'react';
import s from './Section_Banner.module.scss';
import Spline from '@splinetool/react-spline';

export default function Section_Banner() {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div
      className={`${s['section-container']} ${isLoaded ? s['is-visible'] : ''}`}
    >
      <div className={s['fake-image']}>
        <div className={s['spline-wrap']}>
          <Spline
            scene="https://prod.spline.design/UN2pOQn-Y9jnyQC9/scene.splinecode"
            onLoad={handleLoad} // Spline 로딩 완료 시 핸들러 호출
          />
        </div>
      </div>
    </div>
  );
}
