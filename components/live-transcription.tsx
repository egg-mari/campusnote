"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, Square, Save, ArrowLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface LiveTranscriptionProps {
  onSaveTranscript?: (original: string, refined: string) => void
  onBack?: () => void
}

export function LiveTranscription({ onSaveTranscript, onBack }: LiveTranscriptionProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [refinedTranscript, setRefinedTranscript] = useState("")
  const [isRefining, setIsRefining] = useState(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Check if browser supports Web Speech API
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = "ko-KR"

        recognitionRef.current.onresult = (event: any) => {
          let interim = ""
          let final = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptPart = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              final += transcriptPart + " "
            } else {
              interim += transcriptPart
            }
          }

          if (final) {
            setTranscript((prev) => prev + final)
          }
          setInterimTranscript(interim)
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error("[v0] Speech recognition error:", event.error)
        }

        recognitionRef.current.onend = () => {
          if (isRecording) {
            recognitionRef.current?.start()
          }
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [isRecording])

  const startRecording = () => {
    setTranscript("")
    setInterimTranscript("")
    setRefinedTranscript("")
    setIsRecording(true)
    recognitionRef.current?.start()
  }

  const stopRecording = () => {
    setIsRecording(false)
    setInterimTranscript("")
    recognitionRef.current?.stop()
  }

  const refineTranscript = async () => {
    if (!transcript.trim()) return

    setIsRefining(true)
    try {
      const response = await fetch("/api/refine-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: transcript }),
      })

      if (!response.ok) throw new Error("Refinement failed")

      const data = await response.json()
      setRefinedTranscript(data.refinedText)

      if (onSaveTranscript) {
        onSaveTranscript(transcript, data.refinedText)
      }
    } catch (error) {
      console.error("[v0] Refinement error:", error)
    } finally {
      setIsRefining(false)
    }
  }

  const clearAll = () => {
    setTranscript("")
    setInterimTranscript("")
    setRefinedTranscript("")
  }

  const saveTranscript = () => {
    if (onSaveTranscript && (transcript || refinedTranscript)) {
      onSaveTranscript(transcript, refinedTranscript || transcript)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {onBack && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-[#1F2937] hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">뒤로가기</span>
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 text-[#1F2937] hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
              title="홈으로"
            >
              <Home className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#1F2937] mb-2">실시간 음성 인식</h2>
            <p className="text-[#6B7280]">마이크 버튼을 눌러 음성을 텍스트로 변환하세요</p>
          </div>

          {/* Recording Controls */}
          <div className="flex justify-center gap-4">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                size="lg"
                className="bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-full px-8 py-6"
              >
                <Mic className="w-6 h-6 mr-2" />
                녹음 시작
              </Button>
            ) : (
              <Button
                onClick={stopRecording}
                size="lg"
                variant="destructive"
                className="rounded-full px-8 py-6 animate-pulse"
              >
                <Square className="w-6 h-6 mr-2" />
                녹음 중지
              </Button>
            )}
          </div>

          {/* Real-time Transcript */}
          <Card className="p-6 min-h-[200px]">
            <h3 className="text-sm font-medium text-[#6B8280] mb-3">실시간 변환 결과</h3>
            <div className="text-[#1F2937] leading-relaxed whitespace-pre-wrap">
              {transcript}
              {interimTranscript && <span className="text-[#6B7280] italic">{interimTranscript}</span>}
              {!transcript && !interimTranscript && (
                <p className="text-[#9CA3AF] text-center py-8">녹음을 시작하면 여기에 텍스트가 표시됩니다</p>
              )}
            </div>
          </Card>

          {/* Action Buttons */}
          {transcript && (
            <div className="flex gap-3 justify-center">
              <Button onClick={refineTranscript} disabled={isRefining} className="bg-[#3B82F6] hover:bg-[#2563EB]">
                {isRefining ? "후보정 중..." : "AI 후보정"}
              </Button>
              <Button onClick={saveTranscript} className="bg-[#10B981] hover:bg-[#059669]">
                <Save className="w-4 h-4 mr-2" />
                저장
              </Button>
              <Button onClick={clearAll} variant="outline">
                초기화
              </Button>
            </div>
          )}

          {/* Refined Transcript */}
          {refinedTranscript && (
            <Card className="p-6 border-[#3B82F6] bg-[#EFF6FF]">
              <h3 className="text-sm font-medium text-[#3B82F6] mb-3">AI 후보정 결과</h3>
              <div className="text-[#1F2937] leading-relaxed whitespace-pre-wrap">{refinedTranscript}</div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
