import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Column
} from '@react-email/components'
import React from 'react'

interface PaymentSuccessEmailProps {
  customerName?: string
  servicePlan: string
  amount: string
  duration?: string
  restaurantName?: string
  orderCode?: string
  transactionId?: string
  paidAt?: string
  nextBillingDate?: string
  qosUrl?: string
  supportUrl?: string
}

export const PaymentSuccessEmail = ({
  customerName = 'Quý khách',
  servicePlan,
  amount,
  duration = 'tháng',
  restaurantName,
  orderCode,
  transactionId,
  paidAt,
  nextBillingDate,
  qosUrl = '#',
  supportUrl = 'mailto:support@qos.com'
}: PaymentSuccessEmailProps) => (
  <Html>
    <Head />
    <Preview>
      ✅ Thanh toán thành công! Tài khoản QOS của bạn đã được kích hoạt
    </Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Row>
            <Column>
              <Img
                src="https://via.placeholder.com/150x50/6366f1/ffffff?text=QOS+Logo"
                width="150"
                height="50"
                alt="QOS Logo"
                style={logo}
              />
            </Column>
          </Row>
        </Section>

        {/* Success Hero */}
        <Section style={successHero}>
          <div style={successIcon}>✅</div>
          <Heading style={successTitle}>
            Thanh toán thành công!
          </Heading>
          <Text style={successText}>
            Cảm ơn bạn đã tin tướng và sử dụng dịch vụ QOS. Tài khoản của bạn đã được kích hoạt và sẵn sàng sử dụng.
          </Text>
        </Section>

        {/* Payment Details */}
        <Section style={detailsSection}>
          <Heading style={sectionTitle}>📋 Chi tiết thanh toán</Heading>
          
          <div style={detailsCard}>
            <Row>
              <Column style={detailLabel}>
                <Text style={labelText}>Gói dịch vụ:</Text>
              </Column>
              <Column style={detailValue}>
                <Text style={valueText}>{servicePlan}</Text>
              </Column>
            </Row>
            
            <Row>
              <Column style={detailLabel}>
                <Text style={labelText}>Số tiền:</Text>
              </Column>
              <Column style={detailValue}>
                <Text style={priceText}>{amount}</Text>
              </Column>
            </Row>

            {restaurantName && (
              <Row>
                <Column style={detailLabel}>
                  <Text style={labelText}>Nhà hàng:</Text>
                </Column>
                <Column style={detailValue}>
                  <Text style={valueText}>{restaurantName}</Text>
                </Column>
              </Row>
            )}

            {orderCode && (
              <Row>
                <Column style={detailLabel}>
                  <Text style={labelText}>Mã đơn hàng:</Text>
                </Column>
                <Column style={detailValue}>
                  <Text style={codeText}>#{orderCode}</Text>
                </Column>
              </Row>
            )}

            {transactionId && (
              <Row>
                <Column style={detailLabel}>
                  <Text style={labelText}>Mã giao dịch:</Text>
                </Column>
                <Column style={detailValue}>
                  <Text style={codeText}>{transactionId}</Text>
                </Column>
              </Row>
            )}

            {paidAt && (
              <Row>
                <Column style={detailLabel}>
                  <Text style={labelText}>Thời gian:</Text>
                </Column>
                <Column style={detailValue}>
                  <Text style={valueText}>{paidAt}</Text>
                </Column>
              </Row>
            )}

            {nextBillingDate && (
              <Row>
                <Column style={detailLabel}>
                  <Text style={labelText}>Gia hạn tiếp theo:</Text>
                </Column>
                <Column style={detailValue}>
                  <Text style={valueText}>{nextBillingDate}</Text>
                </Column>
              </Row>
            )}
          </div>
        </Section>

        {/* Next Steps */}
        <Section style={stepsSection}>
          <Heading style={sectionTitle}>🚀 Bước tiếp theo</Heading>
          
          <div style={stepCard}>
            <div style={stepNumber}>1</div>
            <div style={stepContent}>
              <Text style={stepTitle}>Truy cập hệ thống QOS</Text>
              <Text style={stepDesc}>
                Sử dụng thông tin đăng nhập để truy cập vào hệ thống quản lý nhà hàng của bạn
              </Text>
              <Button style={primaryButton} href={qosUrl}>
                Truy cập QOS →
              </Button>
            </div>
          </div>

          <div style={stepCard}>
            <div style={stepNumber}>2</div>
            <div style={stepContent}>
              <Text style={stepTitle}>Thiết lập nhà hàng</Text>
              <Text style={stepDesc}>
                Cấu hình thông tin nhà hàng, menu và bàn ăn để bắt đầu nhận đơn hàng
              </Text>
            </div>
          </div>

          <div style={stepCard}>
            <div style={stepNumber}>3</div>
            <div style={stepContent}>
              <Text style={stepTitle}>In QR code cho bàn</Text>
              <Text style={stepDesc}>
                Tạo và in QR code cho từng bàn để khách hàng có thể đặt món trực tiếp
              </Text>
            </div>
          </div>
        </Section>

        {/* Features Grid */}
        <Section style={featuresSection}>
          <Heading style={sectionTitle}>✨ Tính năng đã kích hoạt</Heading>
          
          <Row>
            <Column style={featureCol}>
              <div style={featureIcon}>📱</div>
              <Text style={featureTitle}>QR Menu</Text>
              <Text style={featureDesc}>Khách đặt món qua QR code</Text>
            </Column>
            <Column style={featureCol}>
              <div style={featureIcon}>👥</div>
              <Text style={featureTitle}>Quản lý nhân viên</Text>
              <Text style={featureDesc}>Phân quyền và theo dõi</Text>
            </Column>
          </Row>

          <Row>
            <Column style={featureCol}>
              <div style={featureIcon}>📊</div>
              <Text style={featureTitle}>Báo cáo</Text>
              <Text style={featureDesc}>Thống kê doanh thu chi tiết</Text>
            </Column>
            <Column style={featureCol}>
              <div style={featureIcon}>💳</div>
              <Text style={featureTitle}>Thanh toán online</Text>
              <Text style={featureDesc}>Tích hợp đa dạng phương thức</Text>
            </Column>
          </Row>
        </Section>

        <Hr style={divider} />

        {/* Support Section */}
        <Section style={supportSection}>
          <Row>
            <Column style={supportIconCol}>
              <Text style={supportEmoji}>💬</Text>
            </Column>
            <Column style={supportContent}>
              <Text style={supportTitle}>Cần hỗ trợ setup?</Text>
              <Text style={supportText}>
                Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn thiết lập hệ thống một cách nhanh chóng và hiệu quả.
              </Text>
              <Button style={secondaryButton} href={supportUrl}>
                Liên hệ hỗ trợ
              </Button>
            </Column>
          </Row>
        </Section>

        <Hr style={divider} />

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            Email này được gửi đến bạn vì bạn đã thanh toán thành công dịch vụ QOS.
          </Text>
          <Text style={footerText}>
            Nếu bạn có bất kỳ câu hỏi nào, vui lòng{' '}
            <Link href={supportUrl} style={footerLink}>
              liên hệ với chúng tôi
            </Link>
          </Text>
          <Text style={footerCopyright}>
            © 2024 QOS Management System. Made with ❤️ in Vietnam.
          </Text>
          
          <div style={socialLinks}>
            <Link href="#" style={socialLink}>Facebook</Link>
            <Text style={socialDivider}>•</Text>
            <Link href="#" style={socialLink}>LinkedIn</Link>
            <Text style={socialDivider}>•</Text>
            <Link href="#" style={socialLink}>Website</Link>
          </div>
        </Section>
      </Container>
    </Body>
  </Html>
)

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px'
}

