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

const defaultFeatures = [
  'Quản lý bàn và QR code không giới hạn',
  'Hệ thống nhân viên và phân quyền',
  'Dashboard thống kê chi tiết',
  'Thanh toán online tích hợp',
  'Hỗ trợ email marketing',
  'Backup dữ liệu tự động',
  'Hỗ trợ 24/7'
]

interface PaymentEmailProps {
  customerName?: string
  title: string
  price: string
  duration?: string
  description?: string
  features?: string[]
  buttonText?: string
  buttonUrl?: string
  restaurantName?: string
  orderCode?: string
  paymentMethod?: string
  statusPayment?: string
}

export const PaymentEmail = ({
  customerName = 'Quý khách',
  title,
  price,
  duration = 'tháng',
  description,
  features = defaultFeatures,
  buttonText = 'Thanh toán dịch vụ Scanorderly',
  buttonUrl = '#',
  restaurantName,
  orderCode,
  paymentMethod = 'Chuyển khoản ngân hàng',
  statusPayment = 'Chờ thanh toán'
}: PaymentEmailProps) => (
  <Html>
    <Head />
    <Preview>
      {statusPayment === 'Đã thanh toán' 
        ? `✅ Thanh toán thành công gói ${title} - Scanorderly`
        : `Hóa đơn thanh toán gói ${title} - Scanorderly`
      }
    </Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Row>
            <Column>
              <Img
                src="https://via.placeholder.com/150x50/6366f1/ffffff?text=Scanorderly"
                width="150"
                height="50"
                alt="Scanorderly Logo"
                style={logo}
              />
            </Column>
          </Row>
        </Section>

        {/* Hero Section */}
        <Section style={statusPayment === 'Đã thanh toán' ? successHeroSection : heroSection}>
          <div style={statusIcon}>
            {statusPayment === 'Đã thanh toán' ? '✅' : '🎉'}
          </div>
          <Heading style={heroTitle}>
            {statusPayment === 'Đã thanh toán' 
              ? 'Thanh toán thành công!'
              : 'Cảm ơn bạn đã chọn Scanorderly!'
            }
          </Heading>
          <Text style={heroText}>
            {statusPayment === 'Đã thanh toán' 
              ? `Gói dịch vụ ${title} đã được kích hoạt thành công. Bạn có thể bắt đầu sử dụng ngay bây giờ.`
              : `Hóa đơn thanh toán cho gói dịch vụ ${title} của bạn đã sẵn sàng.`
            }
          </Text>
        </Section>

        {/* Payment Status Banner */}
        <Section style={statusBanner}>
          <div style={statusPayment === 'Đã thanh toán' ? statusPaidBadge : statusPendingBadge}>
            {statusPayment === 'Đã thanh toán' ? '✅ ĐÃ THANH TOÁN' : '⏳ CHỜ THANH TOÁN'}
          </div>
        </Section>

        {/* Customer Info */}
        <Section style={infoSection}>
          <Heading style={sectionTitle}>📋 Thông tin thanh toán</Heading>
          <div style={infoCard}>
            <Row>
              <Column style={infoLabel}>
                <Text style={labelText}>Khách hàng:</Text>
              </Column>
              <Column style={infoValue}>
                <Text style={valueText}>{customerName}</Text>
              </Column>
            </Row>
            {restaurantName && (
              <Row>
                <Column style={infoLabel}>
                  <Text style={labelText}>Nhà hàng:</Text>
                </Column>
                <Column style={infoValue}>
                  <Text style={valueText}>{restaurantName}</Text>
                </Column>
              </Row>
            )}
            {orderCode && (
              <Row>
                <Column style={infoLabel}>
                  <Text style={labelText}>Mã đơn hàng:</Text>
                </Column>
                <Column style={infoValue}>
                  <Text style={codeText}>#{orderCode}</Text>
                </Column>
              </Row>
            )}
            <Row>
              <Column style={infoLabel}>
                <Text style={labelText}>Phương thức:</Text>
              </Column>
              <Column style={infoValue}>
                <Text style={valueText}>{paymentMethod}</Text>
              </Column>
            </Row>
            <Row>
              <Column style={infoLabel}>
                <Text style={labelText}>Trạng thái:</Text>
              </Column>
              <Column style={infoValue}>
                <Text style={statusPayment === 'Đã thanh toán' ? paidStatusText : pendingStatusText}>
                  {statusPayment}
                </Text>
              </Column>
            </Row>
          </div>
        </Section>

        {/* Service Package Card */}
        <Section style={packageCard}>
          <div style={packageHeader}>
            <Text style={packageTitle}>{title}</Text>
            <div style={packageBadge}>PHỔ BIẾN</div>
          </div>
          
          <div style={priceSection}>
            <Text style={priceAmount}>{price}</Text>
            <Text style={pricePeriod}>/{duration}</Text>
          </div>
          
          {description && (
            <Text style={packageDescription}>{description}</Text>
          )}

          {/* Features List */}
          <div style={featuresContainer}>
            <Text style={featuresTitle}>✨ Tính năng bao gồm:</Text>
            {features.map((feature, index) => (
              <div key={index} style={featureItem}>
                <span style={checkIcon}>✅</span>
                <Text style={featureText}>{feature}</Text>
              </div>
            ))}
          </div>

          {/* CTA Button - Only show if not paid */}
          {statusPayment !== 'Đã thanh toán' && (
            <Button style={ctaButton} href={buttonUrl}>
              {buttonText}
            </Button>
          )}

          {/* Success Message for paid */}
          {statusPayment === 'Đã thanh toán' && (
            <div style={successMessage}>
              <Text style={successMessageText}>
                🎊 Gói dịch vụ đã được kích hoạt thành công! Bạn có thể đăng nhập vào hệ thống để bắt đầu sử dụng.
              </Text>
            </div>
          )}
        </Section>

        {/* Next Steps (for paid status) */}
        {statusPayment === 'Đã thanh toán' && (
          <Section style={nextStepsSection}>
            <Heading style={sectionTitle}>🚀 Bước tiếp theo</Heading>
            
            <div style={stepCard}>
              <div style={stepNumber}>1</div>
              <div style={stepContent}>
                <Text style={stepTitle}>Đăng nhập hệ thống</Text>
                <Text style={stepDesc}>
                  Sử dụng thông tin tài khoản để truy cập vào Scanorderly và bắt đầu thiết lập nhà hàng
                </Text>
              </div>
            </div>

            <div style={stepCard}>
              <div style={stepNumber}>2</div>
              <div style={stepContent}>
                <Text style={stepTitle}>Cấu hình menu & bàn</Text>
                <Text style={stepDesc}>
                  Tạo menu điện tử và thiết lập bàn ăn để khách hàng có thể đặt món qua QR code
                </Text>
              </div>
            </div>

            <div style={stepCard}>
              <div style={stepNumber}>3</div>
              <div style={stepContent}>
                <Text style={stepTitle}>In QR code</Text>
                <Text style={stepDesc}>
                  Tải và in QR code cho từng bàn để bắt đầu nhận đơn hàng từ khách hàng
                </Text>
              </div>
            </div>
          </Section>
        )}

        {/* Benefits Section */}
        <Section style={benefitsSection}>
          <Heading style={benefitsTitle}>
            🚀 Tại sao chọn Scanorderly?
          </Heading>
          <Row>
            <Column style={benefitItem}>
              <Text style={benefitIcon}>⚡</Text>
              <Text style={benefitTitle}>Setup nhanh</Text>
              <Text style={benefitDesc}>Triển khai trong 24h</Text>
            </Column>
            <Column style={benefitItem}>
              <Text style={benefitIcon}>📱</Text>
              <Text style={benefitTitle}>Dễ sử dụng</Text>
              <Text style={benefitDesc}>Giao diện thân thiện</Text>
            </Column>
            <Column style={benefitItem}>
              <Text style={benefitIcon}>🛡️</Text>
              <Text style={benefitTitle}>Bảo mật cao</Text>
              <Text style={benefitDesc}>Dữ liệu được bảo vệ</Text>
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
              <Text style={supportTitle}>Cần hỗ trợ?</Text>
              <Text style={supportText}>
                Đội ngũ hỗ trợ 24/7 của chúng tôi luôn sẵn sàng giúp bạn thiết lập và sử dụng hệ thống!
              </Text>
              <Row>
                <Column>
                  <Link href="mailto:support@scanorderly.com" style={supportLink}>
                    📧 support@scanorderly.com
                  </Link>
                </Column>
                <Column>
                  <Link href="tel:+84123456789" style={supportLink}>
                    📞 +84 123 456 789
                  </Link>
                </Column>
              </Row>
            </Column>
          </Row>
        </Section>

        <Hr style={divider} />

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            {statusPayment === 'Đã thanh toán' 
              ? 'Email này được gửi để xác nhận thanh toán thành công của bạn.'
              : 'Nếu bạn không thực hiện giao dịch này, vui lòng bỏ qua email hoặc'
            }
            {statusPayment !== 'Đã thanh toán' && (
              <Link href="mailto:support@scanorderly.com" style={footerLink}>
                {' liên hệ hỗ trợ'}
              </Link>
            )}
          </Text>
          <Text style={footerCopyright}>
            © 2024 Scanorderly. Made with ❤️ in Vietnam.
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

const heroSection = {
  padding: '30px 30px 20px',
  textAlign: 'center' as const,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '12px',
  margin: '0 20px'
}

const successHeroSection = {
  padding: '30px 30px 20px',
  textAlign: 'center' as const,
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  borderRadius: '12px',
  margin: '0 20px'
}

const statusIcon = {
  fontSize: '48px',
  marginBottom: '16px'
}

const heroTitle = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0 0 16px 0',
  lineHeight: '1.3'
}

