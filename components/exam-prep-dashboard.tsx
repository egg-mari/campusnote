"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GraduationCap, Brain, FileQuestion, Layers, Loader2, RefreshCw, ArrowLeft, Home } from "lucide-react"
import { useState, useEffect } from "react"
import { ImportantConcepts } from "./important-concepts"
import { PracticeQuestions } from "./practice-questions"
import { FlashcardViewer } from "./flashcard-viewer"
import { StudyChecklist } from "./study-checklist"

interface ExamPrepData {
  examScope: string[]
  importantConcepts: { concept: string; explanation: string; frequency: number }[]
  shortAnswerQuestions: string[]
  essayQuestions: string[]
  flashcards: { front: string; back: string }[]
}

interface Note {
  id: string
  files?: { name: string }[]
  contents: { name: string; content: string }[]
  summary?: string
  timestamp: Date
}

interface DocumentContent {
  name: string
  content: string
}

interface ExamPrepDashboardProps {
  notes?: Note[]
  documentContents?: DocumentContent[]
  onBack?: () => void
  onSelectNote?: (id: string) => void
}

export function ExamPrepDashboard({ notes, documentContents: directContents, onBack, onSelectNote }: ExamPrepDashboardProps) {
  const [examData, setExamData] = useState<ExamPrepData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const [questionCount, setQuestionCount] = useState<number>(10)
  const [regeneratingQuestions, setRegeneratingQuestions] = useState(false)

  // notes가 있으면 notes에서 추출, 아니면 directContents 사용
  // 빈 content 필터링
  const documentContents = (
    directContents || 
    (notes ? notes.flatMap((note) => note.contents || []) : [])
  ).filter((doc) => doc && doc.content && doc.content.trim().length > 0)

  useEffect(() => {
    console.log("[v0] ExamPrepDashboard - documentContents:", documentContents.length, "items")
    if (documentContents.length > 0) {
      generateExamPrep()
    }
  }, [notes, directContents])

  const generateExamPrep = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log("[v0] Generating exam prep data with difficulty:", difficulty, "count:", questionCount)
      console.log("[v0] documentContents:", documentContents.length, "items")
      
      if (documentContents.length === 0) {
        throw new Error("분석할 문서가 없습니다.")
      }

      const response = await fetch("/api/exam-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documents: documentContents,
          difficulty,
          questionCount,
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "시험 대비 데이터 생성 실패")
      }

      setExamData(data)
      console.log("[v0] Exam prep data generated")
    } catch (err) {
      console.error("[v0] Error generating exam prep:", err)
      setError(err instanceof Error ? err.message : "알 수 없는 오류")
    } finally {
      setLoading(false)
    }
  }

  const regenerateQuestions = async () => {
    if (!examData) return

    setRegeneratingQuestions(true)
    setError(null)

    try {
      console.log("[v0] Regenerating questions only with difficulty:", difficulty, "count:", questionCount)

      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documents: documentContents,
          difficulty,
          questionCount,
        }),
      })

      if (!response.ok) {
        throw new Error("문제 생성 실패")
      }

      const data = await response.json()
      setExamData({
        ...examData,
        shortAnswerQuestions: data.shortAnswerQuestions,
        essayQuestions: data.essayQuestions,
      })
      console.log("[v0] Questions regenerated")
    } catch (err) {
      console.error("[v0] Error regenerating questions:", err)
      setError(err instanceof Error ? err.message : "알 수 없는 오류")
    } finally {
      setRegeneratingQuestions(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      {onBack && (
        <div className="sticky top-0 bg-white p-4 border-b border-gray-200 z-10">
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

      <div className="p-4 space-y-4">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#EFF6FF] flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-[#3B82F6]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1F2937]">시험 대비</h1>
            <p className="text-sm text-[#6B7280]">AI 기반 학습 자료 ({documentContents.length}개 문서)</p>
          </div>
          {!loading && examData && (
            <button
              onClick={generateExamPrep}
              className="ml-auto p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="새로고침"
            >
              <RefreshCw className="w-5 h-5 text-[#6B7280]" />
            </button>
          )}
        </div>

        {loading ? (
          <Card className="p-8">
            <div className="flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-12 h-12 text-[#3B82F6] animate-spin" />
              <p className="text-[#6B7280]">시험 대비 자료를 생성하는 중...</p>
            </div>
          </Card>
        ) : error ? (
          <Card className="p-6 bg-red-50 border-red-200">
            <p className="text-red-600">{error}</p>
            <Button onClick={generateExamPrep} className="mt-4 bg-transparent" variant="outline">
              다시 시도
            </Button>
          </Card>
        ) : examData ? (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Brain className="w-8 h-8 text-[#3B82F6]" />
                  <div>
                    <p className="text-2xl font-bold text-[#1F2937]">{examData.importantConcepts.length}</p>
                    <p className="text-xs text-[#6B7280]">중요 개념</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Layers className="w-8 h-8 text-[#8B5CF6]" />
                  <div>
                    <p className="text-2xl font-bold text-[#1F2937]">{examData.flashcards.length}</p>
                    <p className="text-xs text-[#6B7280]">플래시카드</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="scope" className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-white rounded-lg p-1">
                <TabsTrigger value="scope">범위</TabsTrigger>
                <TabsTrigger value="concepts">개념</TabsTrigger>
                <TabsTrigger value="questions">문제</TabsTrigger>
                <TabsTrigger value="flashcards">카드</TabsTrigger>
                <TabsTrigger value="checklist">체크</TabsTrigger>
              </TabsList>

              <TabsContent value="scope" className="mt-4">
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FileQuestion className="w-5 h-5 text-[#3B82F6]" />
                    <h2 className="text-lg font-bold text-[#1F2937]">시험 범위</h2>
                  </div>
                  <div className="space-y-3">
                    {examData.examScope.map((scope, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-[#F9FAFB] rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-[#3B82F6] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-[#1F2937] leading-relaxed">{scope}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="concepts" className="mt-4">
                <ImportantConcepts concepts={examData.importantConcepts} />
              </TabsContent>

              <TabsContent value="questions" className="mt-4">
                <Card className="p-4 mb-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1F2937] mb-2">난이도</label>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setDifficulty("easy")}
                          variant={difficulty === "easy" ? "default" : "outline"}
                          size="sm"
                          className={difficulty === "easy" ? "bg-[#10B981]" : ""}
                        >
                          하
                        </Button>
                        <Button
                          onClick={() => setDifficulty("medium")}
                          variant={difficulty === "medium" ? "default" : "outline"}
                          size="sm"
                          className={difficulty === "medium" ? "bg-[#F59E0B]" : ""}
                        >
                          중
                        </Button>
                        <Button
                          onClick={() => setDifficulty("hard")}
                          variant={difficulty === "hard" ? "default" : "outline"}
                          size="sm"
                          className={difficulty === "hard" ? "bg-[#EF4444]" : ""}
                        >
                          상
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1F2937] mb-2">문제 개수 (단답형)</label>
                      <div className="flex gap-2">
                        {[5, 10, 15, 20].map((count) => (
                          <Button
                            key={count}
                            onClick={() => setQuestionCount(count)}
                            variant={questionCount === count ? "default" : "outline"}
                            size="sm"
                          >
                            {count}개
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Button onClick={regenerateQuestions} className="w-full" disabled={regeneratingQuestions}>
                      {regeneratingQuestions ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          생성 중...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2" />새 문제 생성
                        </>
                      )}
                    </Button>
                  </div>
                </Card>

                <PracticeQuestions
                  shortAnswers={examData.shortAnswerQuestions}
                  essays={examData.essayQuestions}
                  onRegenerateQuestions={regenerateQuestions}
                />
              </TabsContent>

              <TabsContent value="flashcards" className="mt-4">
                <FlashcardViewer flashcards={examData.flashcards} />
              </TabsContent>

              <TabsContent value="checklist" className="mt-4">
                <StudyChecklist concepts={examData.importantConcepts.map((c) => c.concept)} />
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-[#6B7280]">문서를 불러오는 중...</p>
          </Card>
        )}
      </div>
    </div>
  )
}
