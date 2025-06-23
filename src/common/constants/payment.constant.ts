export const PAYMENT_METHOD = {
  BANK_TRANSFER: 'BANK_TRANSFER'
} as const
// Payment status constants
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
  REFUNDED: 'REFUNDED'
} as const
export const PAYOS_CONFIG = {
  PAYMENT_LINK_EXPIRES_IN: 15 * 60, // 15 minutes in seconds
  WEBHOOK_TOLERANCE: 300, // 5 minutes tolerance for webhook verification
  MAX_RETRY_COUNT: 3,
  RETRY_DELAY: 5000 // 5 seconds
} as const

export type PaymentMethod = (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD]
export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS]