const heroText = {
  color: '#ffffff',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '0',
  opacity: 0.95
}

const statusBanner = {
  padding: '20px',
  textAlign: 'center' as const
}

const statusPaidBadge = {
  background: 'linear-gradient(45deg, #10b981, #059669)',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '700',
  padding: '12px 24px',
  borderRadius: '25px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  display: 'inline-block',
  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
}

const statusPendingBadge = {
  background: 'linear-gradient(45deg, #f59e0b, #d97706)',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '700',
  padding: '12px 24px',
  borderRadius: '25px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  display: 'inline-block',
  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
}

const infoSection = {
  padding: '30px'
}

const sectionTitle = {
  color: '#1e293b',
  fontSize: '20px',
  fontWeight: '700',
  margin: '0 0 20px 0'
}

const infoCard = {
  backgroundColor: '#f8fafc',
  padding: '24px',
  borderRadius: '12px',
  border: '1px solid #e2e8f0'
}

const infoLabel = {
  width: '120px'
}

const infoValue = {
  width: 'auto'
}

const labelText = {
  color: '#64748b',
  fontSize: '14px',
  fontWeight: '500',
  margin: '10px 0'
}

const valueText = {
  color: '#1e293b',
  fontSize: '14px',
  fontWeight: '600',
  margin: '10px 0'
}

