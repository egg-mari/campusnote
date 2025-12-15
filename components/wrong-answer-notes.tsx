"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle, Trash2, ArrowLeft, Home } from "lucide-react"
import { useState, useEffect } from "react"

interface WrongAnswer {
  id: string
  date: string
  questionIndex: number
  type: "short" | "essay"
  question: string
  userAnswer: string
  score: number
  feedback: string
}

interface WrongAnswerNotesProps {
  onBack: () => void
}

export function WrongAnswerNotes({ onBack }: WrongAnswerNotesProps) {
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("wrongAnswerNotes")
    if (stored) {
      setWrongAnswers(JSON.parse(stored))
    }
  }, [])

  const handleDelete = (id: string) => {
    const updated = wrongAnswers.filter((w) => w.id !== id)
    setWrongAnswers(updated)
    localStorage.setItem("wrongAnswerNotes", JSON.stringify(updated))
  }

  const handleClearAll = () => {
    if (confirm("모든 오답노트를 삭제하시겠습니까?")) {
      setWrongAnswers([])
      localStorage.removeItem("wrongAnswerNotes")
    }
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="sticky top-0 bg-white p-4 border-b border-gray-200 z-10">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.location.reload()}
            className="rounded-full"
            title="홈으로"
          >
            <Home className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-[#1F2937]">오답노트</h1>
            <p className="text-xs text-[#6B7280]">{wrongAnswers.length}개 문항</p>
          </div>
          {wrongAnswers.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleClearAll}>
              전체 삭제
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {wrongAnswers.length === 0 ? (
          <Card className="p-8 text-center">
            <XCircle className="w-12 h-12 mx-auto mb-3 text-[#9CA3AF]" />
            <p className="text-sm text-[#6B7280]">오답이 없습니다</p>
            <p className="text-xs text-[#9CA3AF] mt-1">문제를 풀고 틀린 답을 복습하세요</p>
          </Card>
        ) : (
          wrongAnswers.map((wrong) => (
            <Card key={wrong.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      wrong.type === "short" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {wrong.type === "short" ? "단답형" : "서술형"}
                  </span>
                  <span className="text-xs text-[#6B7280]">{new Date(wrong.date).toLocaleDateString()}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(wrong.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>

              <p className="text-sm font-medium text-[#1F2937] mb-2">문제</p>
              <p className="text-sm text-[#374151] mb-3">{wrong.question}</p>

              <p className="text-sm font-medium text-[#1F2937] mb-2">내 답안</p>
              <p className="text-sm text-[#6B7280] mb-3 p-3 bg-red-50 rounded">{wrong.userAnswer}</p>

              <p className="text-sm font-medium text-[#1F2937] mb-2">점수: {wrong.score}/100</p>
              <p className="text-sm text-[#374151] mb-3">{wrong.feedback}</p>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
