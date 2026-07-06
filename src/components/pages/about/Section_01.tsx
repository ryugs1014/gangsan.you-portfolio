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

export default function Section_01() {
  return (
    <section id="section-01" className={s['section-container']}>
      <Container>
        <div className={s['section-wrap']}>
          <ul className={s['content-section']}>
            <li>
              <div className={s['about-title']}>
                <span className={s['main-title']}>유강산</span>
                <span className={s['sub-title']}>1991.10.14</span>
              </div>

              <div className={s['about-content']}>
                디자인, 기술, 그리고 사용자 경험이 만나는 지점에서 디지털 경험을
                만들어가는 소프트웨어 개발자입니다. 안녕하세요. Next.js와 React
                Native로 실서비스를 개발·운영해온 프론트엔드 개발자
                황다희입니다. 패션 커머스 스타트업에서 약 3년간 사용자 웹,
                모바일 앱, 어드민까지 프론트엔드 전 영역을 소규모 팀 안에서 높은
                오너십으로 담당해왔습니다. Figma를 단순히 확인하는 데 그치지
                않고, 개발에 필요한 형태로 직접 수정·정리하여 구현에 반영합니다.
                디자이너에게 별도로 묻지 않아도 스펙을 스스로 해석하고 정리할 수
                있어 디자인-개발 사이의 커뮤니케이션 비용을 줄입니다.
                디자이너·기획자·운영팀과 자주 소통하는 환경에서 일해왔고, 개발
                맥락을 비개발자도 이해할 수 있는 언어로 전달하는 데 익숙합니다.
                2021년 2월에 미림여자정보과학고등학교를 졸업 후 2021년 8월
                방송통신대학교 컴퓨터과학과에 입학하여 2025년 8월에
                졸업했습니다.
              </div>
            </li>
          </ul>
        </div>
      </Container>
    </section>
  );
}
