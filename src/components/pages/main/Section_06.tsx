import React from 'react';
import Container from '@/components/layout/Container';
import s from './Section_06.module.scss';

export default function Section_06() {
  const getEmail = () => {
    return 'ryugs@gmail.com';
  };

  return (
    <section id="section-06" className={s['section-container']}>
      <Container>
        <div className={s['section-wrap']}>
          <div className={s['title-section']}>
            <div className={s['text-section']}>
              <div className={s['section-title']}>Contact</div>
              <div className={s['section-text']}>
                함께 일할 사람을 찾고 계신가요?
              </div>
            </div>

            <div className={s['button-section']}>
              <button className={s['more-button']}>자세히 보러가기 →</button>
            </div>
          </div>

          <ul className={s['content-section']}>
            <li>
              <div className={s['contact-mail']}>{getEmail()}</div>
            </li>
            <li>
              <div className={s['contact-buttons']}>
                <button>GitHub →</button>
                <button>이력서 →</button>
                <button>메일 보내기 →</button>
              </div>
            </li>
          </ul>
        </div>
      </Container>
    </section>
  );
}
