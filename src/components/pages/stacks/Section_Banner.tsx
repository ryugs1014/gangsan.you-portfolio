'use client';

import React, { useState } from 'react';
import s from './Section_Banner.module.scss';
import Spline from '@splinetool/react-spline';

export default function Section_Banner() {
  // ✅ Spline 로딩 상태 관리
  const [isLoaded, setIsLoaded] = useState(false);

  // ✅ 로딩이 완료되면 실행되는 함수
  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div
      className={`${s['section-container']} ${isLoaded ? s['is-visible'] : ''}`}
    >
      <div className={s['fake-image']}>
        <div className={s['spline-wrap']}>
          {/*<Spline*/}
          {/*  scene="https://prod.spline.design/sWxotQm2vsZXYv4h/scene.splinecode"*/}
          {/*/>*/}
          <Spline
            scene="https://prod.spline.design/UI87BciL0x34BOij/scene.splinecode"
            onLoad={handleLoad} // Spline 로딩 완료 시 핸들러 호출
          />
        </div>
      </div>
    </div>
  );
}
