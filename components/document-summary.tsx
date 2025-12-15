"use client"

import { useEffect, useState } from "react"
import { Sparkles, MessageCircle, Key, BookOpen, FileText, Loader2, ArrowLeft, Home } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExamPrepDashboard } from "@/components/exam-prep-dashboard"

interface UploadedFile {
  id: string
  name: string
  size: number
  file: File
}

interface DocumentContent {
  name: string
  content: string
}

interface DocumentSummaryProps {
  uploadedFiles: UploadedFile[]
  documentContents: DocumentContent[]
  cachedSummary?: string
  onQuestionClick?: (question: string) => void
  onSummaryGenerated?: (summary: string) => void
  onOpenChat?: () => void
  onBack?: () => void
}

function parseSummary(summary: string) {
  const sections = {
    summary: "",
    keyParts: [] as string[],
    keywords: [] as string[],
    questions: [] as string[],
  }

  const summaryMatch = summary.match(/\[요약\]([\s\S]*?)(?=\[|$)/i)
  if (summaryMatch) {
    sections.summary = summaryMatch[1].trim()
  }

  const keyPartsMatch = summary.match(/\[핵심파트\]([\s\S]*?)(?=\[|$)/i)
  if (keyPartsMatch) {
    const parts = keyPartsMatch[1]
      .trim()
      .split("\n")
      .filter((line) => line.trim().startsWith("-"))
    sections.keyParts = parts.map((p) => p.replace(/^-\s*/, "").trim())
  }

  const keywordsMatch = summary.match(/\[주요키워드\]([\s\S]*?)(?=\[|$)/i)
  if (keywordsMatch) {
    sections.keywords = keywordsMatch[1]
      .trim()
      .split(/[,，]/)
      .map((k) => k.trim())
      .filter((k) => k)
  }

  const questionsMatch = summary.match(/\[자동생성질문\]([\s\S]*?)(?=\[|$)/i)
  if (questionsMatch) {
    const qs = questionsMatch[1]
      .trim()
      .split("\n")
      .filter((line) => /^\d+\./.test(line.trim()))
    sections.questions = qs.map((q) => q.replace(/^\d+\.\s*/, "").trim())
  }

  return sections
}

export function DocumentSummary({
  uploadedFiles,
  documentContents,
  cachedSummary,
  onQuestionClick,
  onSummaryGenerated,
  onOpenChat,
  onBack,
}: DocumentSummaryProps) {
  const [summary, setSummary] = useState<string>(cachedSummary || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)
  const [showExamPrep, setShowExamPrep] = useState(false)

  const parsedSummary = summary ? parseSummary(summary) : null

  useEffect(() => {
    if (cachedSummary) {
      setSummary(cachedSummary)
      console.log("[v0] Using cached summary for", uploadedFiles.length, "files")
    }
  }, [])

  useEffect(() => {
    if (documentContents.length > 0 && !loading && !summary) {
      generateSummary()
    }
  }, [documentContents])

  const generateSummary = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log("[v0] Generating summary for", documentContents.length, "documents")

      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documents: documentContents }),
      })

      if (!response.ok) {
        throw new Error("요약 생성에 실패했습니다.")
      }

      const data = await response.json()
      setSummary(data.summary)
      onSummaryGenerated?.(data.summary)
      console.log("[v0] Summary generated for all documents")
    } catch (err) {
      console.error("[v0] Error generating summary:", err)
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const handleQuestionClick = (question: string) => {
    setSelectedQuestion(question)
    onQuestionClick?.(question)
  }

  const handleOpenChat = () => {
    if (selectedQuestion) {
      onQuestionClick?.(selectedQuestion)
    }
    onOpenChat?.()
  }

  if (showExamPrep) {
    return <ExamPrepDashboard documentContents={documentContents} onBack={() => setShowExamPrep(false)} />
  }

  return (
    <div className="h-screen overflow-auto">
      {onBack && (
        <div className="sticky top-0 bg-[#F9FAFB] p-4 border-b border-gray-200 z-10">
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

      <div className="p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#3B82F6]" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-[#1F2937]">분석된 문서</h2>
              </div>
            </div>
            <div className="space-y-2 pl-[52px]">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-[#3B82F6]"></div>
                  <span className="text-[#1F2937] font-medium">{file.name}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center">
                {loading ? (
                  <Loader2 className="w-5 h-5 text-[#3B82F6] animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5 text-[#3B82F6]" />
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-[#1F2937] mb-2">문서 요약</h2>
                {loading ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-5/6"></div>
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-4/6"></div>
                  </div>
                ) : error ? (
                  <div className="text-red-500 text-sm">{error}</div>
                ) : parsedSummary ? (
                  <p className="text-[#1F2937] leading-relaxed whitespace-pre-wrap">{parsedSummary.summary}</p>
                ) : (
                  <p className="text-[#6B7280] text-sm">요약을 생성하는 중...</p>
                )}
              </div>
            </div>
          </Card>

          {parsedSummary && parsedSummary.keyParts.length > 0 && (
            <Card className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in [animation-delay:100ms]">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-[#3B82F6]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-[#1F2937] mb-3">핵심 파트</h2>
                  <div className="space-y-3">
                    {parsedSummary.keyParts.map((part, index) => (
                      <div key={index} className="pl-4 border-l-2 border-[#3B82F6]">
                        <p className="text-[#1F2937] leading-relaxed">{part}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {parsedSummary && parsedSummary.keywords.length > 0 && (
            <Card className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in [animation-delay:200ms]">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center">
                  <Key className="w-5 h-5 text-[#3B82F6]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-[#1F2937] mb-3">주요 키워드</h2>
                  <div className="flex flex-wrap gap-2">
                    {parsedSummary.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-[#EFF6FF] text-[#3B82F6] rounded-full text-sm font-medium"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {parsedSummary && parsedSummary.questions.length > 0 && (
            <Card className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in [animation-delay:300ms]">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-[#3B82F6]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-[#1F2937] mb-3">자동 생성 질문</h2>
                  <div className="space-y-2">
                    {parsedSummary.questions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuestionClick(question)}
                        className={`w-full text-left p-3 rounded-lg transition-colors text-sm cursor-pointer ${
                          selectedQuestion === question
                            ? "bg-[#3B82F6] text-white"
                            : "bg-[#F9FAFB] hover:bg-[#EFF6FF] text-[#1F2937]"
                        }`}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {parsedSummary && (
            <>
              <div className="flex justify-center gap-3 pt-4">
                <Button
                  onClick={() => setShowExamPrep(true)}
                  className="bg-[#10B981] hover:bg-[#059669] text-white rounded-full px-8 py-6 text-base font-semibold"
                >
                  🎓 시험 대비 모드
                </Button>
                <Button
                  onClick={handleOpenChat}
                  className="bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-full px-8 py-6 text-base font-semibold"
                >
                  {selectedQuestion ? "선택한 질문하러 가기" : "이 문서에 대해 질문하기"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
