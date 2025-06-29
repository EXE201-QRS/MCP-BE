import React from 'react'
import { text } from 'stream/consumers'

const defaultFeatures = [
  'Mở khóa sử dụng bàn',
  'Mở khóa tính năng nhân viên',
  'Mở khóa tính năng dashboard',
  'Mở khóa thanh toán online',
  'Mở khóa tính năng email'
]

interface PaymentEmailProps {
  title: string
  price: string
  description?: string
  buttonText?: string
  buttonUrl?: string
  status: string // thêm prop trạng thái
}
function getStatusStyle(status: string) {

  if (status.toLowerCase() == 'đã thanh toán') {
    return statusStyle
  }
  if (status.toLowerCase() == 'hết hạn') {

    return {
      ...statusStyle,
      background: '#fee2e2',
      color: '#b91c1c'
    }
  }
  if (status.toLowerCase() == 'sắp hết hạn') {
    return {
      ...statusStyle,
      background: '#fef9c3',
      color: '#b45309'
    }
  }
  return statusStyle
}
export const PaymentEmail = (data: PaymentEmailProps) => (
  <div style={main}>
    <div style={container}>
      <div style={section}>
        <div style={headerRow}>
          <div style={offerTitle}>{data.title}</div>
          {data.status && (
            <div style={getStatusStyle(data.status)}>{data.status}</div>
          )}
        </div>
        <div style={priceBox}>
          <span style={priceStyle}>{data.price}</span>
          <span style={perMonth}>/ tháng</span>
        </div>
        <div style={desc}>{data.description}</div>
        <ul style={featureList}>
          {defaultFeatures.map((feature) => (
            <li key={feature} style={featureItem}>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <a
  href={data.buttonUrl || '#'}
  target="_blank"
  rel="noopener noreferrer"
  style={ctaButton}
>
  {data.buttonText || 'Xem ngay'}
</a>
        <hr style={hrStyle} />
        <div style={italicNote}>
          Nếu bạn không chủ động thực hiện hành động này, xin hãy bỏ qua email?
        </div>
        <div style={footerNote}>From Scanorderly with ❤️.</div>
      </div>
    </div>
  </div>
)

const main = {
  background: '#f4f4f6',
  minHeight: '100vh',
  padding: 24,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

const container = {
  background: '#fff',
  borderRadius: 12,
  maxWidth: 500,
  margin: '0 auto',
  padding: 24,
  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
  border: '1px solid #e5e7eb'
}

const section = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 12,
  color: '#4b5563',
  padding: 28,
  width: '100%',
  textAlign: 'left',
  marginBottom: 0
}

const offerTitle = {
  padding: '4px 8px',
  borderRadius: 8,
  background: '#d1fae5',
  color: '#6366f1',
  fontSize: 12,
  lineHeight: '20px',
  fontWeight: 700,
  letterSpacing: 1,
  marginBottom: 16,
  marginTop: 16,
  textTransform: 'uppercase'
}

const priceBox = {
  fontSize: 30,
  fontWeight: 700,
  lineHeight: '36px',
  marginBottom: 12,
  marginTop: 0
}

const priceStyle = {
  color: 'rgb(16,24,40)'
}

const perMonth = {
  fontSize: 16,
  fontWeight: 500,
  lineHeight: '20px',
  marginLeft: 4
}

const desc = {
  color: '#374151',
  fontSize: 14,
  lineHeight: '20px',
  marginTop: 16,
  marginBottom: 24
}

const featureList = {
  color: '#6b7280',
  fontSize: 14,
  lineHeight: '24px',
  marginBottom: 32,
  paddingLeft: 14
}

const featureItem = {
  marginBottom: 12,
  position: 'relative'
}

const ctaButton = {
  background: '#6366f1',
  borderRadius: 8,
  color: '#fff',
  display: 'inline-block',
  fontSize: 16,
  lineHeight: '24px',
  fontWeight: 700,
  letterSpacing: 1,
  marginBottom: 24,
  maxWidth: '100%',
  padding: 14,
  textAlign: 'center',
  width: '100%',
  border: 'none',
  cursor: 'pointer',
  textDecoration: 'none',
}

const hrStyle = {
  margin: '24px 0 6px 0',
  borderColor: '#e5e7eb'
}

const italicNote = {
  color: '#6b7280',
  fontSize: 12,
  lineHeight: '16px',
  fontStyle: 'italic',
  marginTop: 24,
  marginBottom: 6,
  textAlign: 'center'
}

const footerNote = {
  color: '#6b7280',
  fontSize: 12,
  margin: 0,
  lineHeight: '16px',
  textAlign: 'center'
}

const headerRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 16
}

const statusStyle = {
  background: '#d1fae5',
  borderRadius: 8,
  color: '#065f46',
  fontSize: 12,
  fontWeight: 500,
  padding: '4px 8px',
  textTransform: 'uppercase'
}
