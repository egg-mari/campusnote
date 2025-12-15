"use client"

import { ArrowLeft, Home, BookOpen, Mic, FileText } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Course {
  id: string
  name: string
  color: string
  professor?: string
}

interface CourseWorkspaceProps {
  course: Course
  onBack: () => void
  onSelectFeature: (feature: "upload" | "audio" | "live") => void
  notes: any[]
  audios: any[]
  lives: any[]
  onDeleteNote: (id: string) => void
  onDeleteAudio: (id: string) => void
  onDeleteLive: (id: string) => void
  onOpenNote: (id: string) => void
}

export function CourseWorkspace({
  course,
  onBack,
  onSelectFeature,
  notes,
  audios,
  lives,
  onDeleteNote,
  onDeleteAudio,
  onDeleteLive,
  onOpenNote,
}: CourseWorkspaceProps) {
  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-6">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#1F2937]" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-[#1F2937]">{course.name}</h1>
              {course.professor && <p className="text-sm text-[#6B7280]">{course.professor}</p>}
            </div>
          </div>
          <button
            onClick={() => (window.location.href = "/")}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <Home className="w-5 h-5 text-[#1F2937]" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center" style={{ backgroundColor: `${course.color}10` }}>
            <p className="text-2xl font-bold" style={{ color: course.color }}>
              {notes.length}
            </p>
            <p className="text-xs text-[#6B7280] mt-1">노트</p>
          </Card>
          <Card className="p-3 text-center" style={{ backgroundColor: `${course.color}10` }}>
            <p className="text-2xl font-bold" style={{ color: course.color }}>
              {audios.length}
            </p>
            <p className="text-xs text-[#6B7280] mt-1">음성</p>
          </Card>
          <Card className="p-3 text-center" style={{ backgroundColor: `${course.color}10` }}>
            <p className="text-2xl font-bold" style={{ color: course.color }}>
              {lives.length}
            </p>
            <p className="text-xs text-[#6B7280] mt-1">실시간</p>
          </Card>
        </div>

        {/* Actions */}
        <Card className="p-4">
          <h3 className="font-bold text-[#1F2937] mb-3">학습 자료 추가</h3>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => onSelectFeature("upload")}
              className="p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-[#3B82F6] hover:bg-blue-50 transition-all"
            >
              <BookOpen className="w-6 h-6 text-[#3B82F6] mx-auto mb-2" />
              <p className="text-xs font-medium text-[#1F2937]">노트 분석</p>
            </button>
            <button
              onClick={() => onSelectFeature("audio")}
              className="p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-[#10B981] hover:bg-green-50 transition-all"
            >
              <Mic className="w-6 h-6 text-[#10B981] mx-auto mb-2" />
              <p className="text-xs font-medium text-[#1F2937]">음성 파일</p>
            </button>
            <button
              onClick={() => onSelectFeature("live")}
              className="p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-[#EF4444] hover:bg-red-50 transition-all"
            >
              <FileText className="w-6 h-6 text-[#EF4444] mx-auto mb-2" />
              <p className="text-xs font-medium text-[#1F2937]">실시간 인식</p>
            </button>
          </div>
        </Card>

        {/* Notes */}
        {notes.length > 0 && (
          <Card className="p-4">
            <h3 className="font-bold text-[#1F2937] mb-3">노트 ({notes.length})</h3>
            <div className="space-y-2">
              {notes.map((note) => (
                <div key={note.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <button onClick={() => onOpenNote(note.id)} className="flex-1 text-left">
                    <p className="text-sm font-medium text-[#1F2937]">{note.name}</p>
                    <p className="text-xs text-[#6B7280]">{new Date(note.date).toLocaleDateString()}</p>
                  </button>
                  <Button variant="ghost" size="sm" onClick={() => onDeleteNote(note.id)} className="text-red-500">
                    삭제
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Audios */}
        {audios.length > 0 && (
          <Card className="p-4">
            <h3 className="font-bold text-[#1F2937] mb-3">음성 파일 ({audios.length})</h3>
            <div className="space-y-2">
              {audios.map((audio) => (
                <div key={audio.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1F2937]">{audio.name}</p>
                    <p className="text-xs text-[#6B7280]">{new Date(audio.date).toLocaleDateString()}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => onDeleteAudio(audio.id)} className="text-red-500">
                    삭제
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Lives */}
        {lives.length > 0 && (
          <Card className="p-4">
            <h3 className="font-bold text-[#1F2937] mb-3">실시간 인식 ({lives.length})</h3>
            <div className="space-y-2">
              {lives.map((live) => (
                <div key={live.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1F2937]">{live.name}</p>
                    <p className="text-xs text-[#6B7280]">{new Date(live.date).toLocaleDateString()}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => onDeleteLive(live.id)} className="text-red-500">
                    삭제
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