const header = {
  padding: '20px 30px',
  textAlign: 'center' as const
}

const logo = {
  margin: '0 auto'
}

const successHero = {
  padding: '40px 30px',
  textAlign: 'center' as const,
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  borderRadius: '16px',
  margin: '0 20px'
}

const successIcon = {
  fontSize: '64px',
  marginBottom: '16px'
}

const successTitle = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: '800',
  margin: '0 0 16px 0',
  lineHeight: '1.2'
}

const successText = {
  color: '#ffffff',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0',
  opacity: 0.95
}

const detailsSection = {
  padding: '30px'
}

const sectionTitle = {
  color: '#1e293b',
  fontSize: '20px',
  fontWeight: '700',
  margin: '0 0 20px 0'
}

const detailsCard = {
  backgroundColor: '#f8fafc',
  padding: '24px',
  borderRadius: '12px',
  border: '1px solid #e2e8f0'
}

const detailLabel = {
  width: '140px'
}

const detailValue = {
  width: 'auto'
}

const labelText = {
  color: '#64748b',
  fontSize: '14px',
  fontWeight: '500',
  margin: '12px 0'
}

const valueText = {
  color: '#1e293b',
  fontSize: '14px',
  fontWeight: '600',
  margin: '12px 0'
}

const priceText = {
  color: '#10b981',
  fontSize: '16px',
  fontWeight: '700',
  margin: '12px 0'
}

