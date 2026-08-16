## 유강산 포트폴리오 (GANGSAN.YOU PORTFOLIO)

새로운 변화 속에서 최선을 찾는 프론트엔드 개발자 유강산의 2026 개인 포트폴리오 웹사이트입니다. 다양한 프로젝트 경험과 기술 스택을 소개하며, 부드러운 인터랙션과 반응형 UI를 제공합니다.

### 핵심 기능

- **동적 포트폴리오 렌더링 (Dynamic Routing):** JSON 데이터를 기반으로 포트폴리오 목록과 상세 페이지(`works/[id]`)를 동적으로 생성 및 제공합니다.
- **다크/라이트 모드 (Theme Toggle):** 사용자의 시스템 설정 및 취향에 맞춰 테마를 전환할 수 있는 기능을 제공합니다.
- **문의하기 (Contact Form):** Next.js API Route(`/api/contact`)를 활용하여 사이트 내에서 직접 이메일 문의를 보낼 수 있습니다.
- **반응형 디자인 (Responsive Web):** PC, 태블릿, 모바일을 아우르는 크로스 디바이스 레이아웃을 SCSS 기반으로 완벽하게 구현했습니다.

### 기술 스택

- **Framework:** Next.js (App Router), React
- **Language:** TypeScript
- **Styling:** SCSS (CSS Modules), Mixins, Variables (`src/styles` 기반)
- **Animation/Interaction:** Framer Motion, Custom Smooth Scroll
- **Data Management:** JSON (`portfolios.json`, `stacks.json`) 활용

### 프로젝트 구조

프로젝트는 유지보수성과 컴포넌트 재사용성을 고려하여 `src` 폴더 내에 체계적으로 분리되어 있습니다.

```text
src/
├── api/               # 데이터 패칭 및 API 호출 관련 로직
├── app/               # Next.js App Router 기반의 페이지 및 API 라우팅 디렉토리
│   ├── api/contact/   # 이메일 전송 API
│   ├── about/         # 소개 페이지
│   ├── contact/       # 문의 페이지
│   ├── stacks/        # 기술 스택 페이지
│   ├── works/         # 포트폴리오 목록 및 상세([id]) 페이지
│   └── layout.tsx / page.tsx # 글로벌 레이아웃 및 메인 페이지
├── components/        # 재사용 가능한 UI 컴포넌트 (Atomic Design 유사 구조)
│   ├── atoms/         # 애니메이션(FadeIn 등), 버튼(ThemeToggle 등), 슬라이드 컴포넌트
│   ├── layout/        # Header, Footer, MobileMenu, Container
│   ├── pages/         # 각 페이지(main, about, works 등)를 구성하는 개별 Section 컴포넌트
│   └── session/       # InitialLoader, PageTransition 등 세션/라우팅 관련 UI
├── data/              # 정적 콘텐츠 데이터 세트
│   ├── portfolios.json# 포트폴리오 상세 데이터
│   └── stacks.json    # 기술 스택 데이터
└── styles/            # 전역 스타일시트 및 믹스인
    ├── _rem.scss / _reset.scss / _variables.scss
    ├── globals.scss   # 글로벌 스타일
    └── mixins/        # 레이아웃, 타이포그래피, SVG 등 SCSS