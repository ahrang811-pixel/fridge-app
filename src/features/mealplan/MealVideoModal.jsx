import { useMemo, useState } from 'react'
import { parseVideoUrl } from '../../utils/videoLinks'
import { getRecipeThumbnail, getRecipeVideo } from './mealVideoMatch'

// 후보 카드의 썸네일 영역. 이미지 로드에 실패하면(예: 유튜브 썸네일이 아직
// 없는 영상) 조용히 영상 타입 아이콘으로 대체한다.
function CandidateThumbnail({ src, videoType }) {
  const [failed, setFailed] = useState(false)
  const showImage = src && !failed

  return (
    <div className="flex aspect-video w-full items-center justify-center bg-gray-100">
      {showImage ? (
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="text-2xl" aria-hidden="true">
          {videoType === 'youtube' ? '▶️' : '📸'}
        </span>
      )}
    </div>
  )
}

// 메뉴에 연결된 영상을 보여주거나(mode: 'view'), 레시피 탭에서 골라 연결하거나
// 링크를 직접 붙여넣어 새로 연결한다(mode: 'attach').
export function MealVideoModal({ menuName, recipes, current, onAttach, onClear, onClose }) {
  const [mode, setMode] = useState(current.videoType ? 'view' : 'attach')
  const [search, setSearch] = useState(menuName || '')
  const [manualUrl, setManualUrl] = useState('')
  const [urlError, setUrlError] = useState(null)
  const [saving, setSaving] = useState(false)

  const candidates = useMemo(() => {
    const query = search.trim().toLowerCase()
    return recipes
      .map((r) => {
        const video = getRecipeVideo(r)
        return { id: r.id, name: r.name, video, thumbnail: getRecipeThumbnail(r, video) }
      })
      .filter((r) => r.video && (!query || r.name.toLowerCase().includes(query)))
  }, [recipes, search])

  const handleAttach = async (video) => {
    if (saving) return
    setSaving(true)
    try {
      await onAttach(video)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const handleManualSubmit = (e) => {
    e.preventDefault()
    const parsed = parseVideoUrl(manualUrl)
    if (!parsed) {
      setUrlError('유튜브 또는 인스타그램 링크만 지원해요.')
      return
    }
    handleAttach(parsed)
  }

  const handleClear = async () => {
    if (saving) return
    setSaving(true)
    try {
      await onClear()
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="flex max-h-[85vh] w-full max-w-md flex-col rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-900">
            {mode === 'view' ? '연결된 영상' : '영상 연결'}
            {menuName ? ` · ${menuName}` : ''}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-gray-400 hover:bg-gray-100"
          >
            닫기
          </button>
        </div>

        {mode === 'view' && current.videoType && (
          <div className="flex flex-col gap-3 px-5 py-4">
            {current.videoType === 'youtube' ? (
              <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${current.videoRef}`}
                  title={menuName}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <a
                href={current.videoRef}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                📸 인스타그램에서 보기 →
              </a>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode('attach')}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                영상 바꾸기
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={saving}
                className="flex-1 rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                연결 해제
              </button>
            </div>
          </div>
        )}

        {mode === 'attach' && (
          <div className="flex flex-1 flex-col overflow-hidden px-5 py-4">
            <p className="mb-2 text-xs text-gray-400">
              레시피 탭에 저장된 영상 중에서 고르거나, 링크를 직접 붙여넣으세요.
            </p>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 레시피 이름으로 검색"
              className="mb-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
            <div className="mb-3 max-h-64 overflow-y-auto">
              {candidates.length === 0 ? (
                <p className="py-6 text-center text-xs text-gray-400">
                  영상이 연결된 레시피가 없어요.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {candidates.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleAttach(r.video)}
                      disabled={saving}
                      className="flex flex-col overflow-hidden rounded-lg border border-gray-200 text-left hover:border-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <CandidateThumbnail src={r.thumbnail} videoType={r.video.videoType} />
                      <span className="truncate px-2 py-1.5 text-xs font-medium text-gray-700">
                        {r.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={handleManualSubmit}
              className="flex flex-col gap-2 border-t border-gray-100 pt-3"
            >
              <label className="text-xs font-medium text-gray-500">
                또는 유튜브·인스타그램 링크 직접 입력
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualUrl}
                  onChange={(e) => {
                    setManualUrl(e.target.value)
                    setUrlError(null)
                  }}
                  placeholder="https://..."
                  className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={saving}
                  className="shrink-0 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  연결
                </button>
              </div>
              {urlError && <p className="text-xs text-red-500">{urlError}</p>}
            </form>

            {current.videoType && (
              <button
                type="button"
                onClick={() => setMode('view')}
                className="mt-3 self-start text-xs text-gray-400 hover:text-gray-600"
              >
                ‹ 연결된 영상 보기로 돌아가기
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
