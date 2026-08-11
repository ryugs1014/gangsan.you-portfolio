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
                    <div className={s['list-title']}>
                      컴퓨터그래픽스운용기능사
                    </div>
                    <div className={s['list-sub']}>최종합격</div>
                  </div>

                  <div className={s['list-time']}>2009.07</div>
                </li>
                <li>
                  <div className={s['flex-box']}>
                    <div className={s['list-title']}>JLPT 일본어능력시험</div>
                    <div className={s['list-sub']}>N1 PASS</div>
                  </div>

                  <div className={s['list-time']}>2017.01</div>
                </li>
              </ol>
            </li>
          </ul>
        </div>
      </Container>
    </section>
  );
}
