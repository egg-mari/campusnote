"use client"

import { BookOpen, Calendar, Users, Save, MessageCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface UploadedFile {
  id: string
  name: string
  size: number
  file: File
}

interface AnalyzedDocument {
  id: string
  files: UploadedFile[]
  contents: any[]
  summary: string
  timestamp: Date
}

interface Event {
  id: string
  date: string
  title: string
  time?: string
}

interface CampusHomeProps {
  setActiveView: (view: any) => void
  uploadedFiles: UploadedFile[]
  savedTranscriptsCount: number
  analyzedDocs: AnalyzedDocument[]
  onLoadDoc: (docId: string) => void
}

export function CampusHome({
  setActiveView,
  uploadedFiles,
  savedTranscriptsCount,
  analyzedDocs,
  onLoadDoc,
}: CampusHomeProps) {
  const [showCalendar, setShowCalendar] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [newEventTitle, setNewEventTitle] = useState("")
  const [newEventTime, setNewEventTime] = useState("")
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    const savedEvents = localStorage.getItem("calendarEvents")
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents))
    }
  }, [])

  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem("calendarEvents", JSON.stringify(events))
    }
  }, [events])

  const menuItems = [
    { id: "timetable", label: "시간표", icon: Calendar, color: "#8B5CF6", view: "timetable" }, // Added timetable menu item
    { id: "study", label: "스터디", icon: BookOpen, color: "#3B82F6", view: "workspaces" },
    { id: "team", label: "팀플", icon: Users, color: "#10B981", view: "team-projects" }, // Added team project menu item
    { id: "chat", label: "AI 채팅", icon: MessageCircle, color: "#F59E0B", view: "chat" },
    {
      id: "portal",
      label: "학교 포털",
      icon: BookOpen,
      color: "#EF4444",
      view: null,
      url: "https://www.dongyang.ac.kr/dmu/index.do",
    },
    {
      id: "schedule",
      label: "학사 일정",
      icon: Calendar,
      color: "#EC4899",
      view: null,
      url: "https://www.dongyang.ac.kr/dmu/4749/subview.do",
    },
    { id: "community", label: "커뮤니티", icon: Users, color: "#06B6D4", view: null },
    { id: "saved", label: "저장 기록", icon: Save, color: "#8B5CF6", view: "saved" },
  ]

  const handleMenuClick = (item: (typeof menuItems)[0]) => {
    if (item.url) {
      window.open(item.url, "_blank")
    } else if (item.view) {
      setActiveView(item.view)
    }
  }

  const today = new Date().toISOString().split("T")[0]
  const todayEvents = events.filter((e) => e.date === today)

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const handleAddEvent = () => {
    if (selectedDate && newEventTitle) {
      const newEvent: Event = {
        id: Date.now().toString(),
        date: selectedDate,
        title: newEventTitle,
        time: newEventTime || undefined,
      }
      setEvents((prev) => [...prev, newEvent])
      setNewEventTitle("")
      setNewEventTime("")
      setSelectedDate("")
    }
  }

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth)
  const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]

  return (
    <div className="p-4 space-y-6 pb-6">
      <Card className="bg-gradient-to-r from-[#EFF6FF] to-[#DBEAFE] p-4 border-0">
        <div className="flex items-start gap-3">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="w-10 h-10 bg-[#3B82F6] rounded-full flex items-center justify-center flex-shrink-0 hover:bg-[#2563EB] transition-colors"
          >
            <Calendar className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h3 className="font-bold text-[#1F2937] mb-1">오늘의 일정</h3>
            {todayEvents.length > 0 ? (
              <div className="space-y-1">
                {todayEvents.map((event) => (
                  <p key={event.id} className="text-sm text-[#6B7280]">
                    {event.time && `${event.time} `}
                    {event.title}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#6B7280]">오늘 등록된 일정이 없습니다</p>
            )}
          </div>
        </div>
      </Card>

      {showCalendar && (
        <Card className="p-4 border-2 border-[#3B82F6]">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(new Date(year, month - 1))}>
              ←
            </Button>
            <h3 className="font-bold text-[#1F2937]">
              {year}년 {monthNames[month]}
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(new Date(year, month + 1))}>
              →
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-[#6B7280] p-1">
                {day}
              </div>
            ))}
            {Array.from({ length: startingDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
              const hasEvent = events.some((e) => e.date === dateStr)
              const isSelected = selectedDate === dateStr
              const isToday = dateStr === today

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`p-2 text-sm rounded-lg transition-colors relative ${
                    isSelected
                      ? "bg-[#3B82F6] text-white"
                      : isToday
                        ? "bg-[#DBEAFE] text-[#1F2937]"
                        : "hover:bg-gray-100 text-[#1F2937]"
                  }`}
                >
                  {day}
                  {hasEvent && (
                    <div
                      className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${isSelected ? "bg-white" : "bg-[#3B82F6]"}`}
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* Add Event Form */}
          {selectedDate && (
            <div className="space-y-3 pt-3 border-t">
              <p className="text-sm font-medium text-[#1F2937]">{selectedDate} 일정 추가</p>
              <input
                type="text"
                placeholder="일정 제목"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
              <input
                type="time"
                value={newEventTime}
                onChange={(e) => setNewEventTime(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
              <Button onClick={handleAddEvent} className="w-full bg-[#3B82F6]">
                일정 등록
              </Button>

              {/* Events for selected date */}
              {events.filter((e) => e.date === selectedDate).length > 0 && (
                <div className="space-y-2 pt-2 border-t">
                  {events
                    .filter((e) => e.date === selectedDate)
                    .map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <p className="text-sm font-medium text-[#1F2937]">{event.title}</p>
                          {event.time && <p className="text-xs text-[#6B7280]">{event.time}</p>}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-red-500"
                        >
                          삭제
                        </Button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          <Button variant="outline" className="w-full mt-3 bg-transparent" onClick={() => setShowCalendar(false)}>
            닫기
          </Button>
        </Card>
      )}

      {/* Quick Menu Grid */}
      <div>
        <h2 className="text-lg font-bold text-[#1F2937] mb-4">빠른 메뉴</h2>
        <div className="grid grid-cols-4 gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item)}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors active:scale-95"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <Icon className="w-7 h-7" style={{ color: item.color }} />
                </div>
                <span className="text-xs font-medium text-[#1F2937] text-center leading-tight">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Feed Section */}
      <div>
        <h2 className="text-lg font-bold text-[#1F2937] mb-4">캠퍼스 소식</h2>
        <div className="space-y-3">
          <Card className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#3B82F6] rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="font-medium text-[#1F2937] mb-1">2025학년도 1학기 수강신청 안내</p>
                <p className="text-sm text-[#6B7280]">학사공지 · 2시간 전</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#10B981] rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="font-medium text-[#1F2937] mb-1">도서관 24시간 열람실 운영 안내</p>
                <p className="text-sm text-[#6B7280]">시설공지 · 5시간 전</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Stats Card */}
      {savedTranscriptsCount > 0 && (
        <Card className="p-4 bg-gradient-to-r from-[#F3E8FF] to-[#E9D5FF] border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280] mb-1">저장된 음성 기록</p>
              <p className="text-2xl font-bold text-[#8B5CF6]">{savedTranscriptsCount}개</p>
            </div>
            <Save className="w-10 h-10 text-[#8B5CF6]" />
          </div>
        </Card>
      )}
    </div>
  )
}
