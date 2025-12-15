# Flask Whisper Server 실행 방법

## 1. 필요한 패키지 설치

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## 2. 서버 실행

\`\`\`bash
python flask_whisper_server.py
\`\`\`

서버가 http://localhost:5000 에서 실행됩니다.

## 3. 테스트

\`\`\`bash
curl http://localhost:5000/health
\`\`\`

정상 작동하면 `{"status":"ok","model":"whisper-base"}`가 반환됩니다.

## 4. 웹 앱 연결

웹 앱에서 음성 파일을 업로드하면 자동으로 Flask 서버로 전송되어 Whisper로 변환됩니다.

## 모델 크기 선택

`flask_whisper_server.py` 파일에서 모델 크기를 변경할 수 있습니다:
- `tiny`: 가장 빠름, 정확도 낮음
- `base`: 균형잡힌 선택 (기본값)
- `small`: 더 정확함
- `medium`: 매우 정확함
- `large`: 최고 정확도, 느림

\`\`\`python
model = whisper.load_model("base")  # 여기서 변경
