import React from 'react';
import Image from 'next/image';
import s from './StackList.module.scss';
import Container from '@/components/layout/Container';

interface Stack {
  category: string;
  stack: string;
  detail: string;
  'icon-image': string;
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
                  {items.map((item, idx) => (
                    <div key={idx} className={s['stack-card']}>
                      <div className={s['card-info']}>
                        <h3 className={s['stack-name']}>{item.stack}</h3>
                        <p className={s['stack-detail']}>{item.detail}</p>
                      </div>

                      <div className={s['icon-box']}>
                        <Image
                          src={item['icon-image']}
                          alt={`${item.stack} icon`}
                          fill
                          sizes="(max-width: 768px) 20vw, 10vw"
                          style={{ objectFit: 'contain' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
