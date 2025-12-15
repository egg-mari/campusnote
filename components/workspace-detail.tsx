"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ChevronRight,
  FileText,
  Mic,
  Radio,
  Plus,
  MessageSquare,
  Trash2,
  Loader2,
  Home,
  GraduationCap,
} from "lucide-react"
import type { Workspace } from "./workspace-manager"

interface WorkspaceNote {
  id: string
  name: string
  date: Date
}

interface WorkspaceAudio {
  id: string
  name: string
  date: Date
  transcription?: string
}

interface WorkspaceLive {
  id: string
  name: string
  date: Date
  text: string
}

interface WorkspaceDetailProps {
  workspace: Workspace
  onSelectFeature: (feature: "upload" | "audio" | "live" | "exam-prep") => void
  onBack: () => void
  recentNotes: WorkspaceNote[]
  recentAudios: WorkspaceAudio[]
  recentLives: WorkspaceLive[]
  onOpenNote: (id: string) => void
  onDeleteNote?: (id: string) => void
  onDeleteAudio?: (id: string) => void
  onDeleteLive?: (id: string) => void
  onOpenWorkspaceChat?: () => void
  isProcessingAudio?: string | null
}

export function WorkspaceDetail({
  workspace,
  onSelectFeature,
  onBack,
  recentNotes,
  recentAudios,
  recentLives,
  onOpenNote,
  onDeleteNote,
  onDeleteAudio,
  onDeleteLive,
  onOpenWorkspaceChat,
  isProcessingAudio,
}: WorkspaceDetailProps) {
  const features = [
    {
      id: "upload" as const,
      icon: FileText,
      title: "노트 분석",
      count: workspace.noteCount,
      color: "#3B82F6",
      bgColor: "#EFF6FF",
    },
    {
      id: "audio" as const,
      icon: Mic,
      title: "음성 파일",
      count: workspace.audioCount,
      color: "#8B5CF6",
      bgColor: "#F3E8FF",
    },
    {
      id: "live" as const,
      icon: Radio,
      title: "실시간 인식",
      count: workspace.liveCount,
      color: "#10B981",
      bgColor: "#ECFDF5",
    },
  ]

  const hasContent = recentNotes.length > 0 || recentAudios.length > 0 || recentLives.length > 0

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ChevronRight className="w-5 h-5 rotate-180" />
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
            <h1 className="text-lg font-bold text-[#1F2937]">{workspace.name}</h1>
            <p className="text-xs text-[#6B7280]">
              총 {workspace.noteCount + workspace.audioCount + workspace.liveCount}개 항목
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.id}
                className="p-4 hover:shadow-lg transition-shadow cursor-pointer text-center"
                onClick={() => onSelectFeature(feature.id)}
              >
                <div className="w-12 h-12 rounded-xl mx-auto mb-2" style={{ backgroundColor: feature.bgColor }}>
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon className="w-6 h-6" style={{ color: feature.color }} />
                  </div>
                </div>
                <p className="text-xs font-medium text-[#1F2937] mb-1">{feature.title}</p>
                <p className="text-xs text-[#6B7280]">{feature.count}개</p>
              </Card>
            )
          })}
        </div>

        {hasContent && (
          <Button
            onClick={() => onSelectFeature("exam-prep" as any)}
            className="w-full bg-[#10B981] hover:bg-[#059669] text-white rounded-xl p-4 flex items-center justify-center gap-2"
          >
            <GraduationCap className="w-5 h-5" />
            <span className="font-medium">시험 대비 모드</span>
          </Button>
        )}

        {hasContent && onOpenWorkspaceChat && (
          <Button
            onClick={onOpenWorkspaceChat}
            className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl p-4 flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">워크스페이스 자료로 채팅하기</span>
          </Button>
        )}

        {recentNotes.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-[#1F2937] mb-2 px-2">최근 노트</h2>
            <div className="space-y-2">
              {recentNotes.map((note, index) => (
                <Card key={`${note.id}-${index}`} className="p-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#3B82F6] flex-shrink-0" />
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onOpenNote(note.id)}>
                      <p className="text-sm font-medium text-[#1F2937] truncate">{note.name}</p>
                      <p className="text-xs text-[#6B7280]">{note.date.toLocaleDateString()}</p>
                    </div>
                    {onDeleteNote && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteNote(note.id)
                        }}
                        className="flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {recentAudios.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-[#1F2937] mb-2 px-2">최근 음성 파일</h2>
            <div className="space-y-2">
              {recentAudios.map((audio) => (
                <Card key={audio.id} className="p-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <Mic className="w-5 h-5 text-[#8B5CF6] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1F2937] truncate">{audio.name}</p>
                      <p className="text-xs text-[#6B7280]">{audio.date.toLocaleDateString()}</p>
                      {isProcessingAudio === audio.id && (
                        <div className="flex items-center gap-2 mt-1">
                          <Loader2 className="w-3 h-3 animate-spin text-[#3B82F6]" />
                          <span className="text-xs text-[#3B82F6]">분석 중...</span>
                        </div>
                      )}
                    </div>
                    {onDeleteAudio && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteAudio(audio.id)
                        }}
                        className="flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {recentLives.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-[#1F2937] mb-2 px-2">실시간 인식 기록</h2>
            <div className="space-y-2">
              {recentLives.map((live) => (
                <Card key={live.id} className="p-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <Radio className="w-5 h-5 text-[#10B981] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1F2937] truncate">{live.text.substring(0, 30)}...</p>
                      <p className="text-xs text-[#6B7280]">{live.date.toLocaleDateString()}</p>
                    </div>
                    {onDeleteLive && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteLive(live.id)
                        }}
                        className="flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!hasContent && (
          <Card className="p-8 text-center">
            <Plus className="w-12 h-12 mx-auto mb-3 text-[#9CA3AF]" />
            <p className="text-sm text-[#6B7280]">아직 자료가 없습니다</p>
            <p className="text-xs text-[#9CA3AF] mt-1">위 버튼을 눌러 자료를 추가하세요</p>
          </Card>
        )}
      </div>
    </div>
  )
}
