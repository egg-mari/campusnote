"use client"

import { Home, Calendar, MessageCircle, FileText, Settings } from "lucide-react"

interface BottomNavProps {
  activeView: string
  setActiveView: (view: any) => void
}

export function BottomNav({ activeView, setActiveView }: BottomNavProps) {
  const navItems = [
    { id: "home", label: "홈", icon: Home },
    { id: "upload", label: "노트", icon: FileText },
    { id: "chat", label: "채팅", icon: MessageCircle },
    { id: "live", label: "음성", icon: Calendar },
    { id: "saved", label: "설정", icon: Settings },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 flex items-center justify-around z-50">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = activeView === item.id
        return (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              isActive ? "text-[#3B82F6] bg-[#EFF6FF]" : "text-[#6B7280] hover:text-[#1F2937]"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
