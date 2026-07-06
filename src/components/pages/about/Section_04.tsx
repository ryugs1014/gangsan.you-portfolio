import React from 'react';
import Container from '@/components/layout/Container';
import s from './Section_01.module.scss';

const STACKS = [
  'HTML',
  'CSS',
  'JavaScript',
  'jQuery',
  'Styled Components',
  'TypeScript',
  'React',
  'NextJS',
  'Axios',
  'SASS(SCSS)',
  'Git',
  'Github',
  'Vercel',
  'Supabase',
  'Docker',
  'Adobe Illustrator',
  'Adobe Photoshop',
  'Adobe Premiere Pro',
  'Figma',
  'SketchUp',
  'Blender',
];

export default function Section_04() {
  return (
    <section id="section-04" className={s['section-container']}>
      <Container>
        <div className={s['section-wrap']}>
          <ul className={s['content-section']}>
            <li>
              <div className={s['about-title']}>EXPERIENCE</div>

              <ol className={s['about-content-list']}>
                <li>
                  <div className={s['flex-box']}>
                    <div className={s['list-title']}>㈜ 비아이벤처스</div>
                    <div className={s['list-sub']}>개발팀 · 프로</div>
                  </div>

                  <div className={s['list-time']}>2022.06 - 2024.08</div>
                </li>
                <li>
                  <div className={s['flex-box']}>
                    <div className={s['list-title']}>
                      ㈜ 글리처파트너스{' '}
                      <span className={s['list-title-bar']}>| </span>
                      <span className={s['list-title-sub']}>
                        구 ㈜엔피프틴파트너스
                      </span>
                    </div>
                    <div className={s['list-sub']}>DX팀 · Project Leader</div>
                  </div>

                  <div className={s['list-time']}>2024.08 - 2026.03</div>
                </li>
              </ol>
            </li>
          </ul>
        </div>
      </Container>
    </section>
  );
}
