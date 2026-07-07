'use client';

import React, { useState, useEffect } from 'react';
import s from './WorksContent.module.scss';
import TabCategory from '@/components/atoms/buttons/TabCategory';
import WorkList, { Portfolio } from './WorkList';
import { fetchPortfolios } from '@/api/portfolio';
import FadeIn from '@/components/atoms/animation/FadeIn';

export default function WorksContent() {
  const [allPortfolios, setAllPortfolios] = useState<Portfolio[]>([]);
  const [categories, setCategories] = useState<string[]>(['전체']);
  const [activeCategory, setActiveCategory] = useState<string>('전체');

  useEffect(() => {
    const loadData = async () => {
      const data = (await fetchPortfolios()) as Portfolio[];
      setAllPortfolios(data);

      // 데이터에서 중복 없는 카테고리 추출 (All을 맨 앞에 배치)
      const uniqueCategories = [
        '전체',
        ...Array.from(new Set(data.map((item) => item.category))),
      ];
      setCategories(uniqueCategories);
    };

    loadData();
  }, []);

  // 선택된 카테고리에 맞게 데이터 필터링
  const filteredPortfolios =
    activeCategory === '전체'
      ? allPortfolios
      : allPortfolios.filter((work) => work.category === activeCategory);

  return (
    <>
      <TabCategory
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={(cat) => setActiveCategory(cat)}
      />

      {/* 탭 네비게이션 아래에 여백을 주기 위해 감싸줍니다 */}
      <div id="work-list-section" className={s['works-list-container']}>
        <FadeIn threshold={0.2}>
          <WorkList portfolios={filteredPortfolios} />
        </FadeIn>
      </div>
    </>
  );
}
