import { useEffect, useRef, useState } from 'react'
import { App, Button } from 'antd'
import { CheckOutlined, CopyOutlined } from '@ant-design/icons'
import { MAU } from '../giao-dien'

/** Nút sao chép nội dung có phản hồi tích xanh ngay trên nút. */
export default function NutSaoChep({
  text,
  label = 'Sao chép',
  size = 'middle',
  type = 'default',
  successMessage = 'Đã sao chép, dán vào Zalo',
  errorMessage = 'Không sao chép được, hãy chép tay',
}: {
  text: string
  label?: string
  size?: 'small' | 'middle' | 'large'
  type?: 'default' | 'primary'
  successMessage?: string
  errorMessage?: string
}) {
  const { message } = App.useApp()
  const [daChep, setDaChep] = useState(false)
  const timerRef = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  const saoChep = () => {
    navigator.clipboard.writeText(text)
      .then(() => {
        message.success(successMessage)
        setDaChep(true)
        window.clearTimeout(timerRef.current)
        timerRef.current = window.setTimeout(() => setDaChep(false), 1600)
      })
      .catch(() => message.error(errorMessage))
  }

  return (
    <Button
      size={size}
      type={type}
      icon={daChep ? <CheckOutlined /> : <CopyOutlined />}
      onClick={saoChep}
      style={daChep && type !== 'primary' ? { borderColor: MAU.tot, color: MAU.tot } : undefined}
    >
      {daChep ? 'Đã chép' : label}
    </Button>
  )
}
