"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Plus, Search, Users, BookOpen, FileText, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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

interface CommunityProps {
  onWritePost: () => void
  onViewPost: (post: Post) => void
  onBack: () => void
}

export function Community({ onWritePost, onViewPost, onBack }: CommunityProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", label: "전체", icon: FileText, color: "bg-gray-500" },
    { id: "exam", label: "시험 공부", icon: BookOpen, color: "bg-blue-500" },
    { id: "assignment", label: "과제 공유", icon: FileText, color: "bg-green-500" },
    { id: "recruit", label: "팀원 모집", icon: Users, color: "bg-purple-500" },
    { id: "free", label: "자유 게시판", icon: MessageCircle, color: "bg-orange-500" },
  ]

  useEffect(() => {
    const storedPosts = localStorage.getItem("community-posts")
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts))
    }
  }, [])

  const filteredPosts = posts
    .filter((post) => selectedCategory === "all" || post.category === selectedCategory)
    .filter(
      (post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()),
    )

  const getCategoryInfo = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId) || categories[0]
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              ← 뒤로
            </Button>
            <MessageSquare className="w-6 h-6 text-[#5B5FED]" />
            <h1 className="text-2xl font-bold text-gray-900">커뮤니티</h1>
          </div>
          <Button onClick={onWritePost} className="bg-[#5B5FED] hover:bg-[#4A4EDB]">
            <Plus className="w-4 h-4 mr-2" />
            글쓰기
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="게시글 검색..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => {
            const Icon = category.icon
            const isActive = selectedCategory === category.id

            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  isActive ? `${category.color} text-white` : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{category.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Posts List */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>게시글이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPosts.map((post) => {
              const categoryInfo = getCategoryInfo(post.category)
              const CategoryIcon = categoryInfo.icon

              return (
                <button
                  key={post.id}
                  onClick={() => onViewPost(post)}
                  className="w-full bg-white border rounded-lg p-4 hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className={`${categoryInfo.color} p-2 rounded-lg`}>
                      <CategoryIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`${categoryInfo.color} text-white text-xs px-2 py-1 rounded`}>
                          {categoryInfo.label}
                        </span>
                        <span className="text-xs text-gray-500">{post.createdAt}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{post.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{post.content}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{post.author}</span>
                        <span>조회 {post.views}</span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {post.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
