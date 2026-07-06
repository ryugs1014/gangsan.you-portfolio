import portfolioData from '@/data/portfolios.json';

export const fetchPortfolios = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(portfolioData);
    }, 300);
  });
};

export const fetchPortfolioById = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 1. 현재 포트폴리오의 인덱스(순서)를 찾습니다.
      const currentIndex = portfolioData.findIndex((item) => item.id === id);

      if (currentIndex === -1) {
        resolve(null);
        return;
      }

      const data = portfolioData[currentIndex];

      // 2. 다음 포트폴리오를 찾습니다.
      // (마지막 항목일 경우 첫 번째 항목(0번)으로 돌아가게 설정)
      const nextData =
        currentIndex < portfolioData.length - 1
          ? portfolioData[currentIndex + 1]
          : portfolioData[0];

      // 3. 기존 데이터에 next 정보를 추가해서 반환합니다.
      resolve({
        ...data,
        next: {
          id: nextData.id,
          title: nextData['work-title'],
        },
      });
    }, 300);
  });
};
