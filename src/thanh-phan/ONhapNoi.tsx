import { useEffect, useId, useRef, useState } from 'react'

export interface ONhapNoiProps {
  label: string
  value?: string
  onChange?: (val: string) => void
  type?: 'text' | 'password' | 'email' | 'tel'
  id?: string
  autoComplete?: string
  autoCapitalize?: string
  error?: boolean
  status?: 'error' | 'warning' | ''
  shakeKey?: number
  disabled?: boolean
  onBlur?: () => void
  onFocus?: () => void
  'aria-invalid'?: boolean | 'true' | 'false'
  'aria-describedby'?: string
}

/** Ô nhập nhãn nổi kèm hiệu ứng rung báo lỗi và nút mắt chớp hiện/ẩn mật khẩu (#403). */
export default function ONhapNoi({
  label,
  value = '',
  onChange,
  type = 'text',
  id,
  autoComplete,
  autoCapitalize,
  error = false,
  status,
  shakeKey = 0,
  disabled = false,
  onBlur,
  onFocus,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
}: ONhapNoiProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const [focused, setFocused] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [shaking, setShaking] = useState(false)
  const prevErrRef = useRef(false)

  const coLoi = error || status === 'error' || ariaInvalid === true || ariaInvalid === 'true'
  const isUp = focused || String(value ?? '').length > 0
  const isPassword = type === 'password'

  useEffect(() => {
    const loiMoi = coLoi && !prevErrRef.current
    prevErrRef.current = coLoi
    if (!shakeKey && !loiMoi) return
    setShaking(false)
    const idFrame = window.requestAnimationFrame(() => setShaking(true))
    const timer = window.setTimeout(() => setShaking(false), 480)
    return () => {
      window.cancelAnimationFrame(idFrame)
      window.clearTimeout(timer)
    }
  }, [shakeKey, coLoi])

  return (
    <div
      className={[
        'u403-f',
        isPassword ? 'u403-pw' : '',
        focused ? 'is-f' : '',
        isUp ? 'is-up' : '',
        coLoi ? 'is-err' : '',
        shaking ? 'is-shake' : '',
      ].filter(Boolean).join(' ')}
    >
      <input
        id={inputId}
        className="u403-in"
        type={isPassword && showPw ? 'text' : type}
        value={value ?? ''}
        disabled={disabled}
        autoComplete={autoComplete}
        autoCapitalize={autoCapitalize}
        spellCheck={false}
        aria-invalid={coLoi ? true : undefined}
        aria-describedby={ariaDescribedBy}
        onFocus={() => {
          setFocused(true)
          onFocus?.()
        }}
        onBlur={() => {
          setFocused(false)
          onBlur?.()
        }}
        onChange={(e) => onChange?.(e.target.value)}
      />
      <label htmlFor={inputId}>{label}</label>
      {isPassword && (
        <button
          type="button"
          className="u403-eye"
          aria-label={showPw ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          aria-pressed={showPw}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setShowPw((v) => !v)}
        >
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <g className="lid">
              <path d="M2 10s3-5.2 8-5.2S18 10 18 10s-3 5.2-8 5.2S2 10 2 10z" />
              <circle cx="10" cy="10" r="2.4" />
            </g>
            <g className="lash">
              <path d="M3 10.4c2 2.4 4.4 3.4 7 3.4s5-1 7-3.4M6 13l-1 1.6M10 14v1.8M14 13l1 1.6" />
            </g>
          </svg>
        </button>
      )}
    </div>
  )
}
