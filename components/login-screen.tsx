"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"

interface LoginScreenProps {
  onLogin: () => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [school, setSchool] = useState("")
  const [error, setError] = useState("")

  const handleLogin = () => {
    if (username === "1" && password === "1" && school === "동양미래대학교") {
      onLogin()
    } else {
      setError("아이디, 비밀번호 또는 학교를 확인해주세요.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
      <Card className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg border border-gray-200">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Document AI</h1>
          <p className="text-gray-600">문서 분석 및 음성 인식 플랫폼</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700" htmlFor="username">
              아이디
            </label>
            <Input
              id="username"
              type="text"
              placeholder="아이디를 입력하세요"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700" htmlFor="password">
              비밀번호
            </label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin()
              }}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700" htmlFor="school">
              학교
            </label>
            <Select value={school} onValueChange={setSchool}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="학교를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="동양미래대학교">동양미래대학교</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>}

          <Button onClick={handleLogin} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            로그인
          </Button>
        </div>

        <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-200">
          동양미래대학교 문서 AI 시스템
        </div>
      </Card>
    </div>
  )
}
