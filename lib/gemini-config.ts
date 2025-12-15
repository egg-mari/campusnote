import { GoogleGenerativeAI } from "@google/generative-ai"

// Gemini API 설정 파일
// API 키는 .env.local 파일에서 관리됩니다

export const GEMINI_CONFIG = {
  // 사용할 모델
  model: "gemini-2.5-flash",

  // 기타 설정
  maxOutputTokens: 2048,
  temperature: 0.7,
}

export const OPENAI_CONFIG = {
  // OpenAI API 키 (Whisper STT용)
  apiKey: process.env.OPENAI_API_KEY || "",
}

export const FLASK_CONFIG = {
  // Flask Whisper 서버 URL
  // 로컬: "http://localhost:5000"
  // ngrok 사용 시: ngrok이 제공하는 URL (예: "https://abcd1234.ngrok.io")
  serverUrl: process.env.NEXT_PUBLIC_FLASK_SERVER_URL || "http://localhost:5000",
}

// API 키 가져오기 헬퍼 함수
export function getGeminiApiKey(): string {
  // 환경 변수에서 API 키 가져오기
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (!apiKey) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인하세요.")
  }
  return apiKey
}

export function getOpenAIApiKey(): string {
  return OPENAI_CONFIG.apiKey
}

export function getGeminiModel() {
  const apiKey = getGeminiApiKey()
  const genAI = new GoogleGenerativeAI(apiKey)
  return genAI.getGenerativeModel({ model: GEMINI_CONFIG.model })
}

export function getFlaskServerUrl(): string {
  return FLASK_CONFIG.serverUrl
}
