'use client';

import React from 'react';
import s from './Section_06.module.scss';
import Link from 'next/link';
import Container from '@/components/layout/Container';
import RightArrowSVG from '@/components/atoms/common/RightArrowSVG';
import FadeInPortfolio from '@/components/atoms/animation/FadeInPortfolio';
import FadeInMain from '@/components/atoms/animation/FadeInMain';

export default function Section_06() {
  const getEmail = () => {
    return 'ryugs@gmail.com';
  };

  return (
    <section id="section-06" className={s['section-container']}>
      <FadeInMain>
        <Container>
          <div className={s['section-wrap']}>
            <div className={s['title-section']}>
              <div className={s['text-section']}>
                <div className={s['section-title']}>문의하기</div>
                <div className={s['section-text']}>
                  함께 일할 사람을 찾고 계신가요?
                </div>
              </div>

              <div className={s['button-section']}>
                <Link href={'/contact'} className={s['site-link']}>
                  <button className={s['more-button']}>
                    <span>자세히 보러가기</span>

                    <RightArrowSVG />
                  </button>
                </Link>
              </div>
            </div>

            <ul className={s['content-section']}>
              <li>
                <div className={s['contact-mail']}>{getEmail()}</div>
              </li>
              <li className={s['button-list-section']}>
                <div className={s['contact-buttons']}>
                  <Link
                    href={'https://github.com/ryugs1014?tab=repositories'}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className={s['link-button']}>
                      <span>GitHub</span>

                      <RightArrowSVG responsivSize={true} />
                    </button>
                  </Link>

                  <button className={s['link-button']}>
                    <span>이력서</span>

                    <RightArrowSVG responsivSize={true} />
                  </button>

                  <Link href={'/contact'} className={s['site-link']}>
                    <button className={s['link-button']}>
                      <span>메일 작성</span>

                      <RightArrowSVG responsivSize={true} />
                    </button>
                  </Link>
                </div>
              </li>
            </ul>
          </div>
        </Container>
      </FadeInMain>
    </section>
  );
}
