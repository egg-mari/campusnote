// 텍스트를 작은 청크로 나누는 유틸리티

export interface TextChunk {
  text: string
  index: number
  start: number
  end: number
}

export function chunkText(text: string, chunkSize = 5000, overlap = 200): TextChunk[] {
  const chunks: TextChunk[] = []
  let start = 0
  let index = 0

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length)
    const chunkText = text.slice(start, end)

    chunks.push({
      text: chunkText,
      index,
      start,
      end,
    })

    if (end >= text.length) break
    start = Math.max(0, end - overlap)
    if (start >= end) start = end // 무한 루프 방지
    index++
  }

  return chunks
}

// 간단한 키워드 기반 관련도 계산
export function calculateRelevance(query: string, text: string): number {
  const queryWords = query.toLowerCase().split(/\s+/)
  const textLower = text.toLowerCase()

  let score = 0
  queryWords.forEach((word) => {
    if (word.length < 2) return
    const matches = textLower.split(word).length - 1
    score += matches
  })

  return score
}

// 질문과 가장 관련 있는 청크 찾기
export function findRelevantChunks(query: string, chunks: TextChunk[], maxChunks = 3): TextChunk[] {
  const scored = chunks.map((chunk) => ({
    chunk,
    score: calculateRelevance(query, chunk.text),
  }))

  // 점수 순으로 정렬하고 상위 N개 선택
  scored.sort((a, b) => b.score - a.score)

  return scored.slice(0, maxChunks).map((item) => item.chunk)
}
