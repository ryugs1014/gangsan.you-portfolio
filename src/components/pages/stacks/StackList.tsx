import React from 'react';
import Image from 'next/image';
import s from './StackList.module.scss';
import Container from '@/components/layout/Container';

interface Stack {
  category: string;
  stack: string;
  detail: string;
  'icon-image': string;
  'icon-image-dark'?: string;
  [key: string]: any;
}

interface StackListProps {
  groupedStacks: Record<string, Stack[]>;
}

export default function StackList({ groupedStacks }: StackListProps) {
  return (
    <section className={s['stack-list-section']}>
      <Container>
        <div className={s['stack-list-wrap']}>
          {Object.entries(groupedStacks).map(([category, items]) => {
            const sectionId = category.toLowerCase().replace(/\s+/g, '-');

            return (
              <div
                key={category}
                id={sectionId}
                className={s['category-group']}
              >
                <div className={s['category-title']}>{category}</div>

                <div className={s['stack-grid']}>
                  {items.map((item, idx) => {
                    // 1. 변수로 추출하면 타입 스크립트가 조건문 내에서 string 타입으로 정상 좁히기(Narrowing) 합니다.
                    const lightIcon = item['icon-image'];
                    const darkIcon = item['icon-image-dark'];

                    return (
                      <div key={idx} className={s['stack-card']}>
                        <div className={s['card-info']}>
                          <h3 className={s['stack-name']}>{item.stack}</h3>
                          <p className={s['stack-detail']}>{item.detail}</p>
                        </div>

                        <div className={s['icon-box']}>
                          {darkIcon ? (
                            <>
                              <Image
                                src={lightIcon}
                                alt={`${item.stack} icon`}
                                fill
                                sizes="(max-width: 768px) 20vw, 10vw"
                                style={{ objectFit: 'contain' }}
                                className={s['light-icon']}
                              />
                              <Image
                                src={
                                  darkIcon
                                } /* 타입 에러 해결 (string 타입으로 확정) */
                                alt={`${item.stack} dark icon`}
                                fill
                                sizes="(max-width: 768px) 20vw, 10vw"
                                style={{ objectFit: 'contain' }}
                                className={s['dark-icon']}
                              />
                            </>
                          ) : (
                            <Image
                              src={lightIcon}
                              alt={`${item.stack} icon`}
                              fill
                              sizes="(max-width: 768px) 20vw, 10vw"
                              style={{ objectFit: 'contain' }}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
