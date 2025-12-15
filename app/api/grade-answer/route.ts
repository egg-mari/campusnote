import { type NextRequest, NextResponse } from "next/server"
import { getGeminiModel } from "@/lib/gemini-config"

export async function POST(req: NextRequest) {
  try {
    const { question, answer, type } = await req.json()

    const model = getGeminiModel()

    const prompt =
      type === "short"
        ? `다음은 단답형 문제와 학생의 답안입니다.

문제: ${question}
학생 답안: ${answer}

위 답안을 채점하고 다음 형식으로 JSON을 반환하세요:
{
  "isCorrect": true/false,
  "score": 0-100,
  "feedback": "피드백 내용"
}

단답형은 정답/오답만 판단하고, 오답일 경우 올바른 답을 알려주세요.`
        : `다음은 서술형 문제와 학생의 답안입니다.

문제: ${question}
학생 답안: ${answer}

위 답안을 100점 만점으로 채점하고 다음 형식으로 JSON을 반환하세요:
{
  "isCorrect": false,
  "score": 0-100,
  "feedback": "상세한 피드백 (잘한 점, 부족한 점, 개선 방향)"
}

서술형은 내용의 정확성, 논리성, 완성도를 종합적으로 평가하세요.`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Invalid response format")
    }

    const gradeResult = JSON.parse(jsonMatch[0])

    return NextResponse.json(gradeResult)
  } catch (error) {
    console.error("Grading error:", error)
    return NextResponse.json({ error: "채점 중 오류가 발생했습니다" }, { status: 500 })
  }
}
