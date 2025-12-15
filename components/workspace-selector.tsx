"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, BookOpen } from "lucide-react"

interface WorkspaceSelectorProps {
  workspaces: any[]
  onSelect: (workspaceId: string) => void
  onBack: () => void
  onHome: () => void
}

export function WorkspaceSelector({ workspaces, onSelect, onBack, onHome }: WorkspaceSelectorProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-lg font-bold">시험 대비 워크스페이스 선택</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onHome}>
          <Home className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {workspaces.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>워크스페이스가 없습니다</p>
            <p className="text-sm mt-1">먼저 워크스페이스를 만들어주세요</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {workspaces.map((workspace) => (
              <Card
                key={workspace.id}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-[#5B5FED]"
                onClick={() => onSelect(workspace.id)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${workspace.color}20` }}
                  >
                    {workspace.emoji}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{workspace.name}</h3>
                    <p className="text-sm text-gray-500">{workspace.description}</p>
                  </div>
                </div>
                <div className="flex gap-2 text-xs text-gray-500">
                  <span>노트 {workspace.noteCount || 0}개</span>
                  <span>·</span>
                  <span>음성 {workspace.audioCount || 0}개</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
