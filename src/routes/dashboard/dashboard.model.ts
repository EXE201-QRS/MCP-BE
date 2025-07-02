import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

// ===== QUERY PARAMS SCHEMAS =====
export const DashboardQuerySchema = z.object({
  period: z.enum(['7d', '30d', '90d', '1y', 'custom']).default('30d'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  timeZone: z.string().default('Asia/Ho_Chi_Minh')
})

export const RevenueChartQuerySchema = z.object({
  period: z.enum(['7d', '30d', '90d', '1y', 'custom']).default('30d'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  granularity: z.enum(['hour', 'day', 'week', 'month']).default('day'),
  timeZone: z.string().default('Asia/Ho_Chi_Minh')
})

export const ServicePlanRevenueQuerySchema = z.object({
  period: z.enum(['7d', '30d', '90d', '1y', 'custom']).default('30d'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  timeZone: z.string().default('Asia/Ho_Chi_Minh')
})

// ===== DTOs =====
export class DashboardQueryDto extends createZodDto(DashboardQuerySchema) {}
export class RevenueChartQueryDto extends createZodDto(RevenueChartQuerySchema) {}
export class ServicePlanRevenueQueryDto extends createZodDto(
  ServicePlanRevenueQuerySchema
) {}

// ===== RESPONSE TYPES =====
export interface DashboardOverview {
  totalRevenue: number
  revenueGrowth: number // % so với period trước
  totalOrders: number
  ordersGrowth: number
  totalCustomers: number
  customersGrowth: number
  totalActiveInstances: number
  instancesGrowth: number
  averageOrderValue: number
  aovGrowth: number
  conversionRate: number
  conversionGrowth: number
}

export interface RevenueChartData {
  date: string
  revenue: number
  orders: number
  cumulativeRevenue: number
}

export interface ServicePlanRevenue {
  servicePlanId: number
  servicePlanName: string
  revenue: number
  orders: number
  percentage: number
  growth: number
}

export interface PaymentMethodStats {
  method: string
  revenue: number
  orders: number
  percentage: number
}

export interface CustomerSegment {
  segment: string
  count: number
  revenue: number
  averageValue: number
  percentage: number
}

export interface GeographicRevenue {
  region: string
  revenue: number
  orders: number
  percentage: number
}

export interface RevenueAnalytics {
  overview: DashboardOverview
  revenueChart: RevenueChartData[]
  servicePlansRevenue: ServicePlanRevenue[]
  paymentMethodStats: PaymentMethodStats[]
  customerSegments: CustomerSegment[]
  geographicRevenue: GeographicRevenue[]
  topCustomers: {
    userId: number
    userName: string
    email: string
    totalRevenue: number
    totalOrders: number
    lastOrderDate: string
  }[]
  recentTransactions: {
    paymentId: number
    customerName: string
    servicePlanName: string
    amount: number
    status: string
    paidAt: string
  }[]
}

// ===== ENUMS FOR REVENUE ANALYSIS =====
export enum RevenuePeriod {
  SEVEN_DAYS = '7d',
  THIRTY_DAYS = '30d',
  NINETY_DAYS = '90d',
  ONE_YEAR = '1y',
  CUSTOM = 'custom'
}

export enum RevenueGranularity {
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month'
}
