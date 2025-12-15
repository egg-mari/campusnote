import { GoogleGenerativeAI } from "@google/generative-ai"
import { getGeminiApiKey, GEMINI_CONFIG } from "@/lib/gemini-config"

export async function POST(req: Request) {
  try {
    const { content, members } = await req.json()

    const apiKey = getGeminiApiKey()
    if (!apiKey) {
      return Response.json({ error: "API 키가 설정되지 않았습니다." }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: GEMINI_CONFIG.model })

    const prompt = `다음 회의록을 분석해주세요:

회의록 내용:
${content}

팀원 목록: ${members.join(", ")}

다음 형식의 JSON으로 응답해주세요:
{
  "summary": {
    "core": "핵심 요약",
    "decisions": ["결정사항1", "결정사항2"],
    "nextSteps": ["다음 단계1", "다음 단계2"]
  },
  "todos": [
    {
      "task": "할 일 내용",
      "assignee": "담당자 이름 (팀원 목록에서 찾아서)",
      "deadline": "마감일 (YYYY-MM-DD 형식, 없으면 빈 문자열)"
    }
  ],
  "report": "# 보고서 제목\\n\\n## 개요\\n...\\n## 문제정의\\n...\\n## 논의내용\\n...\\n## 결정사항\\n...\\n## 향후 계획\\n..."
}

할 일에서 담당자는 반드시 팀원 목록에 있는 이름 중 하나여야 합니다. 
회의록에서 담당자를 명확히 찾을 수 없으면 빈 문자열로 남겨주세요.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    console.log("[v0] Meeting analysis response received")

    // JSON 파싱
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response")
    }

    const parsedResult = JSON.parse(jsonMatch[0])

    return Response.json(parsedResult)
  } catch (error: any) {
    console.error("[v0] Meeting analysis error:", error)
    return Response.json({ error: error.message || "Failed to analyze meeting" }, { status: 500 })
  }
}
