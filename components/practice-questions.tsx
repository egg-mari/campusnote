"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileQuestion, PenTool, Send, Loader2 } from "lucide-react"
import { useState } from "react"

interface PracticeQuestionsProps {
  shortAnswers: string[]
  essays: string[]
}

interface QuestionResult {
  questionIndex: number
  type: "short" | "essay"
  question: string
  userAnswer: string
  score: number
  feedback: string
  isCorrect: boolean
}

export function PracticeQuestions({ shortAnswers, essays }: PracticeQuestionsProps) {
  const [shortAnswerInputs, setShortAnswerInputs] = useState<string[]>(Array(shortAnswers.length).fill(""))
  const [essayInputs, setEssayInputs] = useState<string[]>(Array(essays.length).fill(""))
  const [gradingIndex, setGradingIndex] = useState<{ type: "short" | "essay"; index: number } | null>(null)
  const [results, setResults] = useState<QuestionResult[]>([])

  const handleSubmit = async (type: "short" | "essay", index: number) => {
    const answer = type === "short" ? shortAnswerInputs[index] : essayInputs[index]
    const question = type === "short" ? shortAnswers[index] : essays[index]

    if (!answer.trim()) {
      alert("답안을 작성해주세요")
      return
    }

    setGradingIndex({ type, index })

    try {
      const response = await fetch("/api/grade-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer, type }),
      })

      if (!response.ok) throw new Error("채점 실패")

      const result = await response.json()

      const newResult: QuestionResult = {
        questionIndex: index,
        type,
        question,
        userAnswer: answer,
        score: result.score,
        feedback: result.feedback,
        isCorrect: result.isCorrect,
      }

      setResults((prev) => {
        const filtered = prev.filter((r) => !(r.type === type && r.questionIndex === index))
        return [...filtered, newResult]
      })

      if (!result.isCorrect) {
        const wrongNotes = JSON.parse(localStorage.getItem("wrongAnswerNotes") || "[]")
        wrongNotes.push({
          id: Date.now().toString(),
          date: new Date().toISOString(),
          ...newResult,
        })
        localStorage.setItem("wrongAnswerNotes", JSON.stringify(wrongNotes))
      }
    } catch (error) {
      console.error("Grading error:", error)
      alert("채점 중 오류가 발생했습니다")
    } finally {
      setGradingIndex(null)
    }
  }

  const getResult = (type: "short" | "essay", index: number) => {
    return results.find((r) => r.type === type && r.questionIndex === index)
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="short" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white rounded-lg p-1">
          <TabsTrigger value="short">단답형</TabsTrigger>
          <TabsTrigger value="essay">서술형</TabsTrigger>
        </TabsList>

        <TabsContent value="short" className="mt-4 space-y-3">
          {shortAnswers.map((question, index) => {
            const result = getResult("short", index)
            const isGrading = gradingIndex?.type === "short" && gradingIndex.index === index

            return (
              <Card key={index} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                    <FileQuestion className="w-5 h-5 text-[#3B82F6]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1F2937] mb-2">문제 {index + 1}</p>
                    <p className="text-sm text-[#374151] leading-relaxed">{question}</p>
                    <textarea
                      placeholder="답안을 작성하세요..."
                      className="w-full mt-3 p-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                      rows={3}
                      value={shortAnswerInputs[index]}
                      onChange={(e) => {
                        const newInputs = [...shortAnswerInputs]
                        newInputs[index] = e.target.value
                        setShortAnswerInputs(newInputs)
                      }}
                      disabled={!!result}
                    />
                    {result ? (
                      <div className={`mt-3 p-3 rounded-lg ${result.isCorrect ? "bg-green-50" : "bg-red-50"}`}>
                        <p className="text-sm font-medium mb-1">
                          {result.isCorrect ? "정답입니다!" : "오답입니다"}
                          {!result.isCorrect && " (점수: " + result.score + "/100)"}
                        </p>
                        <p className="text-xs text-gray-700">{result.feedback}</p>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleSubmit("short", index)}
                        disabled={isGrading || !shortAnswerInputs[index].trim()}
                        className="mt-3 w-full"
                        size="sm"
                      >
                        {isGrading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            채점 중...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            제출하기
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="essay" className="mt-4 space-y-3">
          {essays.map((question, index) => {
            const result = getResult("essay", index)
            const isGrading = gradingIndex?.type === "essay" && gradingIndex.index === index

            return (
              <Card key={index} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F3E8FF] flex items-center justify-center flex-shrink-0">
                    <PenTool className="w-5 h-5 text-[#8B5CF6]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1F2937] mb-2">문제 {index + 1}</p>
                    <p className="text-sm text-[#374151] leading-relaxed">{question}</p>
                    <textarea
                      placeholder="답안을 작성하세요..."
                      className="w-full mt-3 p-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                      rows={6}
                      value={essayInputs[index]}
                      onChange={(e) => {
                        const newInputs = [...essayInputs]
                        newInputs[index] = e.target.value
                        setEssayInputs(newInputs)
                      }}
                      disabled={!!result}
                    />
                    {result ? (
                      <div className={`mt-3 p-3 rounded-lg ${result.isCorrect ? "bg-green-50" : "bg-red-50"}`}>
                        <p className="text-sm font-medium mb-1">점수: {result.score}/100</p>
                        <p className="text-xs text-gray-700 whitespace-pre-wrap">{result.feedback}</p>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleSubmit("essay", index)}
                        disabled={isGrading || !essayInputs[index].trim()}
                        className="mt-3 w-full"
                        size="sm"
                      >
                        {isGrading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            채점 중...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            제출하기
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </TabsContent>
      </Tabs>
    </div>
  )
}
