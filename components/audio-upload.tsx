"use client"

import type React from "react"
import { Mic, Music, X, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRef, useState } from "react"

interface AudioFile {
  id: string
  name: string
  size: number
  file: File
  transcription?: string
}

interface AudioUploadProps {
  onTranscribe: (audioFile: AudioFile) => void
  onBack?: () => void
  onProcessingStart?: (fileId: string) => void
}

export function AudioUpload({ onTranscribe, onBack, onProcessingStart }: AudioUploadProps) {
  const [audioFile, setAudioFile] = useState<AudioFile | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    const newAudioFile: AudioFile = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      file: file,
    }

    setAudioFile(newAudioFile)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleRemoveFile = () => {
    setAudioFile(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const handleStartTranscription = async () => {
    if (!audioFile) return

    if (onProcessingStart) {
      onProcessingStart(audioFile.id)
    }

    try {
      const formData = new FormData()
      formData.append("audio", audioFile.file)

      const flaskServerUrl = "http://localhost:5000"
      console.log("[v0] Sending audio to Flask server:", flaskServerUrl)

      const response = await fetch(`${flaskServerUrl}/transcribe`, {
        method: "POST",
        body: formData,
        headers: {
          "ngrok-skip-browser-warning": "true",
          "User-Agent": "v0-campus-app",
        },
      })

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("[v0] Flask returned non-JSON response:", text.substring(0, 200))
        throw new Error("Flask 서버가 올바른 응답을 반환하지 않았습니다. 서버 설정을 확인해주세요.")
      }

      if (!response.ok) {
        const errorData = await response.json()
        console.error("[v0] Flask server error:", errorData)
        throw new Error(`Flask 서버 오류: ${response.status}`)
      }

      const result = await response.json()
      console.log("[v0] STT completed:", result.text)

      console.log("[v0] Refining with Gemini...")
      const refineResponse = await fetch("/api/refine-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: result.text }),
      })

      if (!refineResponse.ok) {
        throw new Error("텍스트 후보정 실패")
      }

      const refineResult = await refineResponse.json()
      console.log("[v0] Refinement completed")

      onTranscribe({
        ...audioFile,
        transcription: JSON.stringify({
          raw: result.text,
          refined: refineResult.refinedText,
        }),
      })
    } catch (error) {
      console.error("[v0] Flask 연결 오류:", error)
      alert(
        `Flask 서버에 연결할 수 없습니다.\n\n확인 사항:\n1. Flask 서버가 실행 중인지 확인 (python scripts/flask_whisper_server.py)\n2. 서버가 5000번 포트에서 실행되는지 확인\n\n현재 URL: http://localhost:5000`,
      )
    }
  }

  return (
    <div className="h-full flex flex-col">
      {onBack && (
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#1F2937] hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">뒤로가기</span>
          </button>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          {/* Upload Area */}
          <div
            onClick={handleButtonClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`bg-white rounded-2xl shadow-sm border-2 border-dashed p-12 text-center transition-all cursor-pointer ${
              isDragging ? "border-[#3B82F6] bg-[#EFF6FF]" : "border-[#3B82F6]/30 hover:border-[#3B82F6]/50"
            }`}
          >
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-[#EFF6FF] flex items-center justify-center">
                <Mic className="w-10 h-10 text-[#3B82F6]" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-[#1F2937] mb-2">음성 파일을 업로드하세요</h2>
            <p className="text-[#6B7280] mb-6">MP3, WAV, M4A 파일을 드래그하거나 클릭하여 업로드하세요</p>
            <Button type="button" className="bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-full px-8">
              파일 선택
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".mp3,.wav,.m4a,.ogg,.flac"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>

          {/* Uploaded Audio File */}
          {audioFile && (
            <div className="mt-8 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-[#6B7280]">업로드된 파일</h3>
                <Button
                  onClick={handleStartTranscription}
                  className="bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-full px-6 text-sm"
                >
                  텍스트 변환 시작
                </Button>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                    <Music className="w-5 h-5 text-[#3B82F6]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1F2937] truncate">{audioFile.name}</p>
                    <p className="text-xs text-[#6B7280]">{formatFileSize(audioFile.size)}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveFile()
                    }}
                    className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-[#6B7280]" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
