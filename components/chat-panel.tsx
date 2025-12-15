"use client"

import type React from "react"
import type { JSX } from "react"
import { useState, useEffect, useRef } from "react"
import { Send, ArrowLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ChatPanelProps {
  documents?: Array<{ name: string; content: string }>
  inputRef?: React.RefObject<HTMLInputElement>
  externalInput?: string
  onExternalInputUsed?: () => void
  onBack?: () => void
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

function formatMessageContent(content: string) {
  const lines = content.split("\n")
  const formatted: JSX.Element[] = []
  let inCodeBlock = false
  let codeLines: string[] = []

  lines.forEach((line, index) => {
    const isIndented = line.startsWith("  ") || line.startsWith("\t")
    const isListItem = /^[\d-•]\.\s/.test(line.trim()) || line.trim().startsWith("- ")

    if (isIndented && !inCodeBlock) {
      inCodeBlock = true
      codeLines = [line]
    } else if (inCodeBlock) {
      if (isIndented || line.trim() === "") {
        codeLines.push(line)
      } else {
        formatted.push(
          <div key={`code-${index}`} className="my-2 bg-gray-100 rounded-lg p-3 overflow-x-auto">
            <pre className="text-xs font-mono text-[#1F2937] whitespace-pre">{codeLines.join("\n")}</pre>
          </div>,
        )
        inCodeBlock = false
        codeLines = []
        formatted.push(
          <p key={index} className="mb-2">
            {line}
          </p>,
        )
      }
    } else if (isListItem) {
      formatted.push(
        <p key={index} className="mb-1 pl-2">
          {line}
        </p>,
      )
    } else if (line.trim() === "") {
      formatted.push(<div key={index} className="h-2" />)
    } else {
      formatted.push(
        <p key={index} className="mb-2">
          {line}
        </p>,
      )
    }
  })

  if (inCodeBlock && codeLines.length > 0) {
    formatted.push(
      <div key="code-end" className="my-2 bg-gray-100 rounded-lg p-3 overflow-x-auto">
        <pre className="text-xs font-mono text-[#1F2937] whitespace-pre">{codeLines.join("\n")}</pre>
      </div>,
    )
  }

  return formatted
}

export function ChatPanel({ documents = [], inputRef, externalInput, onExternalInputUsed, onBack }: ChatPanelProps) {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (externalInput) {
      setInput(externalInput)
      onExternalInputUsed?.()
    }
  }, [externalInput, onExternalInputUsed])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
    }
    setMessages((prev) => [...prev, assistantMessage])

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({ role: m.role, content: m.content })),
          documents: documents.map((d) => d.content),
        }),
      })

      if (!response.ok) {
        throw new Error("응답에 실패했습니다.")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error("스트림을 읽을 수 없습니다.")
      }

      let fullText = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        fullText += chunk

        setMessages((prev) => {
          const newMessages = [...prev]
          const lastMessage = newMessages[newMessages.length - 1]
          if (lastMessage?.role === "assistant") {
            lastMessage.content = fullText
          }
          return newMessages
        })
      }
    } catch (error) {
      console.error("[v0] Chat error:", error)
      setMessages((prev) => {
        const newMessages = [...prev]
        const lastMessage = newMessages[newMessages.length - 1]
        if (lastMessage?.role === "assistant") {
          lastMessage.content = "죄송합니다. 응답 중 오류가 발생했습니다."
        }
        return newMessages
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          {onBack && (
            <button
              onClick={onBack}
              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#1F2937]" />
            </button>
          )}
          <button
            onClick={() => window.location.reload()}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
            title="홈으로"
          >
            <Home className="w-5 h-5 text-[#1F2937]" />
          </button>
          <h2 className="text-lg font-bold text-[#1F2937] flex-1">
            {documents.length > 0 ? "문서 질문하기" : "AI 채팅"}
          </h2>
        </div>
        <p className="text-sm text-[#6B7280]">
          {documents.length > 0
            ? `${documents.length}개 문서에 대해 궁금한 점을 물어보세요`
            : "일반적인 질문을 자유롭게 물어보세요"}
        </p>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.length === 0 && documents.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="text-[#6B7280]">
              <p className="text-sm">무엇이든 물어보세요!</p>
              <p className="text-xs mt-2">AI가 답변해드립니다.</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="text-[#6B7280]">
              <p className="text-sm">문서가 준비되었습니다!</p>
              <p className="text-xs mt-2">궁금한 점을 물어보세요.</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="animate-fade-in">
              {message.role === "user" ? (
                <div className="flex justify-end">
                  <div className="max-w-[80%] bg-gray-100 text-[#1F2937] rounded-2xl rounded-tr-sm px-4 py-3">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-start">
                  <div className="max-w-[80%]">
                    <div className="bg-[#EFF6FF] text-[#1F2937] rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="text-sm leading-relaxed">{formatMessageContent(message.content)}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%]">
              <div className="bg-[#EFF6FF] text-[#1F2937] rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-[#3B82F6] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div
                    className="w-2 h-2 bg-[#3B82F6] rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-[#3B82F6] rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={documents.length > 0 ? "질문을 입력하세요..." : "무엇이든 물어보세요..."}
            disabled={isLoading}
            className="flex-1 rounded-full border-gray-200 focus:border-[#3B82F6]"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="rounded-full bg-[#3B82F6] hover:bg-[#2563EB] text-white flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
