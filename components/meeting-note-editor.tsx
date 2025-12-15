"use client"

import { ArrowLeft, Home, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import ReactMarkdown from "react-markdown"

interface MeetingNoteEditorProps {
  onBack: () => void
  onSave: (note: { title: string; content: string; date: string }) => void
}

export function MeetingNoteEditor({ onBack, onSave }: MeetingNoteEditorProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isPreview, setIsPreview] = useState(false)

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요")
      return
    }

    onSave({
      title: title.trim(),
      content: content.trim(),
      date: new Date().toLocaleString("ko-KR"),
    })
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center gap-3 z-10">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-[#1F2937]" />
        </button>
        <h1 className="flex-1 text-lg font-bold text-[#1F2937]">회의록 작성</h1>
        <Button onClick={() => setIsPreview(!isPreview)} variant="outline" size="sm">
          {isPreview ? "편집" : "미리보기"}
        </Button>
        <Button onClick={handleSave} size="sm" className="bg-[#3B82F6]">
          <Save className="w-4 h-4 mr-1" />
          저장
        </Button>
        <button onClick={() => window.location.reload()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Home className="w-5 h-5 text-[#1F2937]" />
        </button>
      </div>

      <div className="p-4 max-w-4xl mx-auto">
        <input
          type="text"
          placeholder="회의록 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 text-xl font-bold border-b-2 border-gray-200 focus:border-[#3B82F6] outline-none mb-4"
        />

        {isPreview ? (
          <div className="prose prose-sm max-w-none bg-white p-6 rounded-lg border min-h-[500px]">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            placeholder="마크다운을 사용하여 회의록을 작성하세요...&#10;&#10;# 제목&#10;## 소제목&#10;- 항목&#10;**굵게**&#10;*기울임*"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg min-h-[500px] font-mono text-sm focus:border-[#3B82F6] outline-none resize-none"
          />
        )}
      </div>
    </div>
  )
}
