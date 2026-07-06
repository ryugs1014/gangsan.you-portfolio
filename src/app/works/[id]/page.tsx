import type { Metadata } from 'next';
import WorkDetail, { Portfolio } from '@/components/pages/works/WorkDetail';
import { fetchPortfolioById } from '@/api/portfolio';
import Container from '@/components/layout/Container';

// ✅ 1. params의 타입을 Promise로 감싸줍니다. (Next.js 15 문법)
type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // ✅ 2. params 객체를 await로 먼저 풀어줍니다.
  const resolvedParams = await params;
  const data = (await fetchPortfolioById(resolvedParams.id)) as Portfolio;

  return {
    title: data
      ? `${data['work-title']} | 유강산 포트폴리오`
      : '포트폴리오 상세',
  };
}

export default async function WorkDetailPage({ params }: Props) {
  // ✅ 3. 컴포넌트 내부에서도 params를 await로 풀어준 뒤 id를 사용합니다.
  const resolvedParams = await params;
  const data = (await fetchPortfolioById(resolvedParams.id)) as Portfolio;

  if (!data) {
    return (
      <main style={{ padding: '200px 0', textAlign: 'center' }}>
        <Container>
          <h1>해당 포트폴리오를 찾을 수 없습니다.</h1>
          {/* 디버깅용: URL에서 읽어온 ID가 제대로 찍히는지 확인해 보세요 */}
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
