# 🍕 NextLevel Food

음식을 사랑하는 사람들을 위한 레시피 공유 플랫폼

## ✨ 주요 기능

- 📖 **레시피 탐색** - 전 세계의 맛있는 요리 레시피 둘러보기
- 📝 **레시피 공유** - 나만의 레시피를 사진과 함께 업로드
- 👥 **커뮤니티** - 음식을 좋아하는 사람들과 소통
- 🖼️ **이미지 슬라이드쇼** - 메인 페이지의 시각적인 레시피 쇼케이스

## 🛠️ 기술 스택

- **프레임워크**: Next.js 15 (App Router)
- **UI**: React 19
- **데이터베이스**: SQLite (better-sqlite3)
- **폼 처리**: Next.js Server Actions
- **보안**: XSS 방지 (xss 라이브러리)
- **URL 생성**: slugify

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 데이터베이스 초기화

```bash
node initdb.js
```

더미 데이터와 함께 `meals.db` 파일이 생성됩니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 앱을 확인할 수 있습니다.

## 📁 프로젝트 구조

```
├── app/                    # Next.js App Router 페이지
│   ├── meals/             # 레시피 관련 페이지
│   │   ├── [mealSlug]/    # 레시피 상세 페이지
│   │   └── share/         # 레시피 공유 페이지
│   ├── community/         # 커뮤니티 페이지
│   └── page.js            # 홈 페이지
├── components/            # 재사용 가능한 컴포넌트
│   ├── meals/            # 레시피 관련 컴포넌트
│   ├── images/           # 이미지 슬라이드쇼
│   └── main-header/      # 네비게이션
├── lib/                   # 서버 로직
│   ├── actions.js        # Server Actions (폼 제출 처리)
│   └── meal.js           # 데이터베이스 쿼리
├── public/images/        # 업로드된 이미지
└── meals.db              # SQLite 데이터베이스
```

## 💡 핵심 기능 설명

### 레시피 공유하기

1. `/meals/share` 페이지에서 폼 작성
2. 제목, 요약, 조리법, 이미지 업로드
3. Server Action으로 서버에서 유효성 검사
4. SQLite에 저장 및 이미지는 `public/images/`에 저장

### 이미지 처리

- 유효성 검사 실패 시에도 선택한 이미지 유지
- File 객체와 base64 문자열 모두 처리 가능
- 자세한 내용은 [IMAGE_PERSISTENCE_FLOW.md](IMAGE_PERSISTENCE_FLOW.md) 참고

### 데이터베이스 스키마

```sql
CREATE TABLE meals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    image TEXT NOT NULL,
    summary TEXT NOT NULL,
    instructions TEXT NOT NULL,
    creator TEXT NOT NULL,
    creator_email TEXT NOT NULL
)
```

## 🎯 주요 라우트

| 경로            | 설명                          |
| --------------- | ----------------------------- |
| `/`             | 홈 페이지 (이미지 슬라이드쇼) |
| `/meals`        | 전체 레시피 목록              |
| `/meals/share`  | 레시피 공유하기               |
| `/meals/[slug]` | 레시피 상세 페이지            |
| `/community`    | 커뮤니티 소개                 |

## 📝 스크립트

```bash
npm run dev      # 개발 서버 실행 (포트 3000)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 실행
```

## ⚙️ 환경 설정

`next.config.js`에서 Server Actions의 body 크기 제한을 5MB로 설정:

```javascript
experimental: {
  serverActions: {
    bodySizeLimit: '5mb'
  }
}
```

## 🔒 보안

- **XSS 방지**: 사용자 입력(조리법)을 XSS 라이브러리로 필터링
- **이미지 검증**: 파일 타입 및 크기 확인
- **SQL Injection 방지**: Prepared Statements 사용

## 📖 참고 문서

- [Next.js 공식 문서](https://nextjs.org/docs)
- [Server Actions 가이드](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [이미지 유지 로직 상세 설명](IMAGE_PERSISTENCE_FLOW.md)

---

Made with ❤️ by foodies, for foodies
