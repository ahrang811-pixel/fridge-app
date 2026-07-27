import { useState } from 'react'
import { YoutubeRecipeReviewModal } from './YoutubeRecipeReviewModal'
import { analyzeYoutubeRecipe } from './youtubeRecipeClient'

function toTextBlock(list) {
  return (list ?? []).join('\n')
}

function toNumberedTextBlock(list) {
  return (list ?? []).map((step, i) => `${i + 1}. ${step}`).join('\n')
}

// 상태: idle(입력창) -> loading(분석 중) -> review(검토 모달) -> saving(저장 중)
export function YoutubeRecipeFlow({ categories, onSaveRecipe }) {
  const [status, setStatus] = useState('idle')
  const [url, setUrl] = useState('')
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const handleAnalyze = async (e) => {
    e.preventDefault()
    if (!url.trim()) return

    setError(null)
    setStatus('loading')
    try {
      const data = await analyzeYoutubeRecipe({ url: url.trim(), categories })
      setResult(data)
      setStatus('review')
    } catch (err) {
      setError(err.message || '유튜브 레시피 분석 중 오류가 발생했습니다.')
      setStatus('idle')
    }
  }

  const handleCancel = () => {
    setStatus('idle')
    setResult(null)
  }

  const handleSave = async (row) => {
    setStatus('saving')
    try {
      await onSaveRecipe(row)
      setStatus('idle')
      setUrl('')
      setResult(null)
    } catch (err) {
      setError(err.message || '레시피 저장 중 오류가 발생했습니다.')
      setStatus('review')
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={handleAnalyze} className="flex flex-wrap gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="🔗 유튜브 링크를 붙여넣으세요"
          disabled={status === 'loading'}
          className="min-w-[200px] flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none disabled:bg-gray-50"
        />
        <button
          type="submit"
          disabled={status === 'loading' || !url.trim()}
          className="flex items-center gap-1.5 rounded-md border border-emerald-600 px-3 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ▶️ {status === 'loading' ? '분석하는 중…' : '유튜브 링크로 추가'}
        </button>
      </form>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {(status === 'review' || status === 'saving') && result && (
        <YoutubeRecipeReviewModal
          videoId={result.videoId}
          title={result.title}
          found={!!result.found}
          source={result.source ?? null}
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
