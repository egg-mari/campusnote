"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Eye, BookOpen, FileText, Users, MessageCircle, UserPlus } from "lucide-react"

interface Post {
  id: string
  title: string
  content: string
  author: string
  category: string
  createdAt: string
  views: number
  comments: number
}

interface Comment {
  id: string
  postId: string
  author: string
  content: string
  createdAt: string
}

interface CommunityPostDetailProps {
  post: Post
  onBack: () => void
  onUpdatePost: (post: Post) => void
}

export function CommunityPostDetail({ post, onBack, onUpdatePost }: CommunityPostDetailProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")

  const categories = {
    exam: { label: "시험 공부", icon: BookOpen, color: "bg-blue-500" },
    assignment: { label: "과제 공유", icon: FileText, color: "bg-green-500" },
    recruit: { label: "팀원 모집", icon: Users, color: "bg-purple-500" },
    free: { label: "자유 게시판", icon: MessageCircle, color: "bg-orange-500" },
  }

  const categoryInfo = categories[post.category as keyof typeof categories]
  const CategoryIcon = categoryInfo.icon

  useEffect(() => {
    const storedComments = localStorage.getItem("community-comments")
    if (storedComments) {
      const allComments = JSON.parse(storedComments)
      setComments(allComments.filter((c: Comment) => c.postId === post.id))
    }

    // Increment view count
    const updatedPost = { ...post, views: post.views + 1 }
    onUpdatePost(updatedPost)
  }, [post]) // Updated to use the entire post object as dependency

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      postId: post.id,
      author: "곽준",
      content: newComment,
      createdAt: new Date().toLocaleString("ko-KR"),
    }

    const storedComments = localStorage.getItem("community-comments")
    const allComments = storedComments ? JSON.parse(storedComments) : []
    allComments.push(comment)
    localStorage.setItem("community-comments", JSON.stringify(allComments))

    setComments([...comments, comment])
    setNewComment("")

    // Update comment count
    const updatedPost = { ...post, comments: post.comments + 1 }
    onUpdatePost(updatedPost)
  }

  const renderContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      let processedLine = line
      // Bold
      processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // Italic
      processedLine = processedLine.replace(/\*(.*?)\*/g, "<em>$1</em>")

      if (line.startsWith("- ")) {
        return <li key={i} dangerouslySetInnerHTML={{ __html: processedLine.slice(2) }} />
      }
      return <p key={i} dangerouslySetInnerHTML={{ __html: processedLine }} className="mb-2" />
    })
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            ← 뒤로
          </Button>
          <h1 className="text-xl font-bold text-gray-900">게시글</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Post */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className={`${categoryInfo.color} text-white text-xs px-2 py-1 rounded flex items-center gap-1`}>
                <CategoryIcon className="w-3 h-3" />
                {categoryInfo.label}
              </span>
              <span className="text-xs text-gray-500">{post.createdAt}</span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 pb-4 border-b">
              <span>{post.author}</span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {post.views}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                {post.comments}
              </span>
            </div>

            <div className="prose prose-sm max-w-none">{renderContent(post.content)}</div>
          </div>

          {/* Comments */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              댓글 {comments.length}
            </h2>

            {/* Comment List */}
            <div className="space-y-4 mb-6">
              {comments.map((comment) => (
                <div key={comment.id} className="border-b pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{comment.author}</span>
                      <span className="text-xs text-gray-500">{comment.createdAt}</span>
                    </div>
                    {post.category === "recruit" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs gap-1 border-purple-500 text-purple-600 hover:bg-purple-50 bg-transparent"
                      >
                        <UserPlus className="w-3 h-3" />
                        팀플 초대
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>

            {/* New Comment */}
            <div>
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요"
                className="mb-2"
              />
              <Button onClick={handleAddComment} className="bg-[#5B5FED] hover:bg-[#4A4EDB]">
                댓글 작성
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
