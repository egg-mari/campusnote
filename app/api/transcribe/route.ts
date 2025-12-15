import { type NextRequest, NextResponse } from "next/server"
import { getGeminiModel } from "@/lib/gemini-config"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    console.log("[v0] Audio file received:", audioFile.name, audioFile.size)

    const flaskFormData = new FormData()
    flaskFormData.append("audio", audioFile)

    console.log("[v0] Sending to Flask Whisper server...")

    // Flask 서버 URL (로컬)
    const flaskUrl = "http://localhost:5000/transcribe"

    let whisperResponse
    try {
      whisperResponse = await fetch(flaskUrl, {
        method: "POST",
        body: flaskFormData,
      })
    } catch (fetchError) {
      console.error("[v0] Flask server connection error:", fetchError)
      return NextResponse.json(
        {
          error: "Flask 서버에 연결할 수 없습니다. localhost:5000에서 Flask 서버가 실행 중인지 확인하세요.",
        },
        { status: 503 },
      )
    }

    if (!whisperResponse.ok) {
      const errorText = await whisperResponse.text()
      console.error("[v0] Flask server error:", errorText)
      return NextResponse.json({ error: `Whisper 서버 오류: ${errorText}` }, { status: whisperResponse.status })
    }

    const whisperResult = await whisperResponse.json()
    const rawTranscript = whisperResult.text

    console.log("[v0] Raw transcript from Flask:", rawTranscript)

    const model = getGeminiModel()

    const prompt = `다음은 음성 인식(STT)으로 변환된 텍스트입니다. 이 텍스트를 자연스럽게 후보정해주세요:
- 문장 부호를 추가하세요
- 맞춤법을 교정하세요
- 문장을 자연스럽게 다듬으세요
- 원본의 의미는 그대로 유지하세요

원본 텍스트:
${rawTranscript}

후보정된 텍스트:`

    console.log("[v0] Refining with Gemini LLM...")

    const result = await model.generateContent(prompt)
    const refinedTranscript = result.response.text()

    console.log("[v0] Refined transcript:", refinedTranscript)

    return NextResponse.json({
      rawTranscript,
      refinedTranscript,
    })
  } catch (error) {
    console.error("[v0] Transcription error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Transcription failed" },
      { status: 500 },
    )
  }
}
