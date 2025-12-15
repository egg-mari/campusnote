"use client"

import type React from "react"
import {
  ArrowLeft,
  Home,
  Users,
  Plus,
  Calendar,
  FileText,
  MessageCircle,
  Upload,
  Download,
  Sparkles,
  Trash2,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import type { TeamProject } from "./team-project-manager"
import ReactMarkdown from "react-markdown"
import { MeetingNoteEditor } from "./meeting-note-editor"
import { MeetingAnalysisView } from "./meeting-analysis-view"
import { TeamScheduleEditor } from "./team-schedule-editor"

interface MeetingNote {
  id: string
  title: string
  content: string
  date: string
}

interface Task {
  id: string
  title: string
  assignee: string
  date: string
  time: string
  status: "todo" | "doing" | "done"
}

interface Document {
  id: string
  name: string
  uploadDate: string
  content: string
}

interface TeamProjectWorkspaceProps {
  project: TeamProject
  onBack: () => void
  onUpdateProject: (project: TeamProject) => void
  onOpenChat: () => void
}

export function TeamProjectWorkspace({ project, onBack, onUpdateProject, onOpenChat }: TeamProjectWorkspaceProps) {
  const [showInvite, setShowInvite] = useState(false)
  const [newMemberName, setNewMemberName] = useState("")
  const [meetings, setMeetings] = useState<MeetingNote[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [currentView, setCurrentView] = useState<"main" | "meeting-editor" | "schedule-editor">("main")
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingNote | null>(null)
  const [currentUsername] = useState("나") // 현재 사용자 이름 (실제로는 로그인 시스템에서 가져와야 함)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [analyzingMeeting, setAnalyzingMeeting] = useState<{ title: string; content: string } | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [mainView, setMainView] = useState<"meetings" | "schedule" | "chat">("meetings")

  useEffect(() => {
    const storedMeetings = localStorage.getItem(`team-meetings-${project.id}`)
    const storedTasks = localStorage.getItem(`team-tasks-${project.id}`)
    const storedDocs = localStorage.getItem(`team-documents-${project.id}`)

    if (storedMeetings) setMeetings(JSON.parse(storedMeetings))
    if (storedTasks) setTasks(JSON.parse(storedTasks))
    if (storedDocs) setDocuments(JSON.parse(storedDocs))
  }, [project.id])

  useEffect(() => {
    localStorage.setItem(`team-meetings-${project.id}`, JSON.stringify(meetings))
  }, [meetings, project.id])

  useEffect(() => {
    localStorage.setItem(`team-tasks-${project.id}`, JSON.stringify(tasks))
  }, [tasks, project.id])

  useEffect(() => {
    localStorage.setItem(`team-documents-${project.id}`, JSON.stringify(documents))
  }, [documents, project.id])

  const handleAddMember = () => {
    if (!newMemberName.trim()) {
      alert("이름을 입력해주세요")
      return
    }

    const updatedProject = {
      ...project,
      members: [...project.members, newMemberName.trim()],
    }
    onUpdateProject(updatedProject)
    setNewMemberName("")
    setShowInvite(false)
  }

  const handleSaveMeeting = (note: MeetingNote) => {
    setMeetings((prev) => [{ ...note, id: Date.now().toString() }, ...prev])
    setCurrentView("main")
  }

  const handleSaveTasks = (newTasks: Task[]) => {
    setTasks(newTasks)
    setCurrentView("main")
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      const doc: Document = {
        id: Date.now().toString(),
        name: file.name,
        uploadDate: new Date().toLocaleString("ko-KR"),
        content,
      }
      setDocuments((prev) => [doc, ...prev])
    }
    reader.readAsDataURL(file)
  }

  const handleDownloadDocument = (doc: Document) => {
    const link = document.createElement("a")
    link.href = doc.content
    link.download = doc.name
    link.click()
  }

  const myTasks = tasks.filter((task) => task.assignee === currentUsername)

  const handleAnalyzeMeeting = async (title: string, content: string) => {
    setIsAnalyzing(true)
    setAnalyzingMeeting({ title, content })

    try {
      const response = await fetch("/api/analyze-meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          members: project.members,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze meeting")
      }

      const result = await response.json()
      setAnalysisResult(result)
      setCurrentView("main")
    } catch (error) {
      console.error("[v0] Meeting analysis failed:", error)
      alert("회의록 분석에 실패했습니다")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleUpdateTodo = (index: number, field: string, value: any) => {
    if (!analysisResult) return

    const updatedTodos = [...analysisResult.todos]
    updatedTodos[index] = { ...updatedTodos[index], [field]: value }
    setAnalysisResult({ ...analysisResult, todos: updatedTodos })
  }

  const handleSaveTodos = () => {
    if (!analysisResult) return

    const newTasks = analysisResult.todos.map((todo: any) => ({
      id: Date.now().toString() + Math.random(),
      title: todo.task,
      assignee: todo.assignee || "미배정",
      date: todo.deadline || "",
      time: "",
      status: "todo" as const,
    }))

    setTasks((prev) => [...prev, ...newTasks])
    alert("할 일이 팀플 일정에 저장되었습니다")
    setAnalysisResult(null)
    setAnalyzingMeeting(null)
  }

  const handleDeleteMeeting = (meetingId: string) => {
    if (confirm("이 회의록을 삭제하시겠습니까?")) {
      setMeetings((prev) => prev.filter((m) => m.id !== meetingId))
    }
  }

  const handleAnalyzeMeetingFromList = async (meeting: MeetingNote) => {
    setIsAnalyzing(true)
    setAnalyzingMeeting({ title: meeting.title, content: meeting.content })

    try {
      const response = await fetch("/api/analyze-meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: meeting.content,
          members: project.members,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to analyze meeting")
      }

      const result = await response.json()
      setAnalysisResult(result)
    } catch (error: any) {
      console.error("[v0] Meeting analysis failed:", error)
      alert(`회의록 분석에 실패했습니다: ${error.message}`)
      setIsAnalyzing(false)
      setAnalyzingMeeting(null)
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (currentView === "meeting-editor") {
    return <MeetingNoteEditor onBack={() => setCurrentView("main")} onSave={(note: any) => handleSaveMeeting(note)} />
  }

  if (currentView === "schedule-editor") {
    return (
      <TeamScheduleEditor
        projectId={project.id}
        members={project.members}
        onBack={() => setCurrentView("main")}
        onSave={handleSaveTasks}
        initialTasks={tasks}
      />
    )
  }

  if (analysisResult && analyzingMeeting) {
    return (
      <MeetingAnalysisView
        meetingTitle={analyzingMeeting.title}
        meetingContent={analyzingMeeting.content}
        analysis={analysisResult}
        onBack={() => {
          setAnalysisResult(null)
          setAnalyzingMeeting(null)
        }}
        members={project.members}
        onUpdateTodo={handleUpdateTodo}
        onSaveTodos={handleSaveTodos}
      />
    )
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#8B5CF6] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#1F2937] font-medium">AI가 회의록을 분석하고 있습니다...</p>
          <p className="text-sm text-[#6B7280] mt-2">잠시만 기다려주세요</p>
        </div>
      </div>
    )
  }

  if (selectedMeeting) {
    return (
      <div className="min-h-screen bg-[#F9FAFB]">
        <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center gap-3 z-10">
          <button
            onClick={() => setSelectedMeeting(null)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#1F2937]" />
          </button>
          <h1 className="flex-1 text-lg font-bold text-[#1F2937]">{selectedMeeting.title}</h1>
          <button
            onClick={() => window.location.reload()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5 text-[#1F2937]" />
          </button>
        </div>
        <div className="p-4 max-w-4xl mx-auto">
          <p className="text-sm text-[#6B7280] mb-4">{selectedMeeting.date}</p>
          <div className="prose prose-sm max-w-none bg-white p-6 rounded-lg border">
            <ReactMarkdown>{selectedMeeting.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center gap-3 z-10">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-[#1F2937]" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-[#1F2937]">{project.name}</h1>
          <p className="text-xs text-[#6B7280]">{project.courseName}</p>
        </div>
        <button onClick={() => window.location.reload()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Home className="w-5 h-5 text-[#1F2937]" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Team Members */}
        <Card className="p-4">
          {/* ... existing team members code ... */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-[#1F2937] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#3B82F6]" />
              팀원 ({project.members.length})
            </h3>
            <Button size="sm" onClick={() => setShowInvite(true)} className="bg-[#3B82F6]">
              <Plus className="w-4 h-4 mr-1" />
              초대
            </Button>
          </div>

          {showInvite && (
            <div className="mb-3 p-3 bg-[#EFF6FF] rounded-lg">
              <input
                type="text"
                placeholder="팀원 이름 입력"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm mb-2"
              />
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 bg-[#3B82F6]" onClick={handleAddMember}>
                  추가
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowInvite(false)} className="flex-1">
                  취소
                </Button>
              </div>
            </div>
          )}

          {project.members.length === 0 ? (
            <p className="text-sm text-[#9CA3AF] text-center py-4">아직 팀원이 없습니다</p>
          ) : (
            <div className="space-y-2">
              {project.members.map((member, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-[#3B82F6] flex items-center justify-center text-white text-sm font-bold">
                    {member[0]}
                  </div>
                  <span className="text-sm text-[#1F2937]">{member}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="grid grid-cols-3 gap-3">
          <Button
            onClick={() => setMainView("meetings")}
            className={`h-24 flex flex-col gap-2 ${
              mainView === "meetings"
                ? "bg-gradient-to-br from-[#3B82F6] to-[#2563EB]"
                : "bg-white border-2 border-[#3B82F6] text-[#3B82F6] hover:bg-[#EFF6FF]"
            }`}
          >
            <FileText className="w-6 h-6" />
            <span className="text-sm font-medium">회의록</span>
          </Button>
          <Button
            onClick={() => setMainView("schedule")}
            className={`h-24 flex flex-col gap-2 ${
              mainView === "schedule"
                ? "bg-gradient-to-br from-[#10B981] to-[#059669]"
                : "bg-white border-2 border-[#10B981] text-[#10B981] hover:bg-[#D1FAE5]"
            }`}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-sm font-medium">팀플 일정</span>
          </Button>
          <Button
            onClick={() => setMainView("chat")}
            className={`h-24 flex flex-col gap-2 ${
              mainView === "chat"
                ? "bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED]"
                : "bg-white border-2 border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#F3E8FF]"
            }`}
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-sm font-medium">팀플 채팅</span>
          </Button>
        </div>

        {mainView === "meetings" && (
          <div className="space-y-3">
            <Button onClick={() => setCurrentView("meeting-editor")} className="w-full bg-[#3B82F6] h-12">
              <Plus className="w-4 h-4 mr-2" />새 회의록 작성
            </Button>

            {meetings.length === 0 ? (
              <Card className="p-8 text-center">
                <FileText className="w-12 h-12 text-[#9CA3AF] mx-auto mb-3" />
                <p className="text-[#6B7280]">아직 회의록이 없습니다</p>
                <p className="text-sm text-[#9CA3AF] mt-1">회의록을 작성해보세요</p>
              </Card>
            ) : (
              meetings.map((meeting) => (
                <Card key={meeting.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 cursor-pointer" onClick={() => setSelectedMeeting(meeting)}>
                      <h4 className="font-bold text-[#1F2937]">{meeting.title}</h4>
                      <p className="text-sm text-[#6B7280] mt-1">{meeting.date}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAnalyzeMeetingFromList(meeting)}
                        className="text-[#8B5CF6] border-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white"
                      >
                        <Sparkles className="w-4 h-4 mr-1" />
                        AI 분석
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteMeeting(meeting.id)}
                        className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {mainView === "schedule" && (
          <div className="space-y-3">
            <TeamScheduleEditor
              projectId={project.id}
              members={project.members}
              onBack={() => {}}
              onSave={handleSaveTasks}
              initialTasks={tasks}
            />
          </div>
        )}

        {mainView === "chat" && (
          <div className="space-y-3">
            <Card className="p-8 text-center">
              <MessageCircle className="w-16 h-16 text-[#8B5CF6] mx-auto mb-4" />
              <h3 className="font-bold text-[#1F2937] mb-2">팀플 채팅</h3>
              <p className="text-[#6B7280] mb-4">팀원들과 실시간으로 소통하세요</p>
              <Button onClick={onOpenChat} className="bg-[#8B5CF6]">
                채팅 시작하기
              </Button>
            </Card>

            {/* Additional info sections */}
            <Tabs defaultValue="tasks" className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="tasks">
                  나의 할 일 {myTasks.length > 0 && <span className="ml-1 text-xs">({myTasks.length})</span>}
                </TabsTrigger>
                <TabsTrigger value="docs">문서</TabsTrigger>
              </TabsList>

              <TabsContent value="tasks" className="space-y-3 mt-4">
                {myTasks.length === 0 ? (
                  <Card className="p-8 text-center">
                    <Calendar className="w-12 h-12 text-[#9CA3AF] mx-auto mb-3" />
                    <p className="text-[#6B7280]">할당된 작업이 없습니다</p>
                  </Card>
                ) : (
                  myTasks.map((task) => (
                    <Card key={task.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <input type="checkbox" className="mt-1" checked={task.status === "done"} readOnly />
                        <div className="flex-1">
                          <p className={`text-sm text-[#1F2937] ${task.status === "done" ? "line-through" : ""}`}>
                            {task.title}
                          </p>
                          <p className="text-xs text-[#6B7280] mt-1">
                            {task.date} {task.time}
                          </p>
                          <div className="mt-2">
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                task.status === "todo"
                                  ? "bg-gray-100 text-gray-700"
                                  : task.status === "doing"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-green-100 text-green-700"
                              }`}
                            >
                              {task.status === "todo" ? "대기" : task.status === "doing" ? "진행중" : "완료"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="docs" className="space-y-3 mt-4">
                <div className="mb-4">
                  <label className="block">
                    <input type="file" onChange={handleFileUpload} className="hidden" />
                    <Button className="w-full bg-[#3B82F6] cursor-pointer" asChild>
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        문서 업로드
                      </span>
                    </Button>
                  </label>
                </div>

                {documents.length === 0 ? (
                  <Card className="p-8 text-center">
                    <Upload className="w-12 h-12 text-[#9CA3AF] mx-auto mb-3" />
                    <p className="text-[#6B7280]">아직 문서가 없습니다</p>
                  </Card>
                ) : (
                  documents.map((doc) => (
                    <Card key={doc.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-[#1F2937] text-sm">{doc.name}</h4>
                          <p className="text-xs text-[#6B7280] mt-1">{doc.uploadDate}</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleDownloadDocument(doc)}>
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}
