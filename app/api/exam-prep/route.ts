import { GoogleGenerativeAI } from "@google/generative-ai"
import { getGeminiApiKey, GEMINI_CONFIG } from "@/lib/gemini-config"

export async function POST(req: Request) {
  try {
    const { documents, difficulty = "medium", questionCount = 10 } = await req.json()

    if (!documents || documents.length === 0) {
      return Response.json({ error: "문서가 없습니다." }, { status: 400 })
    }

    const apiKey = getGeminiApiKey()
    if (!apiKey) {
      return Response.json({ error: "API 키가 설정되지 않았습니다." }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: GEMINI_CONFIG.model })

    const documentsText = documents
      .map((doc: { name: string; content: string }) => `[문서: ${doc.name}]\n${doc.content}`)
      .join("\n\n---\n\n")

    const difficultyText = {
      easy: "쉬운 난이도 (기본 개념 이해)",
      medium: "중간 난이도 (개념 적용)",
      hard: "어려운 난이도 (심화 분석 및 응용)",
    }[difficulty]

    const essayCount = Math.ceil(questionCount / 2)

    const prompt = `다음 문서들을 분석하여 시험 대비 자료를 JSON 형식으로 생성해주세요:

문서:
${documentsText}

난이도: ${difficultyText}
단답형 문제 개수: ${questionCount}개
서술형 문제 개수: ${essayCount}개

다음 형식으로 JSON만 반환하세요 (다른 설명 없이):
{
  "examScope": ["범위1", "범위2", "범위3", "범위4", "범위5"],
  "importantConcepts": [
    {"concept": "개념명", "explanation": "상세 설명", "frequency": 빈도수},
    ...20개
  ],
  "shortAnswerQuestions": ["단답형 문제1", "단답형 문제2", ...${questionCount}개],
  "essayQuestions": ["서술형 문제1", "서술형 문제2", ...${essayCount}개],
  "flashcards": [
    {"front": "개념", "back": "설명"},
    ...15개
  ]
}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Extract JSON from markdown code blocks if present
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/)
    const jsonText = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text

    const data = JSON.parse(jsonText)

    console.log("[v0] Exam prep data generated with difficulty:", difficulty, "count:", questionCount)

    return Response.json(data)
  } catch (error) {
    console.error("[v0] Exam prep error:", error)
    return Response.json(
      { error: `시험 대비 데이터 생성 중 오류: ${error instanceof Error ? error.message : "알 수 없는 오류"}` },
      { status: 500 },
    )
  }
}
