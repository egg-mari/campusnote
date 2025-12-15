import { GoogleGenerativeAI } from "@google/generative-ai"
import { getGeminiApiKey, GEMINI_CONFIG } from "@/lib/gemini-config"

export async function POST(request: Request) {
  try {
    const { todayEvents, upcomingTodos, weekSchedule } = await request.json()

    const apiKey = getGeminiApiKey()
    if (!apiKey) {
      return Response.json({ error: "API 키가 설정되지 않았습니다." }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: GEMINI_CONFIG.model })

    const prompt = `당신은 대학생을 위한 AI 학습 도우미입니다. 다음 정보를 바탕으로 오늘 가장 중요한 할 일 2가지만 추천해주세요.

오늘의 일정: ${JSON.stringify(todayEvents)}
미완료 할 일: ${JSON.stringify(upcomingTodos)}
이번 주 일정: ${JSON.stringify(weekSchedule)}

정확히 2개의 추천사항만 제공하되, 각각 한 줄로 간결하게 작성해주세요. 번호는 빼고 추천 내용만 작성해주세요.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    const recommendations = text
      .split("\n")
      .filter((line) => line.trim())
      .map((line) =>
        line
          .replace(/^\d+\.\s*/, "")
          .replace(/^[-•]\s*/, "")
          .trim(),
      )
      .filter((line) => line.length > 0)
      .slice(0, 2)

    return Response.json({ recommendations })
  } catch (error) {
    console.error("Error generating recommendations:", error)
    return Response.json({
      recommendations: ["오늘 수업 전에 복습 시간을 가져보세요", "팀플 진행 상황을 점검해보세요"],
    })
  }
}