const codeText = {
  color: '#6366f1',
  fontSize: '14px',
  fontWeight: '600',
  fontFamily: 'Monaco, Consolas, monospace',
  margin: '10px 0'
}

const paidStatusText = {
  color: '#10b981',
  fontSize: '14px',
  fontWeight: '700',
  margin: '10px 0'
}

const pendingStatusText = {
  color: '#f59e0b',
  fontSize: '14px',
  fontWeight: '700',
  margin: '10px 0'
}

const packageCard = {
  margin: '20px',
  padding: '30px',
  border: '2px solid #6366f1',
  borderRadius: '16px',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
}

const packageHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px'
}

const packageTitle = {
  color: '#1e293b',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0'
}

const packageBadge = {
  background: 'linear-gradient(45deg, #ff6b6b, #ffa726)',
  color: '#ffffff',
  fontSize: '11px',
  fontWeight: '700',
  padding: '4px 8px',
  borderRadius: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px'
}

const priceSection = {
  display: 'flex',
  alignItems: 'baseline',
  marginBottom: '20px'
}

const priceAmount = {
  color: '#6366f1',
  fontSize: '48px',
  fontWeight: '800',
  margin: '0 8px 0 0',
  lineHeight: '1'
}

const pricePeriod = {
  color: '#64748b',
  fontSize: '18px',
  fontWeight: '500',
  margin: '0'
}

const packageDescription = {
  color: '#64748b',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 24px 0'
}

const featuresContainer = {
  marginBottom: '32px'
}

const featuresTitle = {
  color: '#1e293b',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 16px 0'
}

const featureItem = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '12px'
}

const checkIcon = {
  marginRight: '12px',
  fontSize: '16px'
}

const featureText = {
  color: '#475569',
  fontSize: '15px',
  margin: '0',
  lineHeight: '1.5'
}

const ctaButton = {
  backgroundColor: '#6366f1',
  borderRadius: '12px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '700',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '16px 32px',
  width: '100%',
  boxSizing: 'border-box' as const,
  border: 'none',
  cursor: 'pointer'
}

const successMessage = {
  backgroundColor: '#f0fdf4',
  border: '1px solid #bbf7d0',
  borderRadius: '12px',
  padding: '20px',
  textAlign: 'center' as const
}

const successMessageText = {
  color: '#166534',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
  lineHeight: '1.5'
}

const nextStepsSection = {
  padding: '30px'
}

const stepCard = {
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: '20px',
  padding: '20px',
  backgroundColor: '#f8fafc',
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
  margin: '0'
}

const benefitsSection = {
  padding: '30px',
  textAlign: 'center' as const
}

const benefitsTitle = {
  color: '#1e293b',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0 0 30px 0'
}

const benefitItem = {
  textAlign: 'center' as const,
  padding: '0 15px'
}

const benefitIcon = {
  fontSize: '32px',
  margin: '0 0 8px 0'
}

const benefitTitle = {
  color: '#1e293b',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 4px 0'
}

const benefitDesc = {
  color: '#64748b',
  fontSize: '14px',
  margin: '0'
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
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 8px 0'
}

const supportText = {
  color: '#64748b',
  fontSize: '15px',
  margin: '0 0 20px 0'
}

const supportLink = {
  color: '#6366f1',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: '500'
}

const footer = {
  padding: '20px 30px',
  textAlign: 'center' as const
}

const footerText = {
  color: '#64748b',
  fontSize: '13px',
  lineHeight: '1.5',
  margin: '0 0 16px 0'
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

export default PaymentEmail