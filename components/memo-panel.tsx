"use client"

import { StickyNote } from "lucide-react"

export function MemoPanel() {
  const memos = [
    {
      id: 1,
      content: "예산 검토 필요 - 인프라 비용 재산정",
      date: "2024-01-15",
    },
    {
      id: 2,
      content: "다음 회의에서 일정 조율 논의",
      date: "2024-01-15",
    },
  ]

  return (
    <div className="p-4 max-h-64 overflow-auto">
      <div className="flex items-center gap-2 mb-3">
        <StickyNote className="w-4 h-4 text-[#3B82F6]" />
        <h3 className="text-sm font-bold text-[#1F2937]">대화 메모</h3>
      </div>
      <div className="space-y-2">
        {memos.map((memo) => (
          <div key={memo.id} className="bg-[#FFFBEB] rounded-lg p-3 border border-yellow-200">
            <p className="text-sm text-[#1F2937] leading-relaxed">{memo.content}</p>
            <p className="text-xs text-[#6B7280] mt-1">{memo.date}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
