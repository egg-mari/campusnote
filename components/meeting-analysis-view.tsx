"use client"

import { ArrowLeft, Home, Sparkles, Copy, Check, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import ReactMarkdown from "react-markdown"

interface MeetingSummary {
  core: string
  decisions: string[]
  nextSteps: string[]
}

interface Todo {
  task: string
  assignee: string
  deadline: string
}

interface AnalysisResult {
  summary: MeetingSummary
  todos: Todo[]
  report: string
}

interface MeetingAnalysisViewProps {
  meetingTitle: string
  meetingContent: string
  analysis: AnalysisResult
  onBack: () => void
  members: string[]
  onUpdateTodo: (index: number, field: "assignee" | "deadline" | "completed", value: string | boolean) => void
  onSaveTodos: () => void
}

export function MeetingAnalysisView({
  meetingTitle,
  meetingContent,
  analysis,
  onBack,
  members,
  onUpdateTodo,
  onSaveTodos,
}: MeetingAnalysisViewProps) {
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    todos: true,
    report: true,
  })
  const [copiedReport, setCopiedReport] = useState(false)

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleCopyReport = () => {
    navigator.clipboard.writeText(analysis.report)
    setCopiedReport(true)
    setTimeout(() => setCopiedReport(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center gap-3 z-10">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-[#1F2937]" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-[#1F2937] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#8B5CF6]" />
            AI 분석 결과
          </h1>
          <p className="text-xs text-[#6B7280]">{meetingTitle}</p>
        </div>
        <button onClick={() => window.location.reload()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Home className="w-5 h-5 text-[#1F2937]" />
        </button>
      </div>

      <div className="p-4 max-w-4xl mx-auto space-y-4">
        {/* Summary Card */}
        <Card className="overflow-hidden">
          <div
            className="px-4 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection("summary")}
          >
            <h2 className="font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              회의록 요약
            </h2>
            {expandedSections.summary ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>

          {expandedSections.summary && (
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#6B7280] mb-2">핵심 요약</h3>
                <p className="text-sm text-[#1F2937] bg-[#F3F4F6] p-3 rounded-lg">{analysis.summary.core}</p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#6B7280] mb-2">결정 사항</h3>
                <ul className="space-y-2">
                  {analysis.summary.decisions.map((decision, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-[#1F2937]">
                      <span className="text-[#8B5CF6] font-bold">•</span>
                      {decision}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#6B7280] mb-2">다음 단계</h3>
                <ul className="space-y-2">
                  {analysis.summary.nextSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-[#1F2937]">
                      <span className="text-[#3B82F6] font-bold">→</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </Card>

        {/* Todos Card */}
        <Card className="overflow-hidden">
          <div
            className="px-4 py-3 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection("todos")}
          >
            <h2 className="font-bold">할 일 자동 추출 ({analysis.todos.length})</h2>
            {expandedSections.todos ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>

          {expandedSections.todos && (
            <div className="p-4 space-y-3">
              {analysis.todos.map((todo, idx) => (
                <div key={idx} className="p-3 bg-[#F9FAFB] rounded-lg space-y-2">
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      className="mt-1"
                      onChange={(e) => onUpdateTodo(idx, "completed", e.target.checked)}
                    />
                    <p className="flex-1 text-sm text-[#1F2937]">{todo.task}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pl-6">
                    <div>
                      <label className="text-xs text-[#6B7280] block mb-1">담당자</label>
                      <select
                        value={todo.assignee}
                        onChange={(e) => onUpdateTodo(idx, "assignee", e.target.value)}
                        className="w-full text-xs px-2 py-1 border rounded"
                      >
                        <option value="">미배정</option>
                        {members.map((member) => (
                          <option key={member} value={member}>
                            {member}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-[#6B7280] block mb-1">마감일</label>
                      <input
                        type="date"
                        value={todo.deadline}
                        onChange={(e) => onUpdateTodo(idx, "deadline", e.target.value)}
                        className="w-full text-xs px-2 py-1 border rounded"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button onClick={onSaveTodos} className="w-full bg-[#3B82F6]">
                할 일 팀플 일정에 저장
              </Button>
            </div>
          )}
        </Card>

        {/* Report Card */}
        <Card className="overflow-hidden">
          <div
            className="px-4 py-3 bg-gradient-to-r from-[#10B981] to-[#059669] text-white flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection("report")}
          >
            <h2 className="font-bold">보고서 초안</h2>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation()
                  handleCopyReport()
                }}
              >
                {copiedReport ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
              {expandedSections.report ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>

          {expandedSections.report && (
            <div className="p-4">
              <div className="prose prose-sm max-w-none bg-white border rounded-lg p-4">
                <ReactMarkdown>{analysis.report}</ReactMarkdown>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
