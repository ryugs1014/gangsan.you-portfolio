// app/stacks/page.tsx

import type { Metadata } from 'next';
import s from './page.module.scss';
import PageTitle from '@/components/atoms/common/PageTitle';
import Section_Banner from '@/components/pages/stacks/Section_Banner';
import StackList from '@/components/pages/stacks/StackList';
import TabNavigation from '@/components/atoms/buttons/TabNavigation';
import { fetchStacks } from '@/api/stack';
import FadeIn from '@/components/atoms/animation/FadeIn';

export const metadata: Metadata = {
  title: '유강산 포트폴리오 | STACKS',
  description:
    '트렌드를 유연하게 받아들이고, 완성도 높은 결과물로 다듬어냅니다.',
};

export default async function Stacks() {
  // 1. 서버에서 스택 데이터를 가져옵니다.
  const stacks = await fetchStacks();

  // 2. 데이터를 카테고리별로 그룹화합니다.
  const groupedStacks = stacks.reduce(
    (acc: Record<string, any[]>, current: any) => {
      const { category } = current;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(current);
      return acc;
    },
    {},
  );

  // 3. 그룹화된 카테고리 키를 이용해 탭 데이터를 생성합니다.
  // ID는 카테고리 이름을 소문자로 바꾸고 공백을 하이픈으로 변경하여 만듭니다 (예: "Front End" -> "front-end")
  const tabs = Object.keys(groupedStacks).map((category) => ({
    name: category,
    id: category.toLowerCase().replace(/\s+/g, '-'),
  }));

  return (
    <main className={s['main']}>
      <FadeIn>
        <PageTitle>
          트렌드를 유연하게 받아들이고, <br />
          완성도 높은 결과물로 다듬어냅니다.
        </PageTitle>
      </FadeIn>

      {/*<FadeIn delay={0.3}>*/}
      {/*  <Section_Banner />*/}
      {/*</FadeIn>*/}

      <TabNavigation tabs={tabs} />

      <FadeIn delay={0.3} threshold={0}>
        <StackList groupedStacks={groupedStacks} />
      </FadeIn>
    </main>
  );
}
