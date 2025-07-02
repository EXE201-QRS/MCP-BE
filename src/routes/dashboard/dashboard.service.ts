import { Injectable } from '@nestjs/common'
import {
  DashboardOverview,
  DashboardQueryDto,
  RevenueAnalytics,
  RevenueChartQueryDto,
  RevenueGranularity,
  RevenuePeriod,
  ServicePlanRevenueQueryDto
} from './dashboard.model'
import { DashboardRepo } from './dashboard.repo'

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardRepo: DashboardRepo) {}

  // ===== MAIN DASHBOARD ANALYTICS =====
  async getDashboardAnalytics(query: DashboardQueryDto): Promise<RevenueAnalytics> {
    const { startDate, endDate } = this.calculateDateRange(
      query.period as RevenuePeriod,
      query.startDate,
      query.endDate,
      query.timeZone
    )

    // Parallel execution for better performance
    const [
      overview,
      revenueChart,
      servicePlansRevenue,
      paymentMethodStats,
      customerSegments,
      geographicRevenue,
      topCustomers,
      recentTransactions
    ] = await Promise.all([
      this.getDashboardOverview({
        ...query,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }),
      this.getRevenueChart({
        ...query,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        granularity: this.determineOptimalGranularity(query.period as RevenuePeriod)
      }),
      this.getServicePlanRevenue({
        ...query,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }),
      this.dashboardRepo.getPaymentMethodStats(startDate, endDate),
      this.dashboardRepo.getCustomerSegments(startDate, endDate),
      this.dashboardRepo.getGeographicRevenue(startDate, endDate),
      this.dashboardRepo.getTopCustomers(startDate, endDate, 10),
      this.dashboardRepo.getRecentTransactions(10)
    ])

    return {
      overview,
      revenueChart,
      servicePlansRevenue,
      paymentMethodStats,
      customerSegments,
      geographicRevenue,
      topCustomers,
      recentTransactions
    }
  }

  // ===== DASHBOARD OVERVIEW =====
  async getDashboardOverview(query: DashboardQueryDto): Promise<DashboardOverview> {
    const { startDate, endDate } = this.calculateDateRange(
      query.period as RevenuePeriod,
      query.startDate,
      query.endDate,
      query.timeZone
    )

    // Current period stats
    const [revenueStats, customerStats, uniqueCustomersCount, activeInstancesCount] =
      await Promise.all([
        this.dashboardRepo.getRevenueStats(startDate, endDate),
        this.dashboardRepo.getCustomerStats(startDate, endDate),
        this.dashboardRepo.getUniqueCustomersCount(startDate, endDate),
        this.dashboardRepo.getActiveInstancesCount(startDate, endDate)
      ])

    // Previous period stats for growth calculation
    const [previousRevenue, previousOrdersCount, previousCustomersCount] =
      await Promise.all([
        this.dashboardRepo.getPreviousPeriodRevenue(startDate, endDate),
        this.dashboardRepo.getPreviousPeriodOrdersCount(startDate, endDate),
        this.dashboardRepo.getPreviousPeriodCustomersCount(startDate, endDate)
      ])

    // Calculate metrics
    const totalRevenue = revenueStats._sum.amount || 0
    const totalOrders = revenueStats._count.id || 0
    const totalCustomers = uniqueCustomersCount
    const totalActiveInstances = activeInstancesCount

    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    const conversionRate = totalCustomers > 0 ? (totalOrders / totalCustomers) * 100 : 0

    // Calculate growth percentages
    const revenueGrowth = this.calculateGrowthPercentage(totalRevenue, previousRevenue)
    const ordersGrowth = this.calculateGrowthPercentage(totalOrders, previousOrdersCount)
    const customersGrowth = this.calculateGrowthPercentage(
      totalCustomers,
      previousCustomersCount
    )

    // For AOV and conversion rate growth, we need more complex calculations
    const previousAOV =
      previousOrdersCount > 0 ? previousRevenue / previousOrdersCount : 0
    const aovGrowth = this.calculateGrowthPercentage(averageOrderValue, previousAOV)

    const previousConversionRate =
      previousCustomersCount > 0
        ? (previousOrdersCount / previousCustomersCount) * 100
        : 0
    const conversionGrowth = this.calculateGrowthPercentage(
      conversionRate,
      previousConversionRate
    )

    return {
      totalRevenue,
      revenueGrowth,
      totalOrders,
      ordersGrowth,
      totalCustomers,
      customersGrowth,
      totalActiveInstances,
      instancesGrowth: 0, // Can be implemented later with historical data
      averageOrderValue,
      aovGrowth,
      conversionRate,
      conversionGrowth
    }
  }

  // ===== REVENUE CHART =====
  async getRevenueChart(query: RevenueChartQueryDto) {
    const { startDate, endDate } = this.calculateDateRange(
      query.period as RevenuePeriod,
      query.startDate,
      query.endDate,
      query.timeZone
    )

    const granularity =
      query.granularity || this.determineOptimalGranularity(query.period as RevenuePeriod)

    return await this.dashboardRepo.getRevenueChartData(startDate, endDate, granularity)
  }

  // ===== SERVICE PLAN REVENUE =====
  async getServicePlanRevenue(query: ServicePlanRevenueQueryDto) {
    const { startDate, endDate } = this.calculateDateRange(
      query.period as RevenuePeriod,
      query.startDate,
      query.endDate,
      query.timeZone
    )

    const servicePlansRevenue = await this.dashboardRepo.getServicePlanRevenue(
      startDate,
      endDate
    )

    // Calculate growth for each service plan (comparing with previous period)
    const periodDiff = endDate.getTime() - startDate.getTime()
    const previousStartDate = new Date(startDate.getTime() - periodDiff)
    const previousEndDate = new Date(endDate.getTime() - periodDiff)

    const previousPeriodData = await this.dashboardRepo.getServicePlanRevenue(
      previousStartDate,
      previousEndDate
    )

    return servicePlansRevenue.map((current) => {
      const previous = previousPeriodData.find(
        (p) => p.servicePlanId === current.servicePlanId
      )
      const growth = previous
        ? this.calculateGrowthPercentage(current.revenue, previous.revenue)
        : 0

      return {
        ...current,
        growth
      }
    })
  }

  // ===== UTILITY METHODS =====
  private calculateDateRange(
    period: RevenuePeriod,
    startDateString?: string,
    endDateString?: string,
    timeZone: string = 'Asia/Ho_Chi_Minh'
  ): { startDate: Date; endDate: Date } {
    const now = new Date()

    if (period === RevenuePeriod.CUSTOM && startDateString && endDateString) {
      return {
        startDate: new Date(startDateString),
        endDate: new Date(endDateString)
      }
    }

    let startDate: Date
    const endDate = new Date(now)

    switch (period) {
      case RevenuePeriod.SEVEN_DAYS:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case RevenuePeriod.THIRTY_DAYS:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case RevenuePeriod.NINETY_DAYS:
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case RevenuePeriod.ONE_YEAR:
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    return { startDate, endDate }
  }

  private determineOptimalGranularity(period: RevenuePeriod): RevenueGranularity {
    switch (period) {
      case RevenuePeriod.SEVEN_DAYS:
        return RevenueGranularity.DAY
      case RevenuePeriod.THIRTY_DAYS:
        return RevenueGranularity.DAY
      case RevenuePeriod.NINETY_DAYS:
        return RevenueGranularity.WEEK
      case RevenuePeriod.ONE_YEAR:
        return RevenueGranularity.MONTH
      default:
        return RevenueGranularity.DAY
    }
  }

  private calculateGrowthPercentage(current: number, previous: number): number {
    if (previous === 0) {
      return current > 0 ? 100 : 0
    }
    return ((current - previous) / previous) * 100
  }

  // ===== ADVANCED ANALYTICS METHODS =====

  /**
   * Get revenue forecast based on historical data
   */
  async getRevenueForecast(days: number = 30) {
    // Implementation for revenue forecasting
    // This can use machine learning algorithms or simple trend analysis
    const historicalData = await this.dashboardRepo.getRevenueChartData(
      new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      new Date(),
      'day'
    )

    // Simple linear regression for forecast
    const forecast = this.calculateLinearTrendForecast(historicalData, days)
    return forecast
  }

  /**
   * Get cohort analysis for customer retention
   */
  async getCohortAnalysis(months: number = 6) {
    // Implementation for cohort analysis
    // Track customer behavior over time periods
    return {
      cohorts: [],
      retentionRates: [],
      averageLifetimeValue: 0
    }
  }

  /**
   * Get seasonal trends analysis
   */
  async getSeasonalTrends() {
    // Implementation for seasonal analysis
    // Analyze revenue patterns by month, week, day of week, etc.
    return {
      monthlyTrends: [],
      weeklyTrends: [],
      dailyTrends: []
    }
  }

  private calculateLinearTrendForecast(data: any[], forecastDays: number): any[] {
    if (data.length < 2) return []

    // Simple linear regression calculation
    const n = data.length
    const x = data.map((_, i) => i)
    const y = data.map((d) => d.revenue)

    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = y.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0)
    const sumXX = x.reduce((acc, xi) => acc + xi * xi, 0)

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n

    // Generate forecast
    const forecast: Array<{
      date: string
      predictedRevenue: number
      confidence: number
    }> = []
    for (let i = 0; i < forecastDays; i++) {
      const day = n + i
      const predictedRevenue = slope * day + intercept
      forecast.push({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        predictedRevenue: Math.max(0, predictedRevenue),
        confidence: Math.max(0, 100 - i * 2) // Confidence decreases over time
      })
    }

    return forecast
  }
}
