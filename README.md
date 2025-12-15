# Campus Study Hub

AI 기반 학습 도우미 플랫폼 - Next.js + Google Gemini API

## 🚀 시작하기

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 환경 변수 설정

`.env.example` 파일을 복사하여 `.env.local` 파일을 생성하고, API 키를 입력하세요:

```bash
cp .env.example .env.local
```

필요한 API 키:
- **GOOGLE_GENERATIVE_AI_API_KEY**: [Google AI Studio](https://makersuite.google.com/app/apikey)에서 발급
- **OPENAI_API_KEY** (선택): Whisper STT 기능 사용 시 필요

### 3. 개발 서버 실행

```bash
pnpm dev
```

[http://localhost:3000](http://localhost:3000)에서 확인하세요.

## 📦 주요 기능

- 📝 문서 요약 및 분석
- 🎯 AI 기반 시험 문제 생성
- 🎙️ 음성 녹음 및 트랜스크립션
- 💬 AI 채팅 도우미
- 📚 플래시카드 학습
- ✅ 학습 체크리스트

## 🛠️ 기술 스택

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **AI**: Google Gemini API

## 📁 프로젝트 구조

```
code/
├── app/           # Next.js App Router
│   ├── api/       # API Routes
│   └── ...
├── components/    # React 컴포넌트
├── hooks/         # Custom Hooks
├── lib/           # 유틸리티 함수
├── public/        # 정적 파일
└── scripts/       # Flask 서버 스크립트
```

## ⚠️ 주의사항

- `.env.local` 파일은 절대 Git에 커밋하지 마세요
- API 키는 환경 변수로만 관리하세요
