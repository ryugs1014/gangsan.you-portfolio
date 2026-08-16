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
  const stacks = await fetchStacks();

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

      <TabNavigation tabs={tabs} />

      <FadeIn delay={0.3} threshold={0}>
        <StackList groupedStacks={groupedStacks} />
      </FadeIn>
    </main>
  );
}
