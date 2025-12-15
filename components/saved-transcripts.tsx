"use client"

import { useState } from "react"
import { FileText, Trash2, Clock, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface SavedTranscript {
  id: string
  timestamp: Date
  originalText: string
  refinedText: string
}

interface SavedTranscriptsProps {
  transcripts: SavedTranscript[]
  onDelete: (id: string) => void
  onBack?: () => void
}

export function SavedTranscripts({ transcripts, onDelete, onBack }: SavedTranscriptsProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectedTranscript = transcripts.find((t) => t.id === selectedId)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="h-full flex flex-col">
      {onBack && (
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#1F2937] hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">뒤로가기</span>
          </button>
        </div>
      )}

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#1F2937] mb-2">저장된 음성 인식 기록</h2>
            <p className="text-[#6B7280]">총 {transcripts.length}개의 기록이 저장되어 있습니다</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Transcript List */}
            <div className="lg:col-span-1 space-y-3">
              {transcripts.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-[#9CA3AF]">저장된 기록이 없습니다</p>
                </Card>
              ) : (
                transcripts.map((transcript) => (
                  <div
                    key={transcript.id}
                    className={`p-4 cursor-pointer transition-all hover:shadow-md rounded-xl border bg-card text-card-foreground shadow-sm ${
                      selectedId === transcript.id ? "border-[#3B82F6] bg-[#EFF6FF]" : ""
                    }`}
                    onClick={() => setSelectedId(transcript.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-[#3B82F6] flex-shrink-0" />
                          <p className="text-xs text-[#6B7280] flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(transcript.timestamp)}
                          </p>
                        </div>
                        <p className="text-sm text-[#1F2937] line-clamp-2">
                          {transcript.refinedText || transcript.originalText}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(transcript.id)
                          if (selectedId === transcript.id) {
                            setSelectedId(null)
                          }
                        }}
                        className="flex-shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Transcript Detail */}
            <div className="lg:col-span-2">
              {selectedTranscript ? (
                <div className="space-y-4">
                  <Card className="p-6">
                    <h3 className="text-sm font-medium text-[#6B7280] mb-3">원본 텍스트</h3>
                    <div className="text-[#1F2937] leading-relaxed whitespace-pre-wrap">
                      {selectedTranscript.originalText}
                    </div>
                  </Card>
                  {selectedTranscript.refinedText && (
                    <Card className="p-6 border-[#3B82F6] bg-[#EFF6FF]">
                      <h3 className="text-sm font-medium text-[#3B82F6] mb-3">AI 후보정 결과</h3>
                      <div className="text-[#1F2937] leading-relaxed whitespace-pre-wrap">
                        {selectedTranscript.refinedText}
                      </div>
                    </Card>
                  )}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-[#9CA3AF]">왼쪽 목록에서 항목을 선택하세요</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