const codeText = {
  color: '#6366f1',
  fontSize: '14px',
  fontWeight: '600',
  fontFamily: 'Monaco, Consolas, monospace',
  margin: '12px 0'
}

const stepsSection = {
  padding: '30px'
}

const stepCard = {
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: '24px',
  padding: '20px',
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '12px'
}

const stepNumber = {
  backgroundColor: '#6366f1',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '700',
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '16px',
  flexShrink: 0
}

const stepContent = {
  flex: 1
}

const stepTitle = {
  color: '#1e293b',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 8px 0'
}

const stepDesc = {
  color: '#64748b',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0 0 16px 0'
}

const primaryButton = {
  backgroundColor: '#6366f1',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px'
}

const featuresSection = {
  padding: '30px',
  backgroundColor: '#f8fafc',
  margin: '0 20px',
  borderRadius: '12px'
}

const featureCol = {
  textAlign: 'center' as const,
  padding: '16px',
  width: '50%'
}

const featureIcon = {
  fontSize: '32px',
  marginBottom: '8px'
}

const featureTitle = {
  color: '#1e293b',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 4px 0'
}

const featureDesc = {
  color: '#64748b',
  fontSize: '12px',
  margin: '0',
  lineHeight: '1.4'
}

const divider = {
  borderColor: '#e2e8f0',
  margin: '30px 20px'
}

const supportSection = {
  padding: '24px 30px',
  backgroundColor: '#f1f5f9',
  margin: '0 20px',
  borderRadius: '12px'
}

const supportIconCol = {
  width: '60px',
  textAlign: 'center' as const
}

const supportContent = {
  width: 'auto'
}

const supportEmoji = {
  fontSize: '40px',
  margin: '0'
}

const supportTitle = {
  color: '#1e293b',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 8px 0'
}

const supportText = {
  color: '#64748b',
  fontSize: '14px',
  margin: '0 0 16px 0',
  lineHeight: '1.5'
}

const secondaryButton = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  color: '#6366f1',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  border: '1px solid #6366f1'
}

const footer = {
  padding: '20px 30px',
  textAlign: 'center' as const
}

const footerText = {
  color: '#64748b',
  fontSize: '13px',
  lineHeight: '1.5',
  margin: '0 0 12px 0'
}

const footerLink = {
  color: '#6366f1',
  textDecoration: 'none'
}

const footerCopyright = {
  color: '#94a3b8',
  fontSize: '12px',
  margin: '0 0 16px 0'
}

const socialLinks = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px'
}

const socialLink = {
  color: '#6366f1',
  textDecoration: 'none',
  fontSize: '12px',
  fontWeight: '500'
}

const socialDivider = {
  color: '#cbd5e1',
  fontSize: '12px',
  margin: '0'
}

export default PaymentSuccessEmail