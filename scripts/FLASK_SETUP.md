# Flask Whisper 서버 외부 접근 설정

## 문제 상황
v0 프리뷰 환경은 Vercel 클라우드에서 실행되므로 사용자의 로컬 `localhost:5000`에 직접 접근할 수 없습니다.

## 해결 방법: ngrok 사용

### 1. ngrok 설치
https://ngrok.com/download 에서 다운로드 및 설치

### 2. Flask 서버 실행
\`\`\`bash
cd scripts
python flask_whisper_server.py
\`\`\`

서버가 `http://localhost:5000`에서 실행됩니다.

### 3. ngrok 실행
새 터미널을 열고:
\`\`\`bash
ngrok http 5000
\`\`\`

### 4. 공개 URL 확인
ngrok이 다음과 같은 출력을 보여줍니다:
\`\`\`
Forwarding   https://abcd1234.ngrok.io -> http://localhost:5000
\`\`\`

이 `https://abcd1234.ngrok.io` URL을 복사하세요.

### 5. v0에서 설정
`lib/gemini-config.ts` 파일에서:
\`\`\`typescript
export const FLASK_CONFIG = {
  serverUrl: "https://abcd1234.ngrok.io", // 여기에 ngrok URL 입력
}
\`\`\`

또는 v0 환경 변수에서:
\`\`\`
NEXT_PUBLIC_FLASK_SERVER_URL=https://abcd1234.ngrok.io
\`\`\`

### 6. 완료
이제 v0 앱에서 음성 파일을 업로드하면 ngrok을 통해 로컬 Flask 서버로 전달됩니다.

## 주의사항
- ngrok 무료 버전은 세션이 8시간마다 만료되어 URL이 변경됩니다.
- URL이 변경되면 설정 파일을 다시 수정해야 합니다.
- 유료 버전을 사용하면 고정 URL을 받을 수 있습니다.
