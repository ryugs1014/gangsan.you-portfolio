import type { Metadata } from 'next';
import WorkDetail, { Portfolio } from '@/components/pages/works/WorkDetail';
import { fetchPortfolioById } from '@/api/portfolio';
import Container from '@/components/layout/Container';
import s from './page.module.scss';
import Link from 'next/link';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const data = (await fetchPortfolioById(resolvedParams.id)) as Portfolio;

  return {
    title: data
      ? `유강산 포트폴리오 | ${data['work-title']}`
      : '포트폴리오 상세',
  };
}

export default async function WorkDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const data = (await fetchPortfolioById(resolvedParams.id)) as Portfolio;

  if (!data) {
    return (
      <main className={s['not-found-main']}>
        <section className={s['section-wrap']}>
          <Container>
            <div className={s['title-section']}>
              <div className={s['title-box']}>
                <h2 className={s['title']}>페이지를 찾을 수 없습니다</h2>
                <div className={s['text']}>
                  이용에 불편을 드려 죄송합니다.
                  <br />
                  해당 페이지가 존재하지 않거나 삭제되었을 수 있습니다.
                </div>
              </div>

              <div className={s['button-wrap']}>
                <Link href="/" className={s['home-button']}>
                  <button className={s['more-button']}>
                    <div className={s['button-arrow']}>
                      <div className={s['svg-box']}>←</div>
                    </div>
                    <div className={s['button-text-wrap']}>홈으로 돌아가기</div>
                  </button>
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
    );
  }

  return (
    <main>
      <WorkDetail data={data} />
    </main>
  );
}
