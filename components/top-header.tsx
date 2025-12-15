"use client"

import { Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TopHeader() {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[#3B82F6] rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-bold">C</span>
        </div>
        <div>
          <p className="text-xs text-[#6B7280]">동양미래대학교</p>
          <h1 className="text-lg font-bold text-[#1F2937]">Campus Hub</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="w-5 h-5 text-[#6B7280]" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <User className="w-5 h-5 text-[#6B7280]" />
        </Button>
      </div>
    </header>
  )
}
