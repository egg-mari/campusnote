"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"

interface Concept {
  concept: string
  explanation: string
  frequency: number
}

interface ImportantConceptsProps {
  concepts: Concept[]
}

export function ImportantConcepts({ concepts }: ImportantConceptsProps) {
  const sortedConcepts = [...concepts].sort((a, b) => b.frequency - a.frequency).slice(0, 20)

  return (
    <div className="space-y-3">
      {sortedConcepts.map((item, index) => (
        <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
              {index + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-base font-bold text-[#1F2937]">{item.concept}</h3>
                <Badge variant="secondary" className="text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {item.frequency}회
                </Badge>
              </div>
              <p className="text-sm text-[#6B7280] leading-relaxed">{item.explanation}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
