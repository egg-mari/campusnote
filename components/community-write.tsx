"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { BookOpen, FileText, Users, MessageCircle } from "lucide-react"

interface CommunityWriteProps {
  onSave: (post: { title: string; content: string; category: string }) => void
  onCancel: () => void
}

export function CommunityWrite({ onSave, onCancel }: CommunityWriteProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("exam")

  const categories = [
    { id: "exam", label: "시험 공부", icon: BookOpen, color: "bg-blue-500" },
    { id: "assignment", label: "과제 공유", icon: FileText, color: "bg-green-500" },
    { id: "recruit", label: "팀원 모집", icon: Users, color: "bg-purple-500" },
    { id: "free", label: "자유 게시판", icon: MessageCircle, color: "bg-orange-500" },
  ]

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요")
      return
    }

    onSave({ title, content, category: selectedCategory })
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              ← 뒤로
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">글쓰기</h1>
          </div>
          <Button onClick={handleSubmit} className="bg-[#5B5FED] hover:bg-[#4A4EDB]">
            게시
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
            <div className="flex gap-2">
              {categories.map((category) => {
                const Icon = category.icon
                const isActive = selectedCategory === category.id

                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isActive ? `${category.color} text-white` : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{category.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              className="text-lg"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요&#10;&#10;마크다운 문법을 지원합니다:&#10;**굵게**, *기울임*, - 목록"
              className="min-h-[400px] text-base"
            />
          </div>

          {/* Preview */}
          {content && (
            <div className="border-t pt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">미리보기</h3>
              <div className="bg-gray-50 rounded-lg p-4 prose prose-sm max-w-none">
                {content.split("\n").map((line, i) => {
                  // Bold
                  line = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                  // Italic
                  line = line.replace(/\*(.*?)\*/g, "<em>$1</em>")
                  // List
                  if (line.startsWith("- ")) {
                    return <li key={i} dangerouslySetInnerHTML={{ __html: line.slice(2) }} />
                  }
                  return <p key={i} dangerouslySetInnerHTML={{ __html: line }} className="mb-2" />
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
