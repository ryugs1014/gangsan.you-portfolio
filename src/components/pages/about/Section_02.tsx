import React from 'react';
import Container from '@/components/layout/Container';
import s from './Section_01.module.scss';

export default function Section_02() {
  return (
    <section id="section-02" className={s['section-container']}>
      <Container>
        <div className={s['section-wrap']}>
          <ul className={s['content-section']}>
            <li>
              <div className={s['about-title']}>EDUCATION</div>

              <ol className={s['about-content-list']}>
                <li>
                  <div className={s['flex-box']}>
                    <div className={s['list-title']}>국립창원대학교(4년제)</div>
                    <div className={s['list-sub']}>일어일문학과</div>
                  </div>

                  <div className={s['list-time']}>2010.03 - 2018.02</div>
                </li>
                <li>
                  <div className={s['flex-box']}>
                    <div className={s['list-title']}>
                      {' '}
                      규슈대학(九州大学) 교환학생
                    </div>
                    <div className={s['list-sub']}>윤리학부</div>
                  </div>

                  <div className={s['list-time']}>2016.04 - 2017.02</div>
                </li>
                <li>
                  <div className={s['flex-box']}>
                    <div className={s['list-title']}>더조은컴퓨터학원</div>
                    <div className={s['list-sub']}>프론트엔드 실무자 양성</div>
                  </div>

                  <div className={s['list-time']}>2021.03 - 2021.07</div>
                </li>
              </ol>
            </li>
          </ul>
        </div>
      </Container>
    </section>
  );
}
