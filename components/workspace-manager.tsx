"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Folder, Plus, ChevronRight, FileText, Mic, Radio, MoreVertical, Trash2, Home } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export interface Workspace {
  id: string
  name: string
  color: string
  createdAt: Date
  noteCount: number
  audioCount: number
  liveCount: number
}

interface WorkspaceManagerProps {
  workspaces: Workspace[]
  onCreateWorkspace: (name: string, color: string) => void
  onSelectWorkspace: (id: string) => void
  onDeleteWorkspace: (id: string) => void
  onBack: () => void
}

const WORKSPACE_COLORS = [
  { name: "파랑", value: "#3B82F6", bg: "#EFF6FF" },
  { name: "보라", value: "#8B5CF6", bg: "#F3E8FF" },
  { name: "초록", value: "#10B981", bg: "#ECFDF5" },
  { name: "주황", value: "#F59E0B", bg: "#FEF3C7" },
  { name: "빨강", value: "#EF4444", bg: "#FEE2E2" },
  { name: "분홍", value: "#EC4899", bg: "#FCE7F3" },
]

export function WorkspaceManager({
  workspaces,
  onCreateWorkspace,
  onSelectWorkspace,
  onDeleteWorkspace,
  onBack,
}: WorkspaceManagerProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [newWorkspaceName, setNewWorkspaceName] = useState("")
  const [selectedColor, setSelectedColor] = useState(WORKSPACE_COLORS[0])

  const handleCreate = () => {
    if (newWorkspaceName.trim()) {
      onCreateWorkspace(newWorkspaceName.trim(), selectedColor.value)
      setNewWorkspaceName("")
      setSelectedColor(WORKSPACE_COLORS[0])
      setIsCreating(false)
    }
  }

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
          <h1 className="text-lg font-bold text-[#1F2937] flex-1">스터디 워크스페이스</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-[#6B7280]">과목이나 프로젝트별로 자료를 정리하세요</p>
          <Button
            size="sm"
            onClick={() => setIsCreating(true)}
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-full"
          >
            <Plus className="w-4 h-4 mr-1" />새 워크스페이스
          </Button>
        </div>

        {/* Create New Workspace */}
        {isCreating && (
          <Card className="p-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-[#1F2937] mb-2 block">워크스페이스 이름</label>
              <Input
                placeholder="예: 미적분학, 영어회화, 졸업 프로젝트"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                className="mb-3"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#1F2937] mb-2 block">색상 선택</label>
              <div className="flex gap-2">
                {WORKSPACE_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color)}
                    className="w-10 h-10 rounded-full border-2 transition-all"
                    style={{
                      backgroundColor: color.bg,
                      borderColor: selectedColor.value === color.value ? color.value : "transparent",
                    }}
                  >
                    <div className="w-full h-full rounded-full flex items-center justify-center">
                      <div className="w-5 h-5 rounded-full" style={{ backgroundColor: color.value }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate} className="flex-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white">
                생성
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreating(false)
                  setNewWorkspaceName("")
                  setSelectedColor(WORKSPACE_COLORS[0])
                }}
                className="flex-1"
              >
                취소
              </Button>
            </div>
          </Card>
        )}

        {/* Workspace List */}
        <div className="space-y-3">
          {workspaces.length === 0 ? (
            <Card className="p-8 text-center">
              <Folder className="w-12 h-12 mx-auto mb-3 text-[#9CA3AF]" />
              <p className="text-sm text-[#6B7280]">아직 워크스페이스가 없습니다</p>
              <p className="text-xs text-[#9CA3AF] mt-1">새 워크스페이스를 만들어 시작하세요</p>
            </Card>
          ) : (
            workspaces.map((workspace) => {
              const colorConfig = WORKSPACE_COLORS.find((c) => c.value === workspace.color) || WORKSPACE_COLORS[0]
              return (
                <Card
                  key={workspace.id}
                  className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => onSelectWorkspace(workspace.id)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: colorConfig.bg }}
                    >
                      <Folder className="w-6 h-6" style={{ color: workspace.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#1F2937] mb-2">{workspace.name}</h3>
                      <div className="flex gap-4 text-xs text-[#6B7280]">
                        <div className="flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" />
                          <span>노트 {workspace.noteCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mic className="w-3.5 h-3.5" />
                          <span>음성 {workspace.audioCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Radio className="w-3.5 h-3.5" />
                          <span>인식 {workspace.liveCount}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={(e) => {
                              e.stopPropagation()
                              onDeleteWorkspace(workspace.id)
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <ChevronRight className="w-5 h-5 text-[#9CA3AF]" />
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
