import { useState } from 'react'
import { InstagramRecipeReviewModal } from './InstagramRecipeReviewModal'
import { analyzeInstagramRecipe } from './instagramRecipeClient'

function toTextBlock(list) {
  return (list ?? []).join('\n')
}

function toNumberedTextBlock(list) {
  return (list ?? []).map((step, i) => `${i + 1}. ${step}`).join('\n')
}

// 상태: idle(링크 입력) -> loading(분석 중) -> manual(자동 수집 실패, 캡션 직접 붙여넣기)
//       -> review(검토 모달) -> saving(저장 중)
export function InstagramRecipeFlow({ categories, onSaveRecipe }) {
  const [status, setStatus] = useState('idle')
  const [url, setUrl] = useState('')
  const [manualCaption, setManualCaption] = useState('')
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const handleFetch = async (e) => {
    e.preventDefault()
    if (!url.trim()) return

    setError(null)
    setStatus('loading')
    try {
      const data = await analyzeInstagramRecipe({ url: url.trim(), categories })
      if (!data.fetched) {
        setStatus('manual')
        return
      }
      setResult({ ...data, sourceUrl: url.trim() })
      setStatus('review')
    } catch (err) {
      setError(err.message || '인스타그램 레시피 분석 중 오류가 발생했습니다.')
      setStatus('idle')
    }
  }

  const handleManualAnalyze = async (e) => {
    e.preventDefault()
    if (!manualCaption.trim()) return

    setError(null)
    setStatus('loading')
    try {
      const data = await analyzeInstagramRecipe({
        caption: manualCaption.trim(),
        categories,
      })
      setResult({ ...data, sourceUrl: url.trim() })
      setStatus('review')
    } catch (err) {
      setError(err.message || '인스타그램 레시피 분석 중 오류가 발생했습니다.')
      setStatus('manual')
    }
  }

  const handleCancel = () => {
    setStatus('idle')
    setResult(null)
    setUrl('')
    setManualCaption('')
  }

  const handleSave = async (row) => {
    setStatus('saving')
    try {
      await onSaveRecipe(row)
      handleCancel()
    } catch (err) {
      setError(err.message || '레시피 저장 중 오류가 발생했습니다.')
      setStatus('review')
    }
  }

  const busy = status === 'loading'

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={handleFetch} className="flex flex-wrap gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="📸 인스타그램 게시물 링크를 붙여넣으세요"
          disabled={busy}
          className="min-w-[200px] flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none disabled:bg-gray-50"
        />
        <button
          type="submit"
          disabled={busy || !url.trim()}
          className="flex items-center gap-1.5 rounded-md border border-emerald-600 px-3 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          📸 {busy ? '분석하는 중…' : '인스타그램으로 추가'}
        </button>
      </form>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {status === 'manual' && (
        <form
          onSubmit={handleManualAnalyze}
          className="flex flex-col gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3"
        >
          <p className="text-xs text-amber-700">
            📋 자동으로 가져오지 못했어요. 인스타그램 게시물에서 캡션을 복사해서
            아래에 붙여넣어주세요.
          </p>
          <textarea
            value={manualCaption}
            onChange={(e) => setManualCaption(e.target.value)}
            placeholder="게시물 캡션을 붙여넣으세요"
            rows={5}
            disabled={busy}
            className="w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none disabled:bg-gray-50"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={handleCancel}
              className="rounded-md px-3 py-2 text-xs font-medium text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={busy || !manualCaption.trim()}
              className="rounded-md bg-emerald-600 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? '분석하는 중…' : '캡션으로 분석하기'}
            </button>
          </div>
        </form>
      )}

      {(status === 'review' || status === 'saving') && result && (
        <InstagramRecipeReviewModal
          sourceUrl={result.sourceUrl}
          found={!!result.found}
          categories={categories}
          initialName={result.found ? (result.name ?? '') : ''}
          initialCategory={
            result.found && categories.includes(result.category)
              ? result.category
              : (categories[0] ?? '')
          }
          initialIngredients={result.found ? toTextBlock(result.ingredients) : ''}
          initialInstructions={
            result.found ? toNumberedTextBlock(result.instructions) : ''
          }
          saving={status === 'saving'}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  )
}
