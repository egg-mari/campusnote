"use client"

import { Loader2, CheckCircle2, FileText, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TranscriptionResultProps {
  audioFileName: string
  rawTranscript: string | null
  refinedTranscript: string | null
  isProcessing: boolean
  error: string | null
  onReset: () => void
  onBack?: () => void
}

export function TranscriptionResult({
  audioFileName,
  rawTranscript,
  refinedTranscript,
  isProcessing,
  error,
  onReset,
  onBack,
}: TranscriptionResultProps) {
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
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#1F2937] mb-2">음성 변환 결과</h1>
              <p className="text-[#6B7280]">{audioFileName}</p>
            </div>
            <Button onClick={onReset} variant="outline" className="rounded-full bg-transparent">
              새 파일 업로드
            </Button>
          </div>

          {/* Processing Status */}
          {isProcessing && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center gap-4">
                <Loader2 className="w-8 h-8 text-[#3B82F6] animate-spin" />
                <div>
                  <h3 className="text-lg font-semibold text-[#1F2937]">처리 중...</h3>
                  <p className="text-[#6B7280]">음성을 텍스트로 변환하고 AI로 후보정하고 있습니다</p>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 rounded-2xl shadow-sm border border-red-200 p-8">
              <h3 className="text-lg font-semibold text-red-900 mb-2">오류 발생</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Raw Transcript */}
          {rawTranscript && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-[#6B7280]" />
                <h3 className="text-lg font-semibold text-[#1F2937]">원본 변환 텍스트 (STT)</h3>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-[#1F2937] leading-relaxed whitespace-pre-wrap">{rawTranscript}</p>
              </div>
            </div>
          )}

          {/* Refined Transcript */}
          {refinedTranscript && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                <h3 className="text-lg font-semibold text-[#1F2937]">AI 후보정 텍스트</h3>
              </div>
              <div className="bg-[#EFF6FF] rounded-xl p-6">
                <p className="text-[#1F2937] leading-relaxed whitespace-pre-wrap">{refinedTranscript}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
