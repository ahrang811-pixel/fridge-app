import { useRef, useState } from 'react'
import { todayKey } from '../../../utils/date-utils'
import { addExpenseAmount } from '../../expenses/expenseStore'
import { ReceiptReviewModal } from './ReceiptReviewModal'
import { extractCandidates, extractReceiptTotal } from './receiptParser'
import { recognizeReceipt } from './receiptOcr'

// 상태: idle(버튼만) -> loading(인식 중) -> review(검토 모달) -> saving(일괄 추가 중)
export function ReceiptScanFlow({ categories, onImportItems }) {
  const [status, setStatus] = useState('idle')
  const [candidates, setCandidates] = useState([])
  const [error, setError] = useState(null)
  const [expenseAmount, setExpenseAmount] = useState('')
  const [expenseEnabled, setExpenseEnabled] = useState(false)
  const [expenseDetected, setExpenseDetected] = useState(false)
  const inputRef = useRef(null)

  const handlePick = () => inputRef.current?.click()

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setError(null)
    setStatus('loading')
    try {
      const ocrResult = await recognizeReceipt(file)
      const found = extractCandidates(ocrResult, categories[0] ?? '')
      if (found.length === 0) {
        setError('영수증에서 식재료로 보이는 항목을 찾지 못했습니다. 다른 사진으로 다시 시도해보세요.')
        setStatus('idle')
        return
      }
      const total = extractReceiptTotal(ocrResult)
      setCandidates(found)
      setExpenseAmount(total ? String(total) : '')
      setExpenseEnabled(!!total)
      setExpenseDetected(!!total)
      setStatus('review')
    } catch (err) {
      setError(err.message || '영수증 인식 중 오류가 발생했습니다.')
      setStatus('idle')
    }
  }

  const updateCandidate = (id, patch) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    )
  }

  const removeCandidate = (id) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id))
  }

  const toggleAll = (checked) => {
    setCandidates((prev) => prev.map((c) => ({ ...c, checked })))
  }

  const handleCancel = () => {
    setStatus('idle')
    setCandidates([])
    setError(null)
    setExpenseAmount('')
    setExpenseEnabled(false)
    setExpenseDetected(false)
  }

  const handleConfirm = async () => {
    const selected = candidates
      .filter((c) => c.checked && c.name.trim())
      .map((c) => ({
        name: c.name.trim(),
        quantity: c.quantity.trim() || '1개',
        category: c.category,
        purchaseDate: todayKey(),
        expiryDate: null,
      }))
    if (selected.length === 0) return

    setStatus('saving')
    try {
      await onImportItems(selected)
      if (expenseEnabled) {
        addExpenseAmount(todayKey(), Number(expenseAmount))
      }
      setStatus('idle')
      setCandidates([])
      setExpenseAmount('')
      setExpenseEnabled(false)
      setExpenseDetected(false)
    } catch (err) {
      setError(err.message || '식재료 추가 중 오류가 발생했습니다.')
      setStatus('review')
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      <button
        type="button"
        onClick={handlePick}
        disabled={status === 'loading'}
        className="flex items-center gap-1.5 rounded-md border border-emerald-600 px-3 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        📷 {status === 'loading' ? '인식하는 중…' : '영수증으로 추가'}
      </button>

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      {status === 'review' && (
        <ReceiptReviewModal
          candidates={candidates}
          categories={categories}
          saving={false}
          onUpdate={updateCandidate}
          onRemove={removeCandidate}
          onToggleAll={toggleAll}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          expenseAmount={expenseAmount}
          expenseEnabled={expenseEnabled}
          expenseDetected={expenseDetected}
          onExpenseAmountChange={setExpenseAmount}
          onExpenseEnabledChange={setExpenseEnabled}
        />
      )}

      {status === 'saving' && (
        <ReceiptReviewModal
          candidates={candidates}
          categories={categories}
          saving={true}
          onUpdate={() => {}}
          onRemove={() => {}}
          onToggleAll={() => {}}
          onConfirm={() => {}}
          expenseAmount={expenseAmount}
          expenseEnabled={expenseEnabled}
          expenseDetected={expenseDetected}
          onExpenseAmountChange={() => {}}
          onExpenseEnabledChange={() => {}}
          onCancel={() => {}}
        />
      )}
    </div>
  )
}
