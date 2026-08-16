// app/page.tsx

import type { Metadata } from 'next';
import s from './page.module.scss';
import Section_01 from '@/components/pages/main/Section_01';
import Section_02 from '@/components/pages/main/Section_02';
import Section_03 from '@/components/pages/main/Section_03';
import Section_04 from '@/components/pages/main/Section_04';
import Section_05 from '@/components/pages/main/Section_05';
import Section_06 from '@/components/pages/main/Section_06';
import TabNavigation from '@/components/atoms/buttons/TabNavigation';
import FadeIn from '@/components/atoms/animation/FadeIn';

export const metadata: Metadata = {
  title: '유강산 포트폴리오 | Front-end Developer',
  description: '새로운 변화 속에서 최선을 찾는 개발자 유강산 입니다.',
};

const HOME_TABS = [
  { name: '소개', id: 'section-03' },
  { name: '프로젝트', id: 'section-04' },
  { name: '기술 · 스택', id: 'section-05' },
  { name: '문의하기', id: 'section-06' },
];

export default async function Home() {
  return (
    <main className={s['main']}>
      <Section_01 />
      {/*<Section_02 />*/}

      <TabNavigation tabs={HOME_TABS} />

      <Section_03 />

      <Section_04 />

      <Section_05 />

      <Section_06 />
    </main>
  );
}
