"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, Users } from "lucide-react"

interface TeamProjectSelectorProps {
  teamProjects: any[]
  onSelect: (projectId: string) => void
  onBack: () => void
  onHome: () => void
}

export function TeamProjectSelector({ teamProjects, onSelect, onBack, onHome }: TeamProjectSelectorProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-lg font-bold">팀플 채팅방 선택</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onHome}>
          <Home className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {teamProjects.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>팀플 프로젝트가 없습니다</p>
            <p className="text-sm mt-1">먼저 팀플을 만들어주세요</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {teamProjects.map((project) => (
              <Card
                key={project.id}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-[#10B981]"
                onClick={() => onSelect(project.id)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{project.name}</h3>
                    <p className="text-sm text-gray-500">{project.description}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  <span>{project.members.length}명 참여중</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
