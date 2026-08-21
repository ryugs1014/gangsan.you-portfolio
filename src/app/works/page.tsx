// app/works/page.tsx

import type { Metadata } from 'next';
import s from './page.module.scss';
import PageTitle from '@/components/atoms/common/PageTitle';
import Section_Banner from '@/components/pages/contact/Section_Banner';
import WorksContent from '@/components/pages/works/WorksContent';
import FadeIn from '@/components/atoms/animation/FadeIn';

export const metadata: Metadata = {
  title: '유강산 포트폴리오 | WORKS',
  description:
    '고객의 이야기를 가장 가까이에서 듣고, 만족을 넘어서는 경험을 제공합니다.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default async function Works() {
  return (
    <main className={s['main']}>
      <FadeIn>
        <PageTitle>
          고객의 이야기를 가장 가까이에서 듣고, <br />
          만족을 넘어서는 경험을 제공해요.
        </PageTitle>
      </FadeIn>

      <FadeIn delay={0.3}>
        <Section_Banner />
      </FadeIn>

      <WorksContent />
    </main>
  );
}
