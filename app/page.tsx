"use client"

import { useState, useEffect } from "react"
import { DocumentUpload } from "@/components/document-upload"
import { DocumentSummary } from "@/components/document-summary"
import { AudioUpload } from "@/components/audio-upload"
import { LiveTranscription } from "@/components/live-transcription"
import { SavedTranscripts } from "@/components/saved-transcripts"
import { TranscriptionResult } from "@/components/transcription-result"
import { ChatPanel } from "@/components/chat-panel"
import { LoginScreen } from "@/components/login-screen"
import { WorkspaceManager, type Workspace } from "@/components/workspace-manager"
import { WorkspaceDetail } from "@/components/workspace-detail"
import { TimetableManager } from "@/components/timetable-manager"
import { CourseWorkspace } from "@/components/course-workspace"
import { StudyDashboard } from "@/components/study-dashboard"
import { ExamPrepDashboard } from "@/components/exam-prep-dashboard"
import { SidebarNav } from "@/components/sidebar-nav" // Import SidebarNav component
import { TeamProjectManager } from "@/components/team-project-manager" // Import TeamProjectManager component
import { TeamProjectWorkspace } from "@/components/team-project-workspace" // Import TeamProjectWorkspace component
import { TeamChat } from "@/components/team-chat"
import { WorkspaceSelector } from "@/components/workspace-selector"
import { TeamProjectSelector } from "@/components/team-project-selector"
import { Community } from "@/components/community"
import { CommunityWrite } from "@/components/community-write"
import { CommunityPostDetail } from "@/components/community-post-detail"

interface UploadedFile {
  id: string
  name: string
  size: number
  file: File
}

interface AudioFile {
  id: string
  name: string
  size: number
  file: File
  transcription?: string
}

interface DocumentContent {
  name: string
  content: string
}

interface SavedTranscript {
  id: string
  timestamp: Date
  originalText: string
  refinedText: string
}

interface AnalyzedDocument {
  id: string
  files: UploadedFile[]
  contents: DocumentContent[]
  summary: string
  timestamp: Date
  workspaceId?: string
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [activeView, setActiveView] = useState<
    | "home"
    | "timetable"
    | "course-workspace"
    | "workspaces"
    | "workspace-detail"
    | "upload"
    | "summary"
    | "audio"
    | "transcription"
    | "live"
    | "saved"
    | "chat"
    | "document-chat"
    | "workspace-chat"
    | "team-projects"
    | "team-workspace"
    | "study-hub"
    | "calendar"
    | "exam-prep"
    | "schedule"
    | "team-chat-select"
    | "team-chat"
    | "exam-prep-select"
    | "community"
    | "community-write"
    | "community-post"
  >("home")
  const [documentContents, setDocumentContents] = useState<DocumentContent[]>([])

