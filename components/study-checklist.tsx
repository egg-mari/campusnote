"use client"

import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckSquare } from "lucide-react"
import { useState } from "react"

interface StudyChecklistProps {
  concepts: string[]
}

export function StudyChecklist({ concepts }: StudyChecklistProps) {
  const [checked, setChecked] = useState<Record<number, boolean>>({})

  const toggleCheck = (index: number) => {
    setChecked((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  const progress = (Object.values(checked).filter(Boolean).length / concepts.length) * 100

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <CheckSquare className="w-5 h-5 text-[#10B981]" />
          <h3 className="text-sm font-bold text-[#1F2937]">복습 진행률</h3>
        </div>
        <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#10B981] to-[#3B82F6] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-[#6B7280] mt-2 text-center">{Math.round(progress)}% 완료</p>
      </Card>

      <div className="space-y-2">
        {concepts.map((concept, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center gap-3">
              <Checkbox
                id={`concept-${index}`}
                checked={checked[index] || false}
                onCheckedChange={() => toggleCheck(index)}
              />
              <label
                htmlFor={`concept-${index}`}
                className={`flex-1 text-sm cursor-pointer ${
                  checked[index] ? "line-through text-[#9CA3AF]" : "text-[#1F2937]"
                }`}
              >
                {concept}
              </label>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
