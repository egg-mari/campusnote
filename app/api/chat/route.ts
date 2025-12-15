import { GoogleGenerativeAI } from "@google/generative-ai"
import { getGeminiApiKey, GEMINI_CONFIG } from "@/lib/gemini-config"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages, documents } = await req.json()

    console.log("[v0] Chat received documents:", documents?.length || 0)

    const apiKey = getGeminiApiKey()
    if (!apiKey) {
      return Response.json({ error: "API 키가 설정되지 않았습니다." }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: GEMINI_CONFIG.model })

    let systemMessage = ""

    if (documents && documents.length > 0) {
      // Document-based chat: reference documents
      systemMessage =
        "당신은 업로드된 문서를 기반으로 답변하는 AI 어시스턴트입니다. 답변 시 마크다운 강조 표시를 사용하지 마세요. 평문으로 작성하되, 코드나 구조화된 정보는 들여쓰기와 줄바꿈을 사용해서 보기 좋게 정리해주세요."
      systemMessage += "\n\n다음은 참고할 문서 내용입니다:\n\n"

      for (let i = 0; i < documents.length; i++) {
        const docContent = documents[i]
        console.log("[v0] Processing document", i + 1, "length:", docContent?.length || 0)
        systemMessage += `문서 ${i + 1}:\n${docContent}\n\n`
      }

      systemMessage +=
        "\n위 문서 내용을 참고하여 사용자의 질문에 답변해주세요. 답변 시 어떤 문서의 정보를 사용했는지 명시해주세요."
    } else {
      // General chat: no document reference
      systemMessage =
        "당신은 친절하고 유용한 AI 어시스턴트입니다. 사용자의 질문에 자유롭게 답변해주세요. 답변 시 마크다운 강조 표시를 사용하지 마세요. 평문으로 작성하되, 코드나 구조화된 정보는 들여쓰기와 줄바꿈을 사용해서 보기 좋게 정리해주세요. 다양한 주제에 대해 도움을 드릴 수 있습니다."
    }

    const history = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }))

    const lastMessage = messages[messages.length - 1]?.content || ""

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemMessage }] },
        {
          role: "model",
          parts: [
            {
              text:
                documents && documents.length > 0
                  ? "알겠습니다. 문서를 기반으로 답변하겠습니다."
                  : "안녕하세요! 무엇을 도와드릴까요?",
            },
          ],
        },
        ...history,
      ],
    })

    const result = await chat.sendMessageStream(lastMessage)

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text()
            controller.enqueue(encoder.encode(text))
          }
          controller.close()
        } catch (error) {
          console.error("[v0] Stream error:", error)
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    })
  } catch (error) {
    console.error("[v0] Chat error:", error)
    return Response.json(
      { error: `채팅 중 오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}` },
      { status: 500 },
    )
  }
}
