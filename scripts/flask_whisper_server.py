from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import os
import tempfile

app = Flask(__name__)
CORS(app)  # 모든 origin 허용

# Whisper 모델 로드 (앱 시작 시 한 번만)
model_size = "base"
print(f"Loading Whisper model '{model_size}'...")
model = whisper.load_model(model_size)
print("Whisper model loaded!")

@app.route('/transcribe', methods=['POST'])
def transcribe():
    try:
        # 음성 파일 받기
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        audio_file = request.files['audio']
        
        # 임시 파일로 저장
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(audio_file.filename)[1]) as tmp_file:
            audio_file.save(tmp_file.name)
            tmp_path = tmp_file.name
        
        print(f"Transcribing file: {audio_file.filename}")
        
        # Whisper로 음성 인식
        result = model.transcribe(tmp_path, language='ko')
        
        # 임시 파일 삭제
        os.unlink(tmp_path)
        
        transcript = result['text']
        print(f"Transcript: {transcript}")
        
        return jsonify({
            'success': True,
            'text': transcript
        })
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'model': f'openai-whisper-{model_size}'})

if __name__ == '__main__':
    # 로컬 서버 실행: http://localhost:5000
    print("Starting Flask Whisper Server on http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
