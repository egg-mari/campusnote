"use client"

import { Card } from "@/components/ui/card"
import {
  BookOpen,
  Users,
  Calendar,
  FileText,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface StudyDashboardProps {
  onNavigate: (view: string) => void
  workspaceCount: number
  teamProjectCount: number
  studyHours: number
  courses: any[]
}

interface CalendarEvent {
  id: string
  date: string
  title: string
  time: string
  room?: string
  color: string
  isCourse?: boolean
}

interface TodoItem {
  id: string
  title: string
  completed: boolean
  date: string
}

export function StudyDashboard({
  onNavigate,
  workspaceCount,
  teamProjectCount,
  studyHours,
  courses,
}: StudyDashboardProps) {
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [newEventTitle, setNewEventTitle] = useState("")
  const [newEventTime, setNewEventTime] = useState("")
  const [newEventRoom, setNewEventRoom] = useState("")

  const [todos, setTodos] = useState<TodoItem[]>([])
  const [newTodoTitle, setNewTodoTitle] = useState("")
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([])
  const [loadingRecommendations, setLoadingRecommendations] = useState(false)

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

  useEffect(() => {
    const savedTodos = localStorage.getItem("todoList")
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem("todoList", JSON.stringify(todos))
    }
  }, [todos])

  const today = new Date()
  const todayString = today.toISOString().split("T")[0]

  const getWeekRange = () => {
    const day = today.getDay()
    const diff = today.getDate() - day + (day === 0 ? -6 : 1)
    const monday = new Date(today.setDate(diff))
    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
      weekDates.push(date.toISOString().split("T")[0])
    }
    return weekDates
  }

  const weekDates = getWeekRange()

  const weekEvents = weekDates.map((dateString) => {
    const date = new Date(dateString)
    const dayOfWeek = date.getDay()
    const dayEvents = events.filter((e) => e.date === dateString)

    const dayCourses = courses
      .filter((c) => {
        const courseDayOfWeek = c.day + 1
        return courseDayOfWeek === dayOfWeek
      })
      .map((c) => ({
        id: c.id,
        title: c.name,
        time: `${c.startTime} - ${c.endTime}`,
        room: c.room,
        color: c.color,
        isCourse: true,
      }))

    const allDayEvents = [...dayEvents, ...dayCourses].sort((a, b) => {
      const timeA = a.time.split(" ")[0] || a.time
      const timeB = b.time.split(" ")[0] || b.time
      return timeA.localeCompare(timeB)
    })

    return {
      date: dateString,
      dayName: ["일", "월", "화", "수", "목", "금", "토"][dayOfWeek],
      events: allDayEvents,
    }
  })

  const quickLinks = [
    { label: "팀플 채팅", icon: Users, color: "#10B981", action: "team-chat-select" },
    { label: "시험 대비", icon: AlertCircle, color: "#F59E0B", action: "exam-prep-select" },
    { label: "학사 일정", icon: Calendar, color: "#3B82F6", action: "academic-calendar" },
    { label: "학과 공지", icon: FileText, color: "#8B5CF6", action: "department-notice" },
  ]

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const handleDateClick = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    setSelectedDate(selected)
  }

  const handleAddEvent = () => {
    if (!selectedDate || !newEventTitle || !newEventTime) return

    const dateString = selectedDate.toISOString().split("T")[0]
    const colors = ["#5B5FED", "#22C55E", "#8B5CF6", "#F59E0B", "#3B82F6"]
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      date: dateString,
      title: newEventTitle,
      time: newEventTime,
      room: newEventRoom,
      color: colors[events.length % colors.length],
    }

    setEvents([...events, newEvent])
    setNewEventTitle("")
    setNewEventTime("")
    setNewEventRoom("")
    setSelectedDate(null)
  }

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id))
  }

  const handleAddTodo = () => {
    if (!newTodoTitle.trim()) return
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      title: newTodoTitle,
      completed: false,
      date: todayString,
    }
    setTodos([...todos, newTodo])
    setNewTodoTitle("")
  }

  const handleToggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const todayTodos = todos.filter((todo) => !todo.completed)
  const completedCount = todos.filter((todo) => todo.completed).length

  const getEventsForDate = (day: number) => {
    const dateString = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toISOString().split("T")[0]
    return events.filter((e) => e.date === dateString)
  }

  const handleQuickAction = (action: string) => {
    if (action === "team-chat-select") {
      onNavigate("team-chat-select")
    } else if (action === "exam-prep-select") {
      onNavigate("exam-prep-select")
    } else if (action === "academic-calendar") {
      window.open("https://www.dongyang.ac.kr/dmu/4749/subview.do", "_blank")
    } else if (action === "department-notice") {
      window.open(
        "https://www.dongyang.ac.kr/dmu/4904/subview.do?enc=Zm5jdDF8QEB8JTJGYmJzJTJGZG11JTJGNjc3JTJGYXJ0Y2xMaXN0LmRvJTNG",
        "_blank",
      )
    }
  }

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startingDayOfWeek = new Date(year, month, 1).getDay()

  const generateAIRecommendations = async () => {
    setLoadingRecommendations(true)
    try {
      const todayEvents = weekEvents.find((day) => day.date === todayString)?.events || []
      const upcomingTodos = todos.filter((t) => !t.completed)

      const response = await fetch("/api/generate-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          todayEvents,
          upcomingTodos,
          weekSchedule: weekEvents,
        }),
      })

      const data = await response.json()
      setAiRecommendations(data.recommendations || [])
    } catch (error) {
      console.error("Failed to generate recommendations:", error)
      setAiRecommendations(["오늘 수업 전에 복습 시간을 가져보세요", "팀플 진행 상황을 점검해보세요"])
    } finally {
      setLoadingRecommendations(false)
    }
  }

  useEffect(() => {
    if (weekEvents.length > 0 || todos.length > 0) {
      generateAIRecommendations()
    }
  }, [weekEvents.length, todos.length])

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#1F2937] mb-1">캠퍼스 홈</h2>
          <p className="text-sm text-[#6B7280]">오늘도 학업에 열정을 팔아보세요</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-br from-[#5B5FED] to-[#4F5FD9] border-0 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-90">오늘의 수업</span>
              <Calendar className="w-5 h-5 opacity-80" />
            </div>
            <p className="text-3xl font-bold mb-1">{courses.length}개</p>
            <p className="text-xs opacity-75">총 {courses.length}개 과목</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-[#22C55E] to-[#16A34A] border-0 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-90">팀플 과업</span>
              <Users className="w-5 h-5 opacity-80" />
            </div>
            <p className="text-3xl font-bold mb-1">{teamProjectCount}개</p>
            <p className="text-xs opacity-75">진행중인 프로젝트</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] border-0 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-90">오늘의 할 일</span>
              <BookOpen className="w-5 h-5 opacity-80" />
            </div>
            <p className="text-3xl font-bold mb-1">{todayTodos.length}개</p>
            <p className="text-xs opacity-75">완료: {completedCount}개</p>
          </Card>

          <Card
            className="p-4 bg-gradient-to-br from-[#F59E0B] to-[#D97706] border-0 text-white cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => generateAIRecommendations()}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-90">AI 할일 추천</span>
              <Sparkles className="w-5 h-5 opacity-80" />
            </div>
            {loadingRecommendations ? (
              <div className="flex items-center justify-center h-12">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
              </div>
            ) : aiRecommendations.length > 0 ? (
              <div className="space-y-1">
                {aiRecommendations.slice(0, 2).map((rec, idx) => (
                  <p key={idx} className="text-xs leading-relaxed opacity-90">
                    • {rec}
                  </p>
                ))}
              </div>
            ) : (
              <>
                <p className="text-2xl font-bold mb-1">클릭</p>
                <p className="text-xs opacity-75">AI 추천 받기</p>
              </>
            )}
          </Card>
        </div>

        <Card className="p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#1F2937]">주간 일정</h3>
            <Button variant="ghost" size="sm" className="text-[#5B5FED]" onClick={() => setShowCalendar(true)}>
              +
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-3">
            {weekEvents.map((day, idx) => {
              const isToday = day.date === todayString
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border-2 min-h-[120px] ${isToday ? "border-[#5B5FED] bg-[#5B5FED] bg-opacity-5" : "border-gray-200"}`}
                >
                  <div className="text-center mb-2">
                    <p className="text-xs text-[#6B7280] font-medium">{day.dayName}</p>
                    <p className={`text-sm font-bold ${isToday ? "text-[#5B5FED]" : "text-[#1F2937]"}`}>
                      {new Date(day.date).getDate()}
                    </p>
                  </div>

                  {day.events.length === 0 ? (
                    <p className="text-xs text-[#9CA3AF] text-center">일정 없음</p>
                  ) : (
                    <div className="space-y-1">
                      {day.events.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className="text-xs p-1.5 rounded"
                          style={{ backgroundColor: `${event.color}08`, borderLeft: `2px solid ${event.color}40` }}
                        >
                          <p className="font-medium truncate text-[#1F2937]">{event.title}</p>
                          <p className="text-[10px] text-[#6B7280]">{event.time.split(" ")[0]}</p>
                        </div>
                      ))}
                      {day.events.length > 3 && (
                        <p className="text-[10px] text-[#6B7280] text-center">+{day.events.length - 3}개 더</p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Card>

        {/* Todo List */}
        <Card className="p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#1F2937]">오늘의 할 일</h3>
            <span className="text-sm text-[#6B7280]">
              {completedCount}/{todos.length} 완료
            </span>
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="새로운 할 일 추가..."
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddTodo()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B5FED] text-sm"
            />
            <Button onClick={handleAddTodo} className="bg-[#5B5FED] hover:bg-[#4F5FD9]">
              추가
            </Button>
          </div>

          {todos.length === 0 ? (
            <div className="text-center py-8 text-[#6B7280]">
              <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">등록된 할 일이 없습니다</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    todo.completed ? "bg-gray-50 border-gray-200" : "bg-white border-gray-200 hover:border-[#5B5FED]"
                  }`}
                >
                  <button
                    onClick={() => handleToggleTodo(todo.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      todo.completed ? "bg-[#22C55E] border-[#22C55E]" : "border-gray-300 hover:border-[#5B5FED]"
                    }`}
                  >
                    {todo.completed && <Check className="w-3 h-3 text-white" />}
                  </button>
                  <p className={`flex-1 text-sm ${todo.completed ? "line-through text-[#9CA3AF]" : "text-[#1F2937]"}`}>
                    {todo.title}
                  </p>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="text-[#EF4444] hover:bg-red-50 p-1 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card className="p-5">
          <h3 className="text-lg font-bold text-[#1F2937] mb-4">빠른 실행</h3>
          <div className="grid grid-cols-4 gap-4">
            {quickLinks.map((link, idx) => {
              const Icon = link.icon
              return (
                <button
                  key={idx}
                  onClick={() => handleQuickAction(link.action)}
                  className="flex flex-col items-center gap-3 p-6 bg-white border-2 border-gray-100 rounded-xl hover:border-[#5B5FED] hover:shadow-md transition-all active:scale-95"
                >
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${link.color}15` }}
                  >
                    <Icon className="w-8 h-8" style={{ color: link.color }} />
                  </div>
                  <span className="text-sm font-medium text-[#1F2937]">{link.label}</span>
                </button>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1F2937]">캘린더</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowCalendar(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" onClick={handlePrevMonth}>
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <h3 className="text-lg font-semibold">
                  {year}년 {month + 1}월
                </h3>
                <Button variant="ghost" onClick={handleNextMonth}>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-4">
                {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                  <div key={day} className="text-center text-sm font-semibold text-[#6B7280] py-2">
                    {day}
                  </div>
                ))}

                {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square"></div>
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1
                  const dateString = new Date(year, month, day).toISOString().split("T")[0]
                  const isToday = dateString === todayString
                  const dayEvents = getEventsForDate(day)
                  const isSelected = selectedDate?.toISOString().split("T")[0] === dateString

                  return (
                    <button
                      key={day}
                      onClick={() => handleDateClick(day)}
                      className={`aspect-square p-2 rounded-lg border-2 transition-all hover:border-[#5B5FED] ${
                        isSelected ? "border-[#5B5FED] bg-[#5B5FED] bg-opacity-10" : "border-gray-200"
                      } ${isToday ? "bg-blue-50" : ""}`}
                    >
                      <div className="text-sm font-medium">{day}</div>
                      {dayEvents.length > 0 && (
                        <div className="flex gap-1 mt-1 justify-center">
                          {dayEvents.slice(0, 3).map((event) => (
                            <div
                              key={event.id}
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: event.color }}
                            ></div>
                          ))}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              {selectedDate && (
                <Card className="p-4 bg-[#F9FAFB]">
                  <h4 className="font-semibold mb-3">
                    {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일 일정 추가
                  </h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="일정 제목"
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B5FED]"
                    />
                    <input
                      type="time"
                      value={newEventTime}
                      onChange={(e) => setNewEventTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B5FED]"
                    />
                    <input
                      type="text"
                      placeholder="장소 (선택사항)"
                      value={newEventRoom}
                      onChange={(e) => setNewEventRoom(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B5FED]"
                    />
                    <Button onClick={handleAddEvent} className="w-full bg-[#5B5FED] hover:bg-[#4F5FD9]">
                      일정 추가
                    </Button>
                  </div>

                  {getEventsForDate(selectedDate.getDate()).length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h5 className="text-sm font-semibold text-[#6B7280]">이 날의 일정</h5>
                      {getEventsForDate(selectedDate.getDate()).map((event) => (
                        <div
                          key={event.id}
                          className="flex items-center justify-between p-2 bg-white rounded-lg border"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: event.color }}></div>
                            <div>
                              <p className="text-sm font-medium">{event.title}</p>
                              <p className="text-xs text-[#6B7280]">
                                {event.time} {event.room && `· ${event.room}`}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteEvent(event.id)}>
                            <X className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
