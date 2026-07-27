import { findIngredientMatch } from '../ingredientKnowledge'

// 영수증에는 상품명 외에도 매장 정보/합계/결제 수단 같은 줄이 섞여 있다.
// 완벽한 분류는 불가능하므로, 이 목록에 걸리는 줄은 후보에서 제외하고
// 나머지는 사용자가 검토 화면에서 직접 체크/수정하게 한다.
const EXCLUDE_KEYWORDS = [
  '합계', '소계', '총액', '과세', '면세', '부가세', '봉투',
  '카드', '현금', '거스름', '잔액', '승인', '할부',
  '포인트', '적립', '할인', '쿠폰',
  '가맹점', '사업자', '대표자', '전화', '주소', '영수증', '매장',
  '결제', '품명', '수량', '단가', '금액', '바코드',
  '고객', '환영', '감사합니다', '이용해', '통신판매', '영업', '팩스', '홈페이지',
  'TEL', 'FAX', 'NO.',
]

const NUMERIC_TOKEN = /^[\d,.]+원?$/
const QTY_TOKEN = /^[*xX]?\d+(개|g|kg|ml|l|병|봉|팩|모|단|통)$/i
const LEADING_INDEX = /^\d{1,3}[.)]\s*/

function containsHangul(text) {
  return /[가-힣]/.test(text)
}

function isExcludedLine(line) {
  const upper = line.toUpperCase()
  return EXCLUDE_KEYWORDS.some((kw) => upper.includes(kw.toUpperCase()))
}

function looksLikeDateOrPhone(line) {
  return (
    /\d{2,4}[.\-/]\d{1,2}[.\-/]\d{1,2}/.test(line) ||
    /\d{2,4}-\d{3,4}-\d{4}/.test(line)
  )
}

// Clova OCR General 응답의 fields는 단어 단위 토큰이며 lineBreak로 줄 끝을 표시한다.
// 이를 사람이 읽는 줄 단위 텍스트로 재구성한다.
function fieldsToLines(fields) {
  const lines = []
  let current = []
  for (const field of fields) {
    current.push(field.inferText)
    if (field.lineBreak) {
      lines.push(current.join(' '))
      current = []
    }
  }
  if (current.length) lines.push(current.join(' '))
  return lines
}

// "두부 1 2,500 2,500" 같은 한 줄에서 뒤쪽 숫자(수량/단가/금액) 토큰을 잘라내고
// 상품명과 수량 추정치를 분리한다.
function parseLine(rawLine) {
  const tokens = rawLine.trim().split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return null

  let end = tokens.length
  let qtyGuess = null
  while (
    end > 0 &&
    (NUMERIC_TOKEN.test(tokens[end - 1]) || QTY_TOKEN.test(tokens[end - 1]))
  ) {
    if (!qtyGuess && QTY_TOKEN.test(tokens[end - 1])) {
      qtyGuess = tokens[end - 1].replace(/^[*xX]/, '')
    }
    end--
  }

  const nameTokens = tokens.slice(0, end)
  if (nameTokens.length === 0) return null

  const name = nameTokens.join(' ').replace(LEADING_INDEX, '').trim()
  if (!name) return null

  return { name, quantity: qtyGuess ?? '1개' }
}

let idSeq = 0
function nextId() {
  idSeq += 1
  return `receipt-${Date.now()}-${idSeq}`
}

// OCR 응답에서 식재료로 보이는 줄을 뽑아 검토용 후보 목록을 만든다.
// fallbackCategory는 알려진 식재료와 매칭되지 않았을 때 사용할 기본 카테고리다.
export function extractCandidates(ocrResponse, fallbackCategory) {
  const fields = ocrResponse?.images?.[0]?.fields ?? []
  const lines = fieldsToLines(fields)

  const seen = new Set()
  const candidates = []

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) continue
    if (!containsHangul(line)) continue
    if (isExcludedLine(line)) continue
    if (looksLikeDateOrPhone(line)) continue

    const parsed = parseLine(line)
    if (!parsed || parsed.name.length < 2) continue
    if (seen.has(parsed.name)) continue
    seen.add(parsed.name)

    const match = findIngredientMatch(parsed.name)

    candidates.push({
      id: nextId(),
      name: match ? match.name : parsed.name,
      quantity: parsed.quantity,
      category: match?.category ?? fallbackCategory,
      checked: true,
    })
  }

  return candidates
}
