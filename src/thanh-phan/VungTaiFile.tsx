import { useEffect, useRef, useState } from 'react'

const EXT_COLOR: Record<string, string> = {
  xlsx: '#1D7A4E',
  xls: '#1D7A4E',
  pdf: '#D9304A',
  png: '#B8325C',
  jpg: '#2557A6',
  jpeg: '#2557A6',
}

/** Vùng kéo thả / chọn tệp kèm vòng tròn tiến độ và thẻ file rơi (#432). */
export default function VungTaiFile({
  accept,
  multiple = false,
  compact = false,
  title = 'Kéo thả file vào đây',
  browseLabel = 'chọn file từ máy',
  subtitle = 'Định dạng hỗ trợ',
  ariaLabel = 'Tải tệp lên',
  onChonFile,
}: {
  accept?: string
  multiple?: boolean
  compact?: boolean
  title?: string
  browseLabel?: string
  subtitle?: string
  ariaLabel?: string
  onChonFile: (files: File[]) => Promise<unknown> | unknown
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const depthRef = useRef(0)
  const mountedRef = useRef(true)
  const [drag, setDrag] = useState(false)
  const [phase, setPhase] = useState<'idle' | 'up' | 'done'>('idle')
  const [fileName, setFileName] = useState('')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const xuLy = async (files: File[]) => {
    if (!files.length) return
    const first = files[0]
    setFileName(files.length > 1 ? `${first.name} (+${files.length - 1})` : first.name)
    setPhase('up')
    setProgress(0.28)
    const tickTimer = window.setInterval(() => {
      setProgress((p) => (p < 0.86 ? Math.min(0.86, p + 0.14) : p))
    }, 120)

    try {
      await onChonFile(files)
      if (!mountedRef.current) return
      setProgress(1)
      setPhase('done')
      window.setTimeout(() => {
        if (mountedRef.current) {
          setPhase('idle')
          setProgress(0)
        }
      }, 600)
    } catch {
      if (mountedRef.current) {
        setPhase('idle')
        setProgress(0)
      }
    } finally {
      window.clearInterval(tickTimer)
    }
  }

  const ext = (/\.([a-z0-9]+)$/i.exec(fileName)?.[1] ?? 'file').toLowerCase()
  const extColor = EXT_COLOR[ext] ?? '#7A6E74'
  const offset = (289 * (1 - progress)).toFixed(1)

  return (
    <div
      className={[
        'ux',
        'u432',
        compact ? 'is-compact' : '',
        drag ? 'is-drag' : '',
        phase !== 'idle' ? 'is-up' : '',
        phase === 'done' ? 'is-done' : '',
      ].filter(Boolean).join(' ')}
    >
      <div
        className="u432-dz"
        tabIndex={0}
        role="button"
        aria-label={ariaLabel}
        onClick={(e) => {
          if (e.target !== inputRef.current) inputRef.current?.click()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragEnter={(e) => {
          e.preventDefault()
          depthRef.current += 1
          setDrag(true)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy'
        }}
        onDragLeave={() => {
          depthRef.current = Math.max(0, depthRef.current - 1)
          if (!depthRef.current) setDrag(false)
        }}
        onDrop={(e) => {
          e.preventDefault()
          depthRef.current = 0
          setDrag(false)
          const list = e.dataTransfer?.files ? Array.from(e.dataTransfer.files) : []
          xuLy(list)
        }}
      >
        <div className="u432-idle">
          <span className="u432-ar" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 16V5M7 9.5 12 4.5l5 5" />
              <path d="M5 15v2.5A2.5 2.5 0 0 0 7.5 20h9a2.5 2.5 0 0 0 2.5-2.5V15" />
            </svg>
          </span>
          <div>
            <b>{title}</b>
            <b aria-hidden="true">Thả ra để tải lên</b>
            <small>
              hoặc <span className="u432-br">{browseLabel}</span>
              {subtitle ? ` · ${subtitle}` : ''}
            </small>
          </div>
        </div>

        <div className="u432-up" aria-hidden="true">
          <div className="u432-st">
            <svg className="u432-ring" viewBox="0 0 100 100">
              <circle className="tk" cx="50" cy="50" r="46" />
              <circle className="pg" cx="50" cy="50" r="46" style={{ strokeDashoffset: offset }} />
            </svg>
            <svg className="u432-doc" viewBox="0 0 50 62">
              <path className="pp" d="M6 1h26l15 15v39a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6V7a6 6 0 0 1 6-6z" />
              <path className="fd" d="M32 1v10a5 5 0 0 0 5 5h10z" />
              <rect className="ln" x="9" y="22" width="24" height="3" rx="1.5" />
              <rect className="ln" x="9" y="29" width="30" height="3" rx="1.5" />
              <rect className="tg" x="-4" y="40" width="32" height="14" rx="3.5" style={{ ['--c' as string]: extColor }} />
              <text x="12" y="50" textAnchor="middle">{ext.slice(0, 4).toUpperCase()}</text>
            </svg>
            <span className="u432-ok">
              <svg viewBox="0 0 24 24">
                <path d="m5 12.5 4.5 4.5L19 7.5" />
              </svg>
            </span>
          </div>
          <p className="u432-nm">{fileName}</p>
        </div>

        <input
          ref={inputRef}
          className="u432-file"
          type="file"
          accept={accept}
          multiple={multiple}
          tabIndex={-1}
          aria-hidden="true"
          onChange={(e) => {
            const list = e.target.files ? Array.from(e.target.files) : []
            xuLy(list)
            e.target.value = ''
          }}
        />
      </div>
    </div>
  )
}
