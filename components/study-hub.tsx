"use client"

import { FileText, Mic, Radio, ChevronRight, Home } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface StudyHubProps {
  onSelectFeature: (feature: "upload" | "audio" | "live") => void
  onBack: () => void
}

export function StudyHub({ onSelectFeature, onBack }: StudyHubProps) {
  const features = [
    {
      id: "upload" as const,
      icon: FileText,
      title: "노트 분석",
      description: "문서를 업로드하여 AI가 핵심 내용을 요약하고 분석합니다",
      color: "#3B82F6",
      bgColor: "#EFF6FF",
    },
    {
      id: "audio" as const,
      icon: Mic,
      title: "음성 파일 변환",
      description: "녹음된 음성 파일을 텍스트로 변환하고 후보정합니다",
      color: "#8B5CF6",
      bgColor: "#F3E8FF",
    },
    {
      id: "live" as const,
      icon: Radio,
      title: "실시간 음성 인식",
      description: "지금 바로 녹음을 시작하여 실시간으로 텍스트를 생성합니다",
      color: "#10B981",
      bgColor: "#ECFDF5",
    },
  ]

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
          <h1 className="text-lg font-bold text-[#1F2937] flex-1">스터디</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        <p className="text-sm text-[#6B7280] px-2">학습에 필요한 다양한 도구를 선택하세요</p>

        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <Card
              key={feature.id}
              className="p-5 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onSelectFeature(feature.id)}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: feature.bgColor }}
                >
                  <Icon className="w-7 h-7" style={{ color: feature.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#1F2937] mb-1">{feature.title}</h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">{feature.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#9CA3AF] flex-shrink-0 mt-1" />
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