  const [audioFile, setAudioFile] = useState<AudioFile | null>(null)
  const [rawTranscript, setRawTranscript] = useState<string | null>(null)
  const [refinedTranscript, setRefinedTranscript] = useState<string | null>(null)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null)

  const [savedTranscripts, setSavedTranscripts] = useState<SavedTranscript[]>([])
  const [chatInput, setChatInput] = useState<string>("")

  const [analyzedDocs, setAnalyzedDocs] = useState<AnalyzedDocument[]>([])
  const [currentDocId, setCurrentDocId] = useState<string | null>(null)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(null)

  const [workspaceAudios, setWorkspaceAudios] = useState<any[]>([])
  const [workspaceLives, setWorkspaceLives] = useState<any[]>([])
  const [processingAudioId, setProcessingAudioId] = useState<string | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null) // Added selected course state

  const [currentTeamProjectId, setCurrentTeamProjectId] = useState<string | null>(null)
  const [teamProjects, setTeamProjects] = useState<any[]>([])

  const [workspaceExamMode, setWorkspaceExamMode] = useState(false) // Added workspace exam prep state

  const [courses, setCourses] = useState<any[]>([]) // Added courses state
  const [showCalendar, setShowCalendar] = useState(true)
  const [events, setEvents] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState("")
  const [newEventTitle, setNewEventTitle] = useState("")
  const [newEventTime, setNewEventTime] = useState("")
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const [selectedTeamChatId, setSelectedTeamChatId] = useState<string | null>(null)

  const [selectedPost, setSelectedPost] = useState<any>(null)

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn")
    if (loginStatus === "true") {
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogin = () => {
    setIsLoggedIn(true)
    localStorage.setItem("isLoggedIn", "true")
  }

  useEffect(() => {
    const saved = localStorage.getItem("workspaces")
    if (saved) {
      const parsed = JSON.parse(saved)
      setWorkspaces(parsed.map((w: any) => ({ ...w, createdAt: new Date(w.createdAt) })))
    }
  }, [])

  useEffect(() => {
    if (workspaces.length > 0) {
      localStorage.setItem("workspaces", JSON.stringify(workspaces))
    }
  }, [workspaces])

  useEffect(() => {
    const savedDocs = localStorage.getItem("analyzedDocs")
    if (savedDocs) {
      const parsed = JSON.parse(savedDocs)
      setAnalyzedDocs(
        parsed.map((doc: any) => ({
          ...doc,
          timestamp: new Date(doc.timestamp),
        })),
      )
    }
  }, [])

  useEffect(() => {
    if (analyzedDocs.length > 0) {
      localStorage.setItem("analyzedDocs", JSON.stringify(analyzedDocs))
    }
  }, [analyzedDocs])

  useEffect(() => {
    const savedAudios = localStorage.getItem("workspaceAudios")
    const savedLives = localStorage.getItem("workspaceLives")

    if (savedAudios) {
      const parsed = JSON.parse(savedAudios)
      setWorkspaceAudios(parsed.map((item: any) => ({ ...item, date: new Date(item.date) })))
    }

    if (savedLives) {
      const parsed = JSON.parse(savedLives)
      setWorkspaceLives(parsed.map((item: any) => ({ ...item, date: new Date(item.date) })))
    }
  }, [])

  useEffect(() => {
    if (workspaceAudios.length > 0) {
      localStorage.setItem("workspaceAudios", JSON.stringify(workspaceAudios))
    }
  }, [workspaceAudios])

  useEffect(() => {
    if (workspaceLives.length > 0) {
      localStorage.setItem("workspaceLives", JSON.stringify(workspaceLives))
    }
  }, [workspaceLives])

  useEffect(() => {
    const saved = localStorage.getItem("teamProjects")
    if (saved) {
      const parsed = JSON.parse(saved)
      setTeamProjects(parsed.map((p: any) => ({ ...p, createdAt: new Date(p.createdAt) })))
    }
  }, [])

  useEffect(() => {
    if (teamProjects.length > 0) {
      localStorage.setItem("teamProjects", JSON.stringify(teamProjects))
    }
  }, [teamProjects])

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
    const savedCourses = localStorage.getItem("timetableCourses")
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses))
    }
  }, [])

  const handleDocumentUpload = async (files: UploadedFile[]) => {
    console.log(
      "[v0] Files uploaded:",
      files.map((f) => f.name),
    )
    setUploadedFiles(files)

    const contents: DocumentContent[] = []
    for (const fileItem of files) {
      try {
        let text = ""

        // file 객체가 없으면 스킵
        if (!fileItem.file) {
          console.error("[v0] No file object for:", fileItem.name)
          continue
        }

        if (fileItem.name.toLowerCase().endsWith(".pdf")) {
          console.log("[v0] Extracting text from PDF:", fileItem.name)

          try {
            // 동적으로 pdfjs-dist 로드
            const pdfjs = await import("pdfjs-dist")
            
            // worker 설정 (CDN 사용)
            pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`

            const arrayBuffer = await fileItem.file.arrayBuffer()
            const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
            console.log("[v0] PDF pages:", pdf.numPages)

            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i)
              const textContent = await page.getTextContent()
              const pageText = textContent.items.map((item: any) => item.str).join(" ")
              text += pageText + "\n"
            }

            console.log("[v0] PDF text extracted, length:", text.length)
          } catch (pdfError) {
            console.error("[v0] PDF parsing error:", pdfError)
            text = "[PDF 파일을 읽을 수 없습니다]"
          }
        } else {
          text = await fileItem.file.text()
        }

        contents.push({
          name: fileItem.name,
          content: text,
        })
        console.log("[v0] File read:", fileItem.name, "Length:", text.length)
      } catch (error) {
        console.error("[v0] Error reading file:", fileItem.name, error)
      }
    }

    // contents가 비어있으면 에러 표시
    if (contents.length === 0) {
      console.error("[v0] No contents extracted from files")
      return
    }

    setDocumentContents(contents)
    const newDocId = Date.now().toString()
    setActiveView("summary")

    if (currentWorkspaceId) {
      setWorkspaces((prev) =>
        prev.map((w) => (w.id === currentWorkspaceId ? { ...w, noteCount: w.noteCount + files.length } : w)),
      )

      // Add to analyzedDocs with workspaceId (contents가 있는 것만)
      const newDocs = files
        .map((file, index) => ({
          id: `${newDocId}-${index}`,
          files: [{ name: file.name, size: file.file?.size || 0 }],
          contents: contents[index] ? [contents[index]] : [],
          summary: "", // Add empty summary initially
          timestamp: new Date(),
          workspaceId: currentWorkspaceId,
        }))
        .filter((doc) => doc.contents.length > 0) // contents가 있는 것만 저장

      if (newDocs.length > 0) {
        setAnalyzedDocs((prev) => [...newDocs, ...prev])
        // 첫 번째 문서의 ID를 currentDocId로 설정
        setCurrentDocId(newDocs[0].id)
        console.log("[v0] Added", newDocs.length, "documents to workspace", currentWorkspaceId)
      }
    } else {
      // 워크스페이스 없이 업로드할 때
      setCurrentDocId(newDocId)
    }
  }

  const handleAudioTranscribe = async (audio: AudioFile) => {
    setAudioFile(audio)
    setActiveView("transcription")
    setIsTranscribing(true)
    setTranscriptionError(null)
    setRawTranscript(null)
    setRefinedTranscript(null)

    try {
      if (audio.transcription) {
        const result = JSON.parse(audio.transcription)
        setRawTranscript(result.raw)
        setRefinedTranscript(result.refined)

        if (currentWorkspaceId) {
          console.log("[v0] Saving audio transcription to workspace:", currentWorkspaceId)
          console.log("[v0] Transcription data:", {
            raw: result.raw?.substring(0, 100),
            refined: result.refined?.substring(0, 100),
          })

          const newAudio = {
            id: audio.id,
            name: audio.name,
            date: new Date(),
            transcription: audio.transcription,
            workspaceId: currentWorkspaceId,
          }
          setWorkspaceAudios((prev) => {
            const updated = [newAudio, ...prev]
            console.log("[v0] Updated workspaceAudios count:", updated.length)
            return updated
          })
          setWorkspaces((prev) =>
            prev.map((w) => (w.id === currentWorkspaceId ? { ...w, audioCount: w.audioCount + 1 } : w)),
          )
          console.log("[v0] Audio transcription saved successfully")
        } else {
          console.warn("[v0] No workspace selected, transcription not saved")
        }
      } else {
        throw new Error("변환 결과가 없습니다")
      }
    } catch (error) {
      console.error("[v0] Transcription error:", error)
      setTranscriptionError(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다")
    } finally {
      setIsTranscribing(false)
      setProcessingAudioId(null)
    }
  }

  const handleResetTranscription = () => {
    setAudioFile(null)
    setRawTranscript(null)
    setRefinedTranscript(null)
    setTranscriptionError(null)
    setActiveView("audio")
  }

  const handleSaveTranscript = (originalText: string, refinedText: string) => {
    const newTranscript: SavedTranscript = {
      id: Date.now().toString(),
      timestamp: new Date(),
      originalText,
      refinedText,
    }
    setSavedTranscripts((prev) => [newTranscript, ...prev])

    if (currentWorkspaceId) {
      const newLive = {
        id: newTranscript.id,
        name: refinedText.substring(0, 30),
        date: new Date(),
        text: refinedText,
        workspaceId: currentWorkspaceId,
      }
      setWorkspaceLives((prev) => [newLive, ...prev])
      setWorkspaces((prev) => prev.map((w) => (w.id === currentWorkspaceId ? { ...w, liveCount: w.liveCount + 1 } : w)))
    }

    setActiveView("saved")
  }

  const handleDeleteTranscript = (id: string) => {
    setSavedTranscripts((prev) => prev.filter((t) => t.id !== id))
  }

  const handleQuestionClick = (question: string) => {
    setChatInput(question)
    setTimeout(() => setChatInput(""), 100)
  }

  const handleSaveAnalyzedDoc = (summary: string) => {
    if (!currentDocId) return

    // 기존 문서가 있으면 업데이트, 없으면 새로 추가
    const existingDoc = analyzedDocs.find((d) => d.id === currentDocId)
    
    if (existingDoc) {
      // 기존 문서의 summary만 업데이트
      setAnalyzedDocs((prev) =>
        prev.map((d) => (d.id === currentDocId ? { ...d, summary } : d))
      )
    } else {
      // 새 문서 추가
      const newDoc: any = {
        id: currentDocId,
        files: uploadedFiles,
        contents: documentContents,
        summary,
        timestamp: new Date(),
        workspaceId: currentWorkspaceId,
      }
      setAnalyzedDocs((prev) => [newDoc, ...prev])
    }
  }

  const handleLoadAnalyzedDoc = (docId: string) => {
    const doc = analyzedDocs.find((d) => d.id === docId)
    if (!doc) {
      console.error("[v0] Document not found:", docId)
      return
    }

    console.log("[v0] Loading document:", docId, "contents:", doc.contents?.length || 0)

    // 저장된 파일 정보로 uploadedFiles 설정 (File 객체 없이)
    const filesWithoutFileObj = (doc.files || []).map((f: any) => ({
      id: f.id || Math.random().toString(36).substr(2, 9),
      name: f.name,
      size: f.size || 0,
      file: null as any, // File 객체는 localStorage에 저장 안됨
    }))
    setUploadedFiles(filesWithoutFileObj)
    
    // 이미 저장된 contents 사용 (파일 다시 읽을 필요 없음)
    const contents = doc.contents || []
    console.log("[v0] Setting documentContents:", contents.length, "items")
    setDocumentContents(contents)
    setCurrentDocId(doc.id)
    setActiveView("summary")
  }

  const handleCreateWorkspace = (name: string, color: string) => {
    const newWorkspace: Workspace = {
      id: Date.now().toString(),
      name,
      color,
      createdAt: new Date(),
      noteCount: 0,
      audioCount: 0,
      liveCount: 0,
    }
    setWorkspaces((prev) => [newWorkspace, ...prev])
  }

  const handleDeleteWorkspace = (id: string) => {
    setWorkspaces((prev) => prev.filter((w) => w.id !== id))
    if (currentWorkspaceId === id) {
      setCurrentWorkspaceId(null)
      setActiveView("workspaces")
    }
  }

  const handleSelectWorkspace = (id: string) => {
    setCurrentWorkspaceId(id)
    setActiveView("workspace-detail")
  }

  const handleCourseSelect = (course: any) => {
    setSelectedCourse(course)
    setCurrentWorkspaceId(course.id) // Use course as workspace
    setActiveView("course-workspace")
  }

  const handleCreateTeamProject = (project: any) => {
    setTeamProjects((prev) => [project, ...prev])
  }

  const handleDeleteTeamProject = (id: string) => {
    setTeamProjects((prev) => prev.filter((p) => p.id !== id))
  }

  const handleSelectTeamProject = (id: string) => {
    setCurrentTeamProjectId(id)
    setActiveView("team-workspace")
  }

  const handleCoursesChange = (updatedCourses: any[]) => {
    setCourses(updatedCourses)
  }

  const currentWorkspace = workspaces.find((w) => w.id === currentWorkspaceId)

  const workspaceNotes = currentWorkspace
    ? analyzedDocs.filter((doc) => (doc as any).workspaceId === currentWorkspace.id)
    : []

  const currentWorkspaceAudios = currentWorkspace
    ? workspaceAudios.filter((audio) => audio.workspaceId === currentWorkspace.id)
    : []

  const currentWorkspaceLives = currentWorkspace
    ? workspaceLives.filter((live) => live.workspaceId === currentWorkspace.id)
    : []

  // Combine all workspace content for exam prep
  const allWorkspaceContent = [
    ...workspaceNotes.map((doc) => ({
      id: doc.id,
      name: doc.files[0]?.name || "문서",
      date: doc.timestamp,
      contents: doc.contents,
    })),
    ...currentWorkspaceAudios.map((audio) => ({
      id: audio.id,
      name: audio.name,
      date: audio.date,
      contents: audio.transcription
        ? [
            {
              name: audio.name,
              content: JSON.parse(audio.transcription).refined || JSON.parse(audio.transcription).raw,
            },
          ]
        : [],
    })),
    ...currentWorkspaceLives.map((live) => ({
      id: live.id,
      name: "실시간 인식",
      date: live.date,
      contents: [
        {
          name: "실시간 인식",
          content: live.text,
        },
      ],
    })),
  ]

  const currentWorkspaceNotes = workspaceNotes.map((doc) => ({
    id: doc.id,
    name: doc.files[0]?.name || "문서",
    date: doc.timestamp,
  }))

  const currentTeamProject = teamProjects.find((p) => p.id === currentTeamProjectId)

  const handleDeleteNote = (id: string) => {
    setAnalyzedDocs((prev) => prev.filter((doc) => doc.id !== id))
    if (currentWorkspaceId) {
      setWorkspaces((prev) =>
        prev.map((w) => (w.id === currentWorkspaceId ? { ...w, noteCount: Math.max(0, w.noteCount - 1) } : w)),
      )
    }
  }

  const handleDeleteAudio = (id: string) => {
    setWorkspaceAudios((prev) => prev.filter((audio) => audio.id !== id))
    if (currentWorkspaceId) {
      setWorkspaces((prev) =>
        prev.map((w) => (w.id === currentWorkspaceId ? { ...w, audioCount: Math.max(0, w.audioCount - 1) } : w)),
      )
    }
  }

  const handleDeleteLive = (id: string) => {
    setWorkspaceLives((prev) => prev.filter((live) => live.id !== id))
    setSavedTranscripts((prev) => prev.filter((t) => t.id !== id))
    if (currentWorkspaceId) {
      setWorkspaces((prev) =>
        prev.map((w) => (w.id === currentWorkspaceId ? { ...w, liveCount: Math.max(0, w.liveCount - 1) } : w)),
      )
    }
  }

  const handleOpenWorkspaceChat = () => {
    console.log("[v0] Opening workspace chat for workspace:", currentWorkspaceId)
    console.log("[v0] All analyzed docs:", analyzedDocs.length)
    console.log("[v0] All workspace audios:", workspaceAudios.length)
    console.log("[v0] All workspace lives:", workspaceLives.length)

    const workspaceContents: DocumentContent[] = []

    // Add all notes from workspace
    const workspaceDocs = analyzedDocs.filter((doc) => (doc as any).workspaceId === currentWorkspaceId)
    console.log("[v0] Filtered workspace docs:", workspaceDocs.length)

    workspaceDocs.forEach((doc) => {
      workspaceContents.push(...doc.contents)
    })

    // Add all audio transcriptions
    const filteredAudios = workspaceAudios.filter((audio) => audio.workspaceId === currentWorkspaceId)
    console.log("[v0] Filtered workspace audios:", filteredAudios.length)

    filteredAudios.forEach((audio) => {
      if (audio.transcription) {
        try {
          const result = typeof audio.transcription === "string" ? JSON.parse(audio.transcription) : audio.transcription
          const content = result.refined || result.raw || result
          console.log("[v0] Adding audio content:", audio.name, "length:", content.length)
          workspaceContents.push({
            name: `[음성] ${audio.name}`,
            content: content,
          })
        } catch (e) {
          console.error("[v0] Error parsing audio transcription:", e)
          workspaceContents.push({
            name: `[음성] ${audio.name}`,
            content: audio.transcription,
          })
        }
      } else {
        console.warn("[v0] Audio has no transcription:", audio.name)
      }
    })

    // Add all live transcriptions
    const filteredLives = workspaceLives.filter((live) => live.workspaceId === currentWorkspaceId)
    console.log("[v0] Filtered workspace lives:", filteredLives.length)

    filteredLives.forEach((live) => {
      workspaceContents.push({
        name: `[실시간 인식] ${live.date.toLocaleDateString()}`,
        content: live.text,
      })
    })

    console.log("[v0] Total workspace contents for chat:", workspaceContents.length)
    console.log(
      "[v0] Workspace contents summary:",
      workspaceContents.map((c) => ({ name: c.name, contentLength: c.content.length })),
    )

    setDocumentContents(workspaceContents)
    setActiveView("workspace-chat")
  }

  const handleWorkspaceFeature = (feature: "upload" | "audio" | "live" | "exam-prep") => {
    console.log("[v0] Workspace feature selected:", feature)
    if (feature === "exam-prep") {
      setWorkspaceExamMode(true)
      setActiveView("exam-prep")
      console.log("[v0] Switching to exam-prep view, workspace notes:", workspaceNotes.length)
    } else if (feature === "upload") {
      setActiveView("upload")
    } else if (feature === "audio") {
      setActiveView("audio")
    } else if (feature === "live") {
      setActiveView("live")
    }
  }

  const handleAddEvent = () => {
    if (selectedDate && newEventTitle) {
      const newEvent = {
        id: Date.now().toString(),
        date: selectedDate,
        title: newEventTitle,
        time: newEventTime || undefined,
      }
      setEvents((prev: any) => [...prev, newEvent])
      setNewEventTitle("")
      setNewEventTime("")
    }
  }

  const handleDeleteEvent = (id: string) => {
    setEvents((prev: any) => prev.filter((e: any) => e.id !== id))
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const handleNavigate = (view: string) => {
    setActiveView(view)
  }

  const handleWriteCommunityPost = () => {
    setActiveView("community-write")
  }

  const handleSaveCommunityPost = (post: { title: string; content: string; category: string }) => {
    const newPost = {
      id: Date.now().toString(),
      ...post,
      author: "곽준",
      createdAt: new Date().toLocaleString("ko-KR"),
      views: 0,
      comments: 0,
    }

    const storedPosts = localStorage.getItem("community-posts")
    const posts = storedPosts ? JSON.parse(storedPosts) : []
    posts.unshift(newPost)
    localStorage.setItem("community-posts", JSON.stringify(posts))

    setActiveView("community")
  }

  const handleViewCommunityPost = (post: any) => {
    setSelectedPost(post)
    setActiveView("community-post")
  }

  const handleUpdatePost = (updatedPost: any) => {
    const storedPosts = localStorage.getItem("community-posts")
    if (storedPosts) {
      const posts = JSON.parse(storedPosts)
      const index = posts.findIndex((p: any) => p.id === updatedPost.id)
      if (index !== -1) {
        posts[index] = updatedPost
        localStorage.setItem("community-posts", JSON.stringify(posts))
      }
    }
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />
  }

  if (activeView === "team-chat-select") {
    return (
      <div className="h-screen flex">
        <SidebarNav activeView={activeView} onNavigate={handleNavigate} />
        <div className="flex-1">
          <TeamProjectSelector
            teamProjects={teamProjects}
            onSelect={(projectId) => {
              setSelectedTeamChatId(projectId)
              setActiveView("team-chat")
            }}
            onBack={() => setActiveView("home")}
            onHome={() => setActiveView("home")}
          />
        </div>
      </div>
    )
  }

  if (activeView === "team-chat" && selectedTeamChatId) {
    const teamProject = teamProjects.find((p) => p.id === selectedTeamChatId)
    if (teamProject) {
      return (
        <div className="h-screen flex">
          <SidebarNav activeView={activeView} onNavigate={handleNavigate} />
          <div className="flex-1">
            <TeamChat
              teamProject={teamProject}
              onBack={() => setActiveView("team-chat-select")}
              onHome={() => setActiveView("home")}
            />
          </div>
        </div>
      )
    }
  }

  if (activeView === "exam-prep-select") {
    return (
      <div className="h-screen flex">
        <SidebarNav activeView={activeView} onNavigate={handleNavigate} />
        <div className="flex-1">
          <WorkspaceSelector
            workspaces={workspaces}
            onSelect={(workspaceId) => {
              setCurrentWorkspaceId(workspaceId)
              setWorkspaceExamMode(true)
              setActiveView("exam-prep")
            }}
            onBack={() => setActiveView("home")}
            onHome={() => setActiveView("home")}
          />
        </div>
      </div>
    )
  }

  if (activeView === "team-workspace" && currentTeamProjectId) {
    const teamProject = teamProjects.find((p) => p.id === currentTeamProjectId)
    if (teamProject) {
      return (
        <div className="h-screen flex">
          <SidebarNav activeView={activeView} onNavigate={handleNavigate} />
          <div className="flex-1 overflow-auto">
            <TeamProjectWorkspace
              project={teamProject}
              onBack={() => setActiveView("team-projects")}
              onUpdateProject={(updatedProject) => {
                setTeamProjects((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)))
              }}
              onOpenChat={() => {
                setSelectedTeamChatId(currentTeamProjectId)
                setActiveView("team-chat")
              }}
            />
          </div>
        </div>
      )
    }
  }

  return (
    <div className="h-screen flex bg-gray-50">
      <SidebarNav
        activeView={activeView}
        onNavigate={handleNavigate}
        workspaceCount={workspaces.length}
        courseCount={courses.length}
        teamProjectCount={teamProjects.length}
      />

      <div className="flex-1 overflow-hidden">
        {activeView === "home" && (
          <StudyDashboard
            onNavigate={setActiveView}
            workspaceCount={workspaces.length}
            teamProjectCount={teamProjects.length}
            studyHours={2.5}
            courses={courses}
          />
        )}
        {activeView === "calendar" && (
          <div className="min-h-screen bg-[#F9FAFB] p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setActiveView("home")}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-[#1F2937]">캘린더</h1>
                  <p className="text-sm text-[#6B7280]">일정을 관리하세요</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    className="px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    ←
                  </button>
                  <h3 className="text-xl font-bold text-[#1F2937]">
                    {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
                  </h3>
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    className="px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    →
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-6">
                  {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                    <div key={day} className="text-center text-sm font-semibold text-[#6B7280] py-2">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: currentMonth.getDay() }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: getDaysInMonth(currentMonth).daysInMonth }).map((_, i) => {
                    const day = i + 1
                    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                    const hasEvent = events.some((e: any) => e.date === dateStr)
                    const isSelected = selectedDate === dateStr
                    const isToday = dateStr === new Date().toISOString().split("T")[0]

                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`p-3 text-sm rounded-lg transition-colors relative min-h-[50px] ${
                          isSelected
                            ? "bg-[#3B82F6] text-white font-bold"
                            : isToday
                              ? "bg-[#DBEAFE] text-[#1F2937] font-semibold"
                              : "hover:bg-gray-100 text-[#1F2937]"
                        }`}
                      >
                        {day}
                        {hasEvent && (
                          <div
                            className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-[#3B82F6]"}`}
                          />
                        )}
                      </button>
                    )
                  })}
                </div>

                {selectedDate && (
                  <div className="space-y-4 pt-4 border-t">
                    <p className="text-sm font-semibold text-[#1F2937]">{selectedDate} 일정 추가</p>
                    <input
                      type="text"
                      placeholder="일정 제목"
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                    />
                    <input
                      type="time"
                      value={newEventTime}
                      onChange={(e) => setNewEventTime(e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                    />
                    <button
                      onClick={handleAddEvent}
                      className="w-full py-3 bg-[#3B82F6] text-white rounded-lg font-medium hover:bg-[#2563EB] transition-colors"
                    >
                      일정 등록
                    </button>

                    {events.filter((e: any) => e.date === selectedDate).length > 0 && (
                      <div className="space-y-2 pt-4 border-t">
                        <p className="text-sm font-semibold text-[#1F2937] mb-3">등록된 일정</p>
                        {events
                          .filter((e: any) => e.date === selectedDate)
                          .map((event: any) => (
                            <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="text-sm font-medium text-[#1F2937]">{event.title}</p>
                                {event.time && <p className="text-xs text-[#6B7280] mt-1">{event.time}</p>}
                              </div>
                              <button
                                onClick={() => handleDeleteEvent(event.id)}
                                className="px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 rounded transition-colors"
                              >
                                삭제
                              </button>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {activeView === "timetable" && (
          <TimetableManager
            onBack={() => setActiveView("home")}
            onCourseSelect={handleCourseSelect}
            onCoursesChange={handleCoursesChange}
          />
        )}
        {activeView === "course-workspace" && selectedCourse && (
          <CourseWorkspace
            course={selectedCourse}
            onBack={() => setActiveView("timetable")}
            onSelectFeature={(feature) => setActiveView(feature)}
            notes={workspaceNotes}
            audios={workspaceAudios.filter((a) => a.workspaceId === selectedCourse.id)}
            lives={workspaceLives.filter((l) => l.workspaceId === selectedCourse.id)}
            onDeleteNote={handleDeleteNote}
            onDeleteAudio={handleDeleteAudio}
            onDeleteLive={handleDeleteLive}
            onOpenNote={(id) => {
              setCurrentDocId(id)
              setActiveView("summary")
            }}
          />
        )}
        {activeView === "workspaces" && (
          <WorkspaceManager
            workspaces={workspaces}
            onCreateWorkspace={handleCreateWorkspace}
            onSelectWorkspace={handleSelectWorkspace}
            onDeleteWorkspace={handleDeleteWorkspace}
            onBack={() => setActiveView("home")}
          />
        )}
        {activeView === "workspace-detail" && currentWorkspace && (
          <WorkspaceDetail
            workspace={currentWorkspace}
            onSelectFeature={handleWorkspaceFeature}
            onBack={() => setActiveView("workspaces")}
            recentNotes={currentWorkspaceNotes}
            recentAudios={workspaceAudios.filter((a) => a.workspaceId === currentWorkspace.id)}
            recentLives={workspaceLives.filter((l) => l.workspaceId === currentWorkspace.id)}
            onOpenNote={(id) => {
              setCurrentDocId(id)
              setActiveView("summary")
            }}
            onDeleteNote={(id) => {
              setAnalyzedDocs((prev) => prev.filter((doc) => doc.id !== id))
            }}
            onDeleteAudio={(id) => {
              setWorkspaceAudios((prev) => prev.filter((audio) => audio.id !== id))
            }}
            onDeleteLive={(id) => {
              setWorkspaceLives((prev) => prev.filter((live) => live.id !== id))
            }}
            onOpenWorkspaceChat={handleOpenWorkspaceChat}
            isProcessingAudio={processingAudioId}
          />
        )}
        {activeView === "upload" && (
          <DocumentUpload
            onUpload={handleDocumentUpload}
            onBack={() => (currentWorkspaceId ? setActiveView("workspace-detail") : setActiveView("home"))}
          />
        )}
        {activeView === "audio" && (
          <AudioUpload
            onTranscribe={handleAudioTranscribe}
            onBack={() => (currentWorkspaceId ? setActiveView("workspace-detail") : setActiveView("home"))}
            onProcessingStart={setProcessingAudioId}
          />
        )}
        {activeView === "live" && (
          <LiveTranscription
            onSaveTranscript={handleSaveTranscript}
            onBack={() => (currentWorkspaceId ? setActiveView("workspace-detail") : setActiveView("home"))}
          />
        )}
        {activeView === "saved" && (
          <SavedTranscripts
            transcripts={savedTranscripts}
            onDelete={handleDeleteTranscript}
            onBack={() => setActiveView("home")}
          />
        )}
        {activeView === "summary" && (
          <DocumentSummary
            uploadedFiles={uploadedFiles}
            documentContents={
              documentContents.length > 0 
                ? documentContents 
                : (analyzedDocs.find((d) => d.id === currentDocId)?.contents || [])
            }
            cachedSummary={analyzedDocs.find((d) => d.id === currentDocId)?.summary}
            onQuestionClick={(question) => {
              setChatInput(question)
              setActiveView("document-chat")
            }}
            onSummaryGenerated={(summary) => handleSaveAnalyzedDoc(summary)}
            onOpenChat={() => setActiveView("document-chat")}
            onBack={() => (currentWorkspaceId ? setActiveView("workspace-detail") : setActiveView("home"))}
          />
        )}
        {activeView === "transcription" && (
          <TranscriptionResult
            audioFileName={audioFile?.name || ""}
            rawTranscript={rawTranscript}
            refinedTranscript={refinedTranscript}
            isProcessing={isTranscribing}
            error={transcriptionError}
            onReset={handleResetTranscription}
            onBack={() => setActiveView("audio")}
          />
        )}
        {activeView === "chat" && (
          <div className="h-full bg-white">
            <ChatPanel
              documents={[]}
              externalInput={chatInput}
              onExternalInputUsed={() => setChatInput("")}
              onBack={() => setActiveView("home")}
            />
          </div>
        )}
        {activeView === "document-chat" && (
          <div className="h-full bg-white">
            <ChatPanel
              documents={
                documentContents.length > 0 
                  ? documentContents 
                  : (analyzedDocs.find((d) => d.id === currentDocId)?.contents || [])
              }
              externalInput={chatInput}
              onExternalInputUsed={() => setChatInput("")}
              onBack={() => setActiveView("summary")}
            />
          </div>
        )}
        {activeView === "workspace-chat" && (
          <div className="h-full bg-white">
            <ChatPanel
              documents={documentContents}
              externalInput={chatInput}
              onExternalInputUsed={() => setChatInput("")}
              onBack={() => setActiveView("workspace-detail")}
            />
          </div>
        )}
        {activeView === "exam-prep" && (
          <ExamPrepDashboard
            notes={workspaceExamMode ? allWorkspaceContent : analyzedDocs}
            onBack={() => {
              if (workspaceExamMode) {
                setWorkspaceExamMode(false)
                setActiveView("workspace-detail")
              } else {
                setActiveView("home")
              }
            }}
            onSelectNote={(id) => {
              setCurrentDocId(id)
              setActiveView("summary")
            }}
          />
        )}
        {activeView === "team-projects" && (
          <TeamProjectManager onBack={() => setActiveView("home")} onSelectProject={handleSelectTeamProject} />
        )}
        {activeView === "community" && (
          <Community
            onWritePost={handleWriteCommunityPost}
            onViewPost={handleViewCommunityPost}
            onBack={() => setActiveView("home")}
          />
        )}

        {activeView === "community-write" && (
          <CommunityWrite onSave={handleSaveCommunityPost} onCancel={() => setActiveView("community")} />
        )}

        {activeView === "community-post" && selectedPost && (
          <CommunityPostDetail
            post={selectedPost}
            onBack={() => setActiveView("community")}
            onUpdatePost={handleUpdatePost}
          />
        )}
      </div>
    </div>
  )
}
