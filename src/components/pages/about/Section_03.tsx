import React from 'react';
import Container from '@/components/layout/Container';
import s from './Section_01.module.scss';

export default function Section_03() {
  return (
    <section id="section-03" className={s['section-container']}>
      <Container>
        <div className={s['section-wrap']}>
          <ul className={s['content-section']}>
            <li>
              <div className={s['about-title']}>CERTIFICATE</div>

              <ol className={s['about-content-list']}>
                <li>
                  <div className={s['flex-box']}>
                    <div className={s['list-title']}>국립창원대학교(4년제)</div>
                    <div className={s['list-sub']}>일어일문학과</div>
                  </div>

                  <div className={s['list-time']}>2010.03 - 2018.02</div>
                </li>
              </ol>
            </li>
          </ul>
        </div>
      </Container>
    </section>
  );
}
