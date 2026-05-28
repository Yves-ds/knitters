# 🧶 knitters (니터즈)

> 뜨개 기록 & 커뮤니티 모바일 앱

## 소개

knitters는 뜨개질을 취미로 즐기는 2030 세대를 위한 모바일 앱입니다.

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Lucide React

## 핵심 기능

1. 🧶 **뜨개 프로젝트 기록** - 진행률, 실 정보, 사진 관리
2. 💬 **뜨개 커뮤니티** - 작품 공유, 좋아요/댓글, Q&A
3. 🔍 **도안/아이템 탐색** - 카테고리별 도안 탐색 및 저장

## 디자인

- 톤: 미니멀
- 메인 컬러: `#FF5831`
- 배경: 모바일 최적화 (max-width: 480px)

## 시작하기

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

`http://localhost:3000` 에서 확인하세요.

## 폴더 구조

```
src/
├── app/
│   ├── (main)/               # 메인 레이아웃 (BottomNav 포함)
│   │   ├── feed/             # 홈 피드
│   │   ├── projects/         # 프로젝트 목록/상세/생성
│   │   ├── community/        # 커뮤니티 목록/상세/글쓰기
│   │   ├── explore/          # 도안 탐색/상세
│   │   └── mypage/           # 마이페이지/설정/편집
│   ├── onboarding/           # 온보딩
│   ├── login/                # 로그인/회원가입
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── layout/               # Header, BottomNav
│   └── ui/                   # Avatar, Badge, ProgressBar, EmptyState
└── lib/
    └── mockData.ts           # 목업 데이터
```
