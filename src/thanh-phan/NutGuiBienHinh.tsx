/** Nút gửi form thu tròn thành vòng xoay và dấu tích hoàn tất (#403). */
export default function NutGuiBienHinh({
  label,
  state = 'idle',
  disabled = false,
  onClick,
  type = 'submit',
}: {
  label: string
  state?: 'idle' | 'busy' | 'ok'
  disabled?: boolean
  onClick?: () => void
  type?: 'submit' | 'button'
}) {
  return (
    <button
      type={type}
      className={`u403-go ${state === 'busy' ? 'is-busy' : state === 'ok' ? 'is-ok' : ''}`.trim()}
      aria-label={label}
      aria-busy={state === 'busy' ? true : undefined}
      disabled={disabled || state === 'busy'}
      onClick={onClick}
    >
      <span>{label}</span>
      <i aria-hidden="true" />
      <svg viewBox="0 0 22 22" aria-hidden="true">
        <path d="M5.5 11.5l4 4L17 7.5" />
      </svg>
    </button>
  )
}
