"use client"

import { FileText, Plus, Clock, Mic, Radio, Save } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UploadedFile {
  id: string
  name: string
  size: number
  file: File
}

interface SidebarProps {
  activeView: "upload" | "summary" | "audio" | "transcription" | "live" | "saved"
  setActiveView: (view: "upload" | "summary" | "audio" | "transcription" | "live" | "saved") => void
  uploadedFiles: UploadedFile[]
  savedTranscriptsCount?: number
}

export function Sidebar({ activeView, setActiveView, uploadedFiles, savedTranscriptsCount = 0 }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1F2937] mb-2">AI Notebook</h1>
        <p className="text-sm text-[#6B7280]">문서 기반 AI 서비스</p>
      </div>

      <div className="space-y-2 mb-6">
        <Button
          onClick={() => setActiveView("upload")}
          className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-full"
        >
          <Plus className="w-4 h-4 mr-2" />새 문서
        </Button>
        <Button
          onClick={() => setActiveView("audio")}
          variant="outline"
          className="w-full rounded-full border-[#3B82F6] text-[#3B82F6] hover:bg-[#EFF6FF]"
        >
          <Mic className="w-4 h-4 mr-2" />
          음성 변환
        </Button>
        <Button
          onClick={() => setActiveView("live")}
          variant="outline"
          className="w-full rounded-full border-[#10B981] text-[#10B981] hover:bg-[#D1FAE5]"
        >
          <Radio className="w-4 h-4 mr-2" />
          실시간 인식
        </Button>
        <Button
          onClick={() => setActiveView("saved")}
          variant="outline"
          className="w-full rounded-full border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#F5F3FF]"
        >
          <Save className="w-4 h-4 mr-2" />
          저장된 기록 ({savedTranscriptsCount})
        </Button>
      </div>

      {/* Recent Documents */}
      <div className="flex-1 overflow-auto">
        <h2 className="text-sm font-medium text-[#6B7280] mb-3 flex items-center">
          <Clock className="w-4 h-4 mr-2" />
          업로드된 문서
        </h2>
        <div className="space-y-2">
          {uploadedFiles.length > 0 ? (
            uploadedFiles.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setActiveView("summary")}
                className="w-full text-left p-3 rounded-lg hover:bg-[#EFF6FF] transition-colors group"
              >
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-[#3B82F6] mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1F2937] truncate group-hover:text-[#3B82F6]">{doc.name}</p>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <p className="text-sm text-[#6B7280] text-center py-8">업로드된 문서가 없습니다</p>
          )}
        </div>
      </div>
    </aside>
  )
}
