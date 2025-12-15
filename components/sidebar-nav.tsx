"use client"

import { Home, BookOpen, Users, Calendar, MessageSquare } from "lucide-react"

interface SidebarNavProps {
  activeView: string
  onNavigate: (view: string) => void
  workspaceCount: number
  courseCount: number
  teamProjectCount: number
}

export function SidebarNav({ activeView, onNavigate, workspaceCount, courseCount, teamProjectCount }: SidebarNavProps) {
  const menuItems = [
    { id: "home", label: "홈", icon: Home, isActive: true },
    { id: "calendar", label: "캘린더", icon: Calendar },
    { id: "timetable", label: "시간표", icon: Calendar, badge: courseCount },
    { id: "workspaces", label: "워크스페이스", icon: BookOpen, badge: workspaceCount },
    { id: "team-projects", label: "팀플 관리", icon: Users, badge: teamProjectCount },
    { id: "community", label: "커뮤니티", icon: MessageSquare },
  ]

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#5B5FED] rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#1F2937]">Campus Note</h1>
            <p className="text-xs text-[#6B7280]">학업의 모든것</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id || (item.isActive && activeView === "home")

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive ? "bg-[#5B5FED] text-white shadow-lg" : "text-[#6B7280] hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${isActive ? "bg-white text-[#5B5FED]" : "bg-gray-100 text-[#6B7280]"}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t">
        <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <Calendar className="w-4 h-4 text-[#6B7280]" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-[#1F2937]">곽준</p>
            <p className="text-xs text-[#6B7280]">정보통신공학과</p>
          </div>
        </button>
      </div>
    </div>
  )
}
