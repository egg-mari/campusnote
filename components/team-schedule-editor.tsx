"use client"

import type React from "react"

import { ArrowLeft, Home, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"

interface Task {
  id: string
  title: string
  assignee: string
  date: string
  time: string
  status: "todo" | "doing" | "done"
}

interface TeamScheduleEditorProps {
  projectId: string
  members: string[]
  onBack: () => void
  onSave: (tasks: Task[]) => void
  initialTasks?: Task[]
}

export function TeamScheduleEditor({ projectId, members, onBack, onSave, initialTasks = [] }: TeamScheduleEditorProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [showAddTask, setShowAddTask] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    assignee: "",
    date: "",
    time: "",
  })
  const [draggedTask, setDraggedTask] = useState<string | null>(null)

  const handleAddTask = () => {
    if (!newTask.title || !newTask.assignee || !newTask.date || !newTask.time) {
      alert("모든 항목을 입력해주세요")
      return
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      assignee: newTask.assignee,
      date: newTask.date,
      time: newTask.time,
      status: "todo",
    }

    setTasks((prev) => [...prev, task])
    setNewTask({ title: "", assignee: "", date: "", time: "" })
    setShowAddTask(false)
  }

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const handleSave = () => {
    onSave(tasks)
  }

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (status: "todo" | "doing" | "done") => {
    if (!draggedTask) return

    setTasks((prev) => prev.map((task) => (task.id === draggedTask ? { ...task, status } : task)))
    setDraggedTask(null)
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center gap-3 z-10">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-[#1F2937]" />
        </button>
        <h1 className="flex-1 text-lg font-bold text-[#1F2937]">팀플 일정 관리</h1>
        <Button onClick={handleSave} size="sm" className="bg-[#3B82F6]">
          저장
        </Button>
        <button onClick={() => window.location.reload()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Home className="w-5 h-5 text-[#1F2937]" />
        </button>
      </div>

      <div className="p-4 max-w-6xl mx-auto space-y-4">
        <Button onClick={() => setShowAddTask(true)} className="w-full bg-[#3B82F6]">
          <Plus className="w-4 h-4 mr-2" />새 작업 추가
        </Button>

        {showAddTask && (
          <Card className="p-4 space-y-3 bg-[#EFF6FF]">
            <input
              type="text"
              placeholder="작업 제목"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <select
              value={newTask.assignee}
              onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">담당자 선택</option>
              {members.map((member) => (
                <option key={member} value={member}>
                  {member}
                </option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={newTask.date}
                onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                className="px-3 py-2 border rounded-lg"
              />
              <input
                type="time"
                value={newTask.time}
                onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                className="px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddTask} className="flex-1 bg-[#3B82F6]">
                추가
              </Button>
              <Button onClick={() => setShowAddTask(false)} variant="outline" className="flex-1">
                취소
              </Button>
            </div>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          {/* TODO Column */}
          <div
            onDragOver={handleDragOver}
            onDrop={() => handleDrop("todo")}
            className="min-h-[400px] p-3 rounded-lg bg-gray-50/50 border-2 border-dashed border-transparent hover:border-blue-300 transition-colors"
          >
            <h3 className="font-bold text-[#1F2937] mb-3">해야 할 일</h3>
            <div className="space-y-2">
              {tasks
                .filter((t) => t.status === "todo")
                .map((task) => (
                  <Card
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task.id)}
                    className="p-3 cursor-move hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-[#1F2937]">{task.title}</p>
                        <p className="text-xs text-[#6B7280] mt-1">담당: {task.assignee}</p>
                        <p className="text-xs text-[#6B7280]">
                          {task.date} {task.time}
                        </p>
                      </div>
                      <button onClick={() => handleDeleteTask(task.id)} className="p-1 hover:bg-gray-100 rounded">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </Card>
                ))}
            </div>
          </div>

          {/* DOING Column */}
          <div
            onDragOver={handleDragOver}
            onDrop={() => handleDrop("doing")}
            className="min-h-[400px] p-3 rounded-lg bg-blue-50/50 border-2 border-dashed border-transparent hover:border-blue-300 transition-colors"
          >
            <h3 className="font-bold text-[#1F2937] mb-3">진행 중</h3>
            <div className="space-y-2">
              {tasks
                .filter((t) => t.status === "doing")
                .map((task) => (
                  <Card
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task.id)}
                    className="p-3 bg-[#EFF6FF] cursor-move hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-[#1F2937]">{task.title}</p>
                        <p className="text-xs text-[#6B7280] mt-1">담당: {task.assignee}</p>
                        <p className="text-xs text-[#6B7280]">
                          {task.date} {task.time}
                        </p>
                      </div>
                      <button onClick={() => handleDeleteTask(task.id)} className="p-1 hover:bg-gray-100 rounded">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </Card>
                ))}
            </div>
          </div>

          {/* DONE Column */}
          <div
            onDragOver={handleDragOver}
            onDrop={() => handleDrop("done")}
            className="min-h-[400px] p-3 rounded-lg bg-green-50/50 border-2 border-dashed border-transparent hover:border-green-300 transition-colors"
          >
            <h3 className="font-bold text-[#1F2937] mb-3">완료</h3>
            <div className="space-y-2">
              {tasks
                .filter((t) => t.status === "done")
                .map((task) => (
                  <Card
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task.id)}
                    className="p-3 bg-[#F0FDF4] cursor-move hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-[#1F2937] line-through">{task.title}</p>
                        <p className="text-xs text-[#6B7280] mt-1">담당: {task.assignee}</p>
                        <p className="text-xs text-[#6B7280]">
                          {task.date} {task.time}
                        </p>
                      </div>
                      <button onClick={() => handleDeleteTask(task.id)} className="p-1 hover:bg-gray-100 rounded">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
