"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Home } from "lucide-react"
import { Card } from "@/components/ui/card"
import { TimetableGrid } from "./timetable-grid"

interface Course {
  id: string
  name: string
  day: number
  startTime: string // Changed from period to startTime
  endTime: string // Changed from duration to endTime
  color: string
  professor?: string
  room?: string
}

interface TimetableManagerProps {
  onBack: () => void
  onCourseSelect: (course: Course) => void
  onCoursesChange?: (courses: Course[]) => void
}

export function TimetableManager({ onBack, onCourseSelect, onCoursesChange }: TimetableManagerProps) {
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("timetableCourses")
    if (saved) {
      setCourses(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (courses.length > 0) {
      localStorage.setItem("timetableCourses", JSON.stringify(courses))
    }
    onCoursesChange?.(courses)
  }, [courses, onCoursesChange])

  const handleAddCourse = (course: Omit<Course, "id">) => {
    const newCourse: Course = {
      ...course,
      id: Date.now().toString(),
    }
    setCourses((prev) => [...prev, newCourse])
  }

  const handleDeleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id))
  }

  const handleCourseClick = (course: Course) => {
    onCourseSelect(course)
  }

  return (
    <div className="h-screen overflow-auto bg-[#F9FAFB] pb-6">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#1F2937]" />
            </button>
            <h1 className="text-lg font-bold text-[#1F2937]">시간표</h1>
          </div>
          <button
            onClick={() => (window.location.href = "/")}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <Home className="w-5 h-5 text-[#1F2937]" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Card className="p-4 overflow-x-auto">
          <TimetableGrid
            courses={courses}
            onAddCourse={handleAddCourse}
            onDeleteCourse={handleDeleteCourse}
            onCourseClick={handleCourseClick}
          />
        </Card>

        {courses.length > 0 && (
          <Card className="p-4">
            <h3 className="font-bold text-[#1F2937] mb-3">등록된 과목</h3>
            <div className="space-y-2">
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => handleCourseClick(course)}
                  className="w-full p-3 text-left rounded-lg border-2 transition-all hover:shadow-md"
                  style={{ backgroundColor: `${course.color}10`, borderColor: course.color }}
                >
                  <p className="font-bold text-[#1F2937]">{course.name}</p>
                  {course.professor && <p className="text-sm text-[#6B7280]">{course.professor}</p>}
                  {course.room && <p className="text-sm text-[#6B7280]">{course.room}</p>}
                  <p className="text-sm text-[#6B7280]">
                    {course.startTime} ~ {course.endTime}
                  </p>
                </button>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
