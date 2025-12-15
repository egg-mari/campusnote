"use client"

import { ArrowLeft, Home, Plus, Users } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export interface TeamProject {
  id: string
  name: string
  courseName: string
  members: string[]
  color: string
  createdAt: Date
  deadline?: Date
}

interface TeamProjectManagerProps {
  onBack: () => void
  onSelectProject: (id: string) => void
}

const teamColors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"]

export function TeamProjectManager({ onBack, onSelectProject }: TeamProjectManagerProps) {
  const [projects, setProjects] = useState<TeamProject[]>([])
  const [showNewProject, setShowNewProject] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const [newCourseName, setNewCourseName] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("teamProjects")
    if (saved) {
      const parsed = JSON.parse(saved)
      setProjects(
        parsed.map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          deadline: p.deadline ? new Date(p.deadline) : undefined,
        })),
      )
    }
  }, [])

  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem("teamProjects", JSON.stringify(projects))
    }
  }, [projects])

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return

    const newProject: TeamProject = {
      id: Date.now().toString(),
      name: newProjectName,
      courseName: newCourseName || "기타",
      members: [],
      color: teamColors[projects.length % teamColors.length],
      createdAt: new Date(),
    }

    setProjects((prev) => [newProject, ...prev])
    setNewProjectName("")
    setNewCourseName("")
    setShowNewProject(false)
  }

  return (
    <div className="h-screen overflow-auto bg-[#F9FAFB]">
      <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center gap-3 z-10">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-[#1F2937]" />
        </button>
        <h1 className="text-lg font-bold text-[#1F2937] flex-1">팀플 관리</h1>
        <button onClick={() => window.location.reload()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Home className="w-5 h-5 text-[#1F2937]" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <Button onClick={() => setShowNewProject(true)} className="w-full bg-[#3B82F6] flex items-center gap-2">
          <Plus className="w-5 h-5" />새 팀플 프로젝트
        </Button>

        {showNewProject && (
          <Card className="p-4 border-2 border-[#3B82F6]">
            <h3 className="font-bold text-[#1F2937] mb-3">새 프로젝트 생성</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="프로젝트명 (예: 캡스톤 디자인)"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
              <input
                type="text"
                placeholder="과목명 (선택)"
                value={newCourseName}
                onChange={(e) => setNewCourseName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
              <div className="flex gap-2">
                <Button onClick={handleCreateProject} className="flex-1 bg-[#3B82F6]">
                  생성
                </Button>
                <Button variant="outline" onClick={() => setShowNewProject(false)} className="flex-1">
                  취소
                </Button>
              </div>
            </div>
          </Card>
        )}

        {projects.length === 0 ? (
          <Card className="p-8 text-center">
            <Users className="w-12 h-12 text-[#9CA3AF] mx-auto mb-3" />
            <p className="text-[#6B7280]">아직 팀플 프로젝트가 없습니다</p>
            <p className="text-sm text-[#9CA3AF] mt-1">새 프로젝트를 만들어보세요</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98]"
                onClick={(e) => {
                  e.stopPropagation()
                  console.log("[v0] Selecting project:", project.id)
                  onSelectProject(project.id)
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${project.color}15` }}
                  >
                    <Users className="w-6 h-6" style={{ color: project.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#1F2937] mb-1">{project.name}</h3>
                    <p className="text-sm text-[#6B7280]">{project.courseName}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-[#9CA3AF]">팀원 {project.members.length}명</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
