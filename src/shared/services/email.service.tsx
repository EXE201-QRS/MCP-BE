import React from 'react'
import envConfig from '@/config/env.config'
import { Injectable } from '@nestjs/common'
import OTPEmail from 'emails/otp'

import { Resend } from 'resend'
import { PaymentEmail } from 'emails/PaymentEmail'

@Injectable()
export class EmailService {
  private resend: Resend
  constructor() {
    this.resend = new Resend(envConfig.RESEND_API_KEY)
  }
  async sendOTP(payload: { email: string; code: string }) {
    const subject = 'Mã OTP'
    return this.resend.emails.send({
      from: 'Scanorderly <no-reply@scanorderly.com>',
      to: [payload.email],
      subject,
      react: <OTPEmail otpCode={payload.code} title={subject} />
    })
  }
  async sendPayment(payload: { email: string; servicePlanName: string, amount: number, description: string, statusPayment: string,  buttonText?: string }) {
    const subject = 'Thanh toán dịch vụ Scanorderly'

    return this.resend.emails.send({
      from: 'Scanorderly <no-reply@scanorderly.com>',
      to: [payload.email],
      subject,
      react: <PaymentEmail title={payload.servicePlanName}
      price={payload.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
      description={payload.description}
      status={payload.statusPayment}
      buttonText = {payload.buttonText}
      buttonUrl='https://scanorderly.com/login'
      />
    })
  }
}
