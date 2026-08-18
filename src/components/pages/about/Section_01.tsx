import React from 'react';
import Container from '@/components/layout/Container';
import s from './Section_01.module.scss';

export default function Section_01() {
  return (
    <section id="section-01" className={s['section-container']}>
      <Container>
        <div className={s['section-wrap']}>
          <ul className={s['content-section']}>
            <li>
              <div className={s['about-title']}>
                <span className={s['main-title']}>유강산</span>
                <span className={s['sub-title']}>1991.10.14</span>
              </div>

              <div className={s['about-content']}>
                안녕하세요, 책임감 있게 완성도 높은 서비스를 구현하는 프론트엔드
                개발자 유강산입니다.
                <br />
                저는 지난 3년간 스타트업 환경에서 Next.js와 React를 사용해
                서비스를 만들고 운영해 왔습니다. 소규모 팀에서의 경험으로
                사용자가 직접 만나는 웹 화면부터 내부 직원들이 쓰는 관리자
                페이지까지, 프론트엔드의 거의 모든 영역을 직접 부딪치며
                경험했습니다. 특히 PC와 모바일을 아우르는 세밀한 반응형
                레이아웃을 다듬고, 사용자가 편안함을 느낄 수 있는 자연스러운
                화면 인터랙션을 고민하며 웹페이지에 생동감을 불어넣는 작업을
                꾸준히 해왔습니다. 서비스가 처음 기획되어 구축되고 운영되는 전체
                과정을 함께하며, 제가 맡은 일은 끝까지 책임지는 끈기와 서비스
                전체를 바라보는 넓은 시야를 가지게 되었습니다.
                <br /> <br />
                저의 가장 큰 장점은 개발을 하면서 디자인도 깊이 이해하고 다룰 줄
                안다는 것입니다. 단순히 전달받은 화면을 코드로 똑같이 만드는 데
                그치지 않고, 개발에 필요한 부분은 직접 피그마(Figma)를 열어
                다듬고 정리해서 작업할 수 있습니다. 디자이너의 의도를 파악할 수
                있기 때문에, 일일이 묻고 답을 기다리는 시간을 크게 줄일 수
                있었습니다. 덕분에 화면의 예쁜 디테일은 그대로 살리면서도 팀
                전체가 더 빠르게 일할 수 있도록 돕고 있습니다. 또한 기획자,
                디자이너, 운영팀 등 다양한 동료들과 가깝게 대화하며 일해온
                덕분에 편안하게 소통하는 방법을 잘 알고 있습니다.
                <br /> <br />
                일을 하다 보면 기술적으로 구현하기 어렵거나 복잡한 상황이 생기곤
                하는데, 저는 이런 문제들을 개발을 모르는 동료들도 쉽게 이해할 수
                있도록 일상적인 언어로 풀어서 설명하는 데 익숙합니다. 언제나
                꼼꼼하게 코드를 작성하는 기본기를 바탕으로, 동료들과 부드럽게
                소통하며 더 좋은 서비스를 함께 만들어 가는 개발자가 되겠습니다.
              </div>
            </li>
          </ul>
        </div>
      </Container>
    </section>
  );
}
