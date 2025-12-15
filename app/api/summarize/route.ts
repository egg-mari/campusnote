import { GoogleGenerativeAI } from "@google/generative-ai"
import { getGeminiApiKey, GEMINI_CONFIG } from "@/lib/gemini-config"

export async function POST(req: Request) {
  try {
    const { documents } = await req.json()

    if (!documents || documents.length === 0) {
      return Response.json({ error: "문서가 없습니다." }, { status: 400 })
    }

    const apiKey = getGeminiApiKey()
    if (!apiKey) {
      return Response.json({ error: "API 키가 설정되지 않았습니다." }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: GEMINI_CONFIG.model })

    console.log(`[v0] Processing ${documents.length} documents together`)

    const documentsText = documents
      .map((doc: { name: string; content: string }) => `[문서: ${doc.name}]\n${doc.content}`)
      .join("\n\n---\n\n")

    const prompt = `다음 ${documents.length}개의 문서들을 전체적으로 분석하여 아래 형식으로 정리해주세요. 강조 표시(**, __, 등)를 사용하지 말고 평문으로만 작성해주세요:

[요약]
전체 문서들의 핵심 내용을 통합하여 5-7문장으로 요약. 문서들 간의 연관성이나 흐름이 있다면 언급하세요.

[핵심파트]
- 파트1: (어떤 내용인지 구체적으로 설명, 해당 문서명 포함)
- 파트2: (어떤 내용인지 구체적으로 설명, 해당 문서명 포함)
- 파트3: (어떤 내용인지 구체적으로 설명, 해당 문서명 포함)
- 파트4: (어떤 내용인지 구체적으로 설명, 해당 문서명 포함)
- 파트5: (어떤 내용인지 구체적으로 설명, 해당 문서명 포함)

[주요키워드]
모든 문서에서 추출한 중요 키워드 7-10개 (쉼표로 구분)

[자동생성질문]
1. (전체 문서 내용을 통합하여 만든 질문)
2. (전체 문서 내용을 통합하여 만든 질문)
3. (전체 문서 내용을 통합하여 만든 질문)
4. (문서들 간의 연관성에 대한 질문)
5. (실용적인 적용 방법에 대한 질문)

문서 내용:
${documentsText}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const summary = response.text()

    console.log("[v0] Unified summary generated for all documents")

    return Response.json({ summary })
  } catch (error) {
    console.error("[v0] Summarize error:", error)
    return Response.json(
      { error: `요약 생성 중 오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}` },
      { status: 500 },
    )
  }
}
