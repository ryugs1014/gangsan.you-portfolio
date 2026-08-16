import type { Metadata } from 'next';
import WorkDetail, { Portfolio } from '@/components/pages/works/WorkDetail';
import { fetchPortfolioById } from '@/api/portfolio';
import Container from '@/components/layout/Container';

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
      <main style={{ padding: '200px 0', textAlign: 'center' }}>
        <Container>
          <h1>해당 포트폴리오를 찾을 수 없습니다.</h1>
          <p style={{ marginTop: '20px', color: '#666' }}>
            요청된 ID: {resolvedParams.id}
          </p>
        </Container>
      </main>
    );
  }

  return (
    <main>
      <WorkDetail data={data} />
    </main>
  );
}
