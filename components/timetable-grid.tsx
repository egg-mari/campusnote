"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import { useState } from "react"

interface Course {
  id: string
  name: string
  day: number
  startTime: string
  endTime: string
  color: string
  professor?: string
  room?: string
}

interface TimetableGridProps {
  courses: Course[]
  onAddCourse: (course: Omit<Course, "id">) => void
  onDeleteCourse: (id: string) => void
  onCourseClick: (course: Course) => void
}

export function TimetableGrid({ courses, onAddCourse, onDeleteCourse, onCourseClick }: TimetableGridProps) {
  const [selectedCell, setSelectedCell] = useState<{ day: number; hour: number } | null>(null)
  const [courseName, setCourseName] = useState("")
  const [professor, setProfessor] = useState("")
  const [room, setRoom] = useState("")
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("10:00")

  const days = ["월", "화", "수", "목", "금"]
  const hours = Array.from({ length: 16 }, (_, i) => i + 9) // Extended hours from 9-21 to 9-24 (9AM to midnight)
  const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4", "#14B8A6", "#F97316"]

  const timeToMinutes = (time: string | undefined) => {
    if (!time || typeof time !== "string") return 0
    const parts = time.split(":")
    if (parts.length !== 2) return 0
    const [h, m] = parts.map(Number)
    if (isNaN(h) || isNaN(m)) return 0
    return h * 60 + m
  }

  const handleCellClick = (day: number, hour: number) => {
    const clickedTime = `${hour.toString().padStart(2, "0")}:00`
    const existingCourse = courses.find((c) => {
      if (c.day !== day) return false
      const startMin = timeToMinutes(c.startTime)
      const endMin = timeToMinutes(c.endTime)
      const clickedMin = timeToMinutes(clickedTime)
      return clickedMin >= startMin && clickedMin < endMin
    })

    if (existingCourse) {
      onCourseClick(existingCourse)
    } else {
      setSelectedCell({ day, hour })
      setStartTime(`${hour.toString().padStart(2, "0")}:00`)
      setEndTime(`${(hour + 1).toString().padStart(2, "0")}:00`)
    }
  }

  const handleAddCourse = () => {
    if (selectedCell && courseName && startTime < endTime) {
      onAddCourse({
        name: courseName,
        day: selectedCell.day,
        startTime,
        endTime,
        color: colors[courses.length % colors.length],
        professor,
        room,
      })
      setCourseName("")
      setProfessor("")
      setRoom("")
      setStartTime("09:00")
      setEndTime("10:00")
      setSelectedCell(null)
    }
  }

  const cellHeight = 60

  const isCellOccupied = (day: number, hour: number) => {
    const cellTime = hour * 60
    return courses.some((course) => {
      if (course.day !== day) return false
      const startMin = timeToMinutes(course.startTime)
      const endMin = timeToMinutes(course.endTime)
      // cellTime이 시작~종료 범위에 포함되면 차지됨 (종료 시간도 포함)
      return cellTime >= startMin && cellTime < endMin
    })
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Header */}
          <div className="grid grid-cols-6 gap-1 mb-2">
            <div className="text-center text-xs font-medium text-[#6B7280] p-2">시간</div>
            {days.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-[#6B7280] p-2">
                {day}
              </div>
            ))}
          </div>

          <div className="relative">
            {/* Background grid */}
            {hours.map((hour) => (
              <div key={hour} className="grid grid-cols-6 gap-1 mb-1">
                <div
                  className="flex items-center justify-center text-xs font-medium text-[#6B7280] bg-gray-50 rounded p-2"
                  style={{ height: `${cellHeight}px` }}
                >
                  {hour}:00
                </div>
                {days.map((_, dayIndex) => {
                  const occupied = isCellOccupied(dayIndex, hour)
                  if (occupied) {
                    return <div key={`${dayIndex}-${hour}`} style={{ height: `${cellHeight}px` }} />
                  }
                  return (
                    <button
                      key={`${dayIndex}-${hour}`}
                      onClick={() => handleCellClick(dayIndex, hour)}
                      className="border-2 border-dashed border-gray-300 hover:border-[#3B82F6] hover:bg-blue-50 rounded transition-all"
                      style={{ height: `${cellHeight}px` }}
                    >
                      <Plus className="w-4 h-4 text-gray-400 mx-auto" />
                    </button>
                  )
                })}
              </div>
            ))}

            {courses.map((course) => {
              if (!course.startTime || !course.endTime) return null

              const startMin = timeToMinutes(course.startTime)
              const endMin = timeToMinutes(course.endTime)

              if (startMin === 0 || endMin === 0 || startMin >= endMin) return null

              // 시작 시간이 몇 번째 행인지 계산 (9시가 0번째)
              const startHour = Math.floor(startMin / 60)
              const endHour = Math.ceil(endMin / 60)
              const startRowIndex = startHour - 9

              // 분 단위 오프셋 (시간 내에서의 위치)
              const minuteOffset = (startMin % 60) / 60

              // 총 지속 시간 (시간 단위)
              const durationHours = (endMin - startMin) / 60

              // 한 행의 높이 (셀 높이 + gap)
              const rowHeight = cellHeight + 4

              // top: startRowIndex * rowHeight + minuteOffset * cellHeight
              const top = startRowIndex * rowHeight + minuteOffset * cellHeight

              // height: durationHours * cellHeight
              const height = durationHours * cellHeight

              // 요일별 컬럼 너비와 위치 계산
              const dayColumnWidth = `calc((100% - 16px) / 6)`
              const left = `calc(${dayColumnWidth} + ${dayColumnWidth} * ${course.day} + ${4 * (course.day + 1)}px)`
              const width = `calc(${dayColumnWidth} - 8px)`

              return (
                <div
                  key={course.id}
                  onClick={() => onCourseClick(course)}
                  className="absolute rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
                  style={{
                    top: `${top}px`,
                    left,
                    width,
                    height: `${height}px`,
                    backgroundColor: `${course.color}20`,
                    borderLeft: `4px solid ${course.color}`,
                    zIndex: 10,
                  }}
                >
                  <div className="p-3 h-full flex flex-col justify-between relative">
                    <div>
                      <p className="text-sm font-bold text-[#1F2937] line-clamp-2">{course.name}</p>
                      {course.professor && <p className="text-xs text-[#6B7280] mt-1">{course.professor}</p>}
                      {course.room && <p className="text-xs text-[#6B7280]">{course.room}</p>}
                    </div>
                    <p className="text-xs text-[#6B7280] font-medium">
                      {course.startTime} ~ {course.endTime}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteCourse(course.id)
                      }}
                      className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50"
                    >
                      <X className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Add Course Dialog */}
      {selectedCell && (
        <Card className="p-4 border-2 border-[#3B82F6]">
          <h3 className="font-bold text-[#1F2937] mb-3">{days[selectedCell.day]} 과목 추가</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="과목명 (필수)"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
            <input
              type="text"
              placeholder="교수명"
              value={professor}
              onChange={(e) => setProfessor(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
            <input
              type="text"
              placeholder="강의실"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-2">시작 시간</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-2">종료 시간</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
            </div>
            {startTime >= endTime && <p className="text-xs text-red-500">종료 시간은 시작 시간보다 늦어야 합니다</p>}
            <div className="flex gap-2">
              <Button
                onClick={handleAddCourse}
                disabled={!courseName || startTime >= endTime}
                className="flex-1 bg-[#3B82F6]"
              >
                추가
              </Button>
              <Button variant="outline" onClick={() => setSelectedCell(null)} className="flex-1">
                취소
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
