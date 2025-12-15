import type { NextRequest } from "next/server"
import { getGeminiModel } from "@/lib/gemini-config"

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()

    if (!text) {
      return Response.json({ error: "텍스트가 제공되지 않았습니다" }, { status: 400 })
    }

    const model = getGeminiModel()

    const prompt = `다음 음성 인식 텍스트를 교정해주세요:
- 맞춤법과 띄어쓰기를 정확하게 수정
- 문장 부호를 적절히 추가
- 문장을 자연스럽게 다듬기
- 원래 의미는 절대 바꾸지 말 것

음성 인식 텍스트:
${text}

교정된 텍스트만 출력하세요 (설명 없이):
`

    const result = await model.generateContent(prompt)
    const refinedText = result.response.text()

    return Response.json({ refinedText })
  } catch (error) {
    console.error("[v0] Text refinement error:", error)
    return Response.json({ error: "텍스트 후보정 중 오류가 발생했습니다" }, { status: 500 })
  }
}
