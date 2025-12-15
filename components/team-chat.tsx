"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Send, Home } from "lucide-react"
import { useState, useEffect } from "react"

interface TeamChatProps {
  teamProject: any
  onBack: () => void
  onHome: () => void
}

export function TeamChat({ teamProject, onBack, onHome }: TeamChatProps) {
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")

  useEffect(() => {
    const savedMessages = localStorage.getItem(`team-chat-${teamProject.id}`)
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    }
  }, [teamProject.id])

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`team-chat-${teamProject.id}`, JSON.stringify(messages))
    }
  }, [messages, teamProject.id])

  const handleSend = () => {
    if (!newMessage.trim()) return

    const message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "나",
      timestamp: new Date(),
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-lg font-bold">{teamProject.name}</h2>
            <p className="text-sm text-gray-500">{teamProject.members.length}명 참여중</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onHome}>
          <Home className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p>아직 메시지가 없습니다</p>
            <p className="text-sm mt-1">첫 메시지를 보내보세요!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <Card key={msg.id} className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm">{msg.sender}</span>
                <span className="text-xs text-gray-400">
                  {new Date(msg.timestamp).toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-sm">{msg.text}</p>
            </Card>
          ))
        )}
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="메시지를 입력하세요..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B5FED]"
          />
          <Button onClick={handleSend} className="bg-[#5B5FED] hover:bg-[#4F5FD9]">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
