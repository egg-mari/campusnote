"use client"

import type React from "react"

import { Upload, FileText, X, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRef, useState } from "react"

interface UploadedFile {
  id: string
  name: string
  size: number
  file: File
}

interface DocumentUploadProps {
  onUpload: (files: UploadedFile[]) => void
  onBack?: () => void
}

export function DocumentUpload({ onUpload, onBack }: DocumentUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      file: file,
    }))

    const updatedFiles = [...uploadedFiles, ...newFiles]
    setUploadedFiles(updatedFiles)
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

  const handleRemoveFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const handleConfirmUpload = () => {
    if (uploadedFiles.length > 0) {
      onUpload(uploadedFiles)
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
                <Upload className="w-10 h-10 text-[#3B82F6]" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-[#1F2937] mb-2">문서를 업로드하세요</h2>
            <p className="text-[#6B7280] mb-6">PDF, DOCX, TXT 파일을 드래그하거나 클릭하여 업로드하세요</p>
            <Button type="button" className="bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-full px-8">
              파일 선택
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.txt,.doc"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="mt-8 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-[#6B7280]">업로드된 파일 ({uploadedFiles.length})</h3>
                <Button
                  onClick={handleConfirmUpload}
                  className="bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-full px-6 text-sm"
                >
                  분석 시작
                </Button>
              </div>
              <div className="space-y-2">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-[#3B82F6]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1F2937] truncate">{file.name}</p>
                        <p className="text-xs text-[#6B7280]">{formatFileSize(file.size)}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveFile(file.id)
                        }}
                        className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                      >
                        <X className="w-4 h-4 text-[#6B7280]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
