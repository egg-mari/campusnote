"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react"
import { useState } from "react"

interface Flashcard {
  front: string
  back: string
}

interface FlashcardViewerProps {
  flashcards: Flashcard[]
}

export function FlashcardViewer({ flashcards }: FlashcardViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const handleNext = () => {
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev + 1) % flashcards.length)
  }

  const handlePrev = () => {
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length)
  }

  if (flashcards.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-[#6B7280]">플래시카드가 없습니다</p>
      </Card>
    )
  }

  const currentCard = flashcards[currentIndex]

  return (
    <div className="space-y-4">
      <div className="text-center text-sm text-[#6B7280]">
        {currentIndex + 1} / {flashcards.length}
      </div>

      <Card
        className="p-8 min-h-[300px] flex items-center justify-center cursor-pointer transition-all hover:shadow-lg"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="text-center">
          <p className="text-xs text-[#6B7280] mb-4">{isFlipped ? "뒷면" : "앞면"}</p>
          <p className="text-lg text-[#1F2937] leading-relaxed">{isFlipped ? currentCard.back : currentCard.front}</p>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#9CA3AF]">
            <RotateCw className="w-4 h-4" />
            <span>카드를 클릭하여 뒤집기</span>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={handlePrev}
          variant="outline"
          size="icon"
          className="rounded-full bg-transparent"
          disabled={flashcards.length <= 1}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button
          onClick={handleNext}
          variant="outline"
          size="icon"
          className="rounded-full bg-transparent"
          disabled={flashcards.length <= 1}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
