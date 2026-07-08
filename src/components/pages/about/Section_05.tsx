import React from 'react';
import Container from '@/components/layout/Container';
import s from './Section_01.module.scss';
import StackSlide from '@/components/atoms/slide/StackSlide';

// const STACKS = [
//   'HTML',
//   'CSS',
//   'JavaScript',
//   'jQuery',
//   'Styled Components',
//   'TypeScript',
//   'React',
//   'NextJS',
//   'Axios',
//   'SASS(SCSS)',
//   'Git',
//   'Github',
//   'Vercel',
//   'Supabase',
//   'Docker',
//   'Adobe Illustrator',
//   'Adobe Photoshop',
//   'Adobe Premiere Pro',
//   'Figma',
//   'SketchUp',
//   'Blender',
// ];

export default function Section_05() {
  return (
    <section id="section-05" className={s['section-container']}>
      <Container>
        <div className={s['section-wrap']}>
          <ul className={s['content-section']}>
            <li>
              {/*<div className={s['about-block-list']}>*/}
              {/*  {STACKS.map((stack) => (*/}
              {/*    <span key={stack} className={s['about-block']}>*/}
              {/*      {stack}*/}
              {/*    </span>*/}
              {/*  ))}*/}
              {/*</div>*/}

              <StackSlide />
            </li>
          </ul>
        </div>
      </Container>
    </section>
  );
}
