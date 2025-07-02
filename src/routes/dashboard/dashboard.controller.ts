import { Controller, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import {
  DashboardQueryDto,
  RevenueAnalytics,
  RevenueChartQueryDto,
  ServicePlanRevenueQueryDto
} from './dashboard.model'
import { DashboardService } from './dashboard.service'

@ApiTags('Dashboard Management')
@Controller('manage/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('analytics')
  @ApiOperation({
    summary: 'Get comprehensive dashboard analytics',
    description:
      'Retrieve complete revenue analytics including overview, charts, and detailed statistics'
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard analytics retrieved successfully',
    type: Object
  })
  @ApiQuery({
    name: 'period',
    enum: ['7d', '30d', '90d', '1y', 'custom'],
    required: false
  })
  @ApiQuery({ name: 'startDate', type: String, required: false })
  @ApiQuery({ name: 'endDate', type: String, required: false })
  @ApiQuery({ name: 'timeZone', type: String, required: false })
  async getDashboardAnalytics(@Query() query: DashboardQueryDto): Promise<{
    success: boolean
    message: string
    data: RevenueAnalytics
  }> {
    const analytics = await this.dashboardService.getDashboardAnalytics(query)

    return {
      success: true,
      message: 'Dashboard analytics retrieved successfully',
      data: analytics
    }
  }

  @Get('overview')
  @ApiOperation({
    summary: 'Get dashboard overview metrics',
    description: 'Retrieve key performance indicators and overview statistics'
  })
  @ApiResponse({ status: 200, description: 'Dashboard overview retrieved successfully' })
  async getDashboardOverview(@Query() query: DashboardQueryDto) {
    const overview = await this.dashboardService.getDashboardOverview(query)

    return {
      success: true,
      message: 'Dashboard overview retrieved successfully',
      data: overview
    }
  }

  @Get('revenue-chart')
  @ApiOperation({
    summary: 'Get revenue chart data',
    description: 'Retrieve time-series revenue data for charting'
  })
  @ApiResponse({ status: 200, description: 'Revenue chart data retrieved successfully' })
  @ApiQuery({
    name: 'period',
    enum: ['7d', '30d', '90d', '1y', 'custom'],
    required: false
  })
  @ApiQuery({
    name: 'granularity',
    enum: ['hour', 'day', 'week', 'month'],
    required: false
  })
  @ApiQuery({ name: 'startDate', type: String, required: false })
  @ApiQuery({ name: 'endDate', type: String, required: false })
  async getRevenueChart(@Query() query: RevenueChartQueryDto) {
    const chartData = await this.dashboardService.getRevenueChart(query)

    return {
      success: true,
      message: 'Revenue chart data retrieved successfully',
      data: chartData
    }
  }

  @Get('service-plan-revenue')
  @ApiOperation({
    summary: 'Get service plan revenue breakdown',
    description: 'Retrieve revenue statistics broken down by service plans'
  })
  @ApiResponse({
    status: 200,
    description: 'Service plan revenue retrieved successfully'
  })
  async getServicePlanRevenue(@Query() query: ServicePlanRevenueQueryDto) {
    const servicePlanRevenue = await this.dashboardService.getServicePlanRevenue(query)

    return {
      success: true,
      message: 'Service plan revenue retrieved successfully',
      data: servicePlanRevenue
    }
  }

  @Get('payment-methods')
  @ApiOperation({
    summary: 'Get payment method statistics',
    description: 'Retrieve revenue breakdown by payment methods'
  })
  @ApiResponse({
    status: 200,
    description: 'Payment method stats retrieved successfully'
  })
  async getPaymentMethodStats(@Query() query: DashboardQueryDto) {
    const { startDate, endDate } = this.calculateDateRange(query)
    const paymentStats = await this.dashboardService[
      'dashboardRepo'
    ].getPaymentMethodStats(startDate, endDate)

    return {
      success: true,
      message: 'Payment method statistics retrieved successfully',
      data: paymentStats
    }
  }

  @Get('customer-segments')
  @ApiOperation({
    summary: 'Get customer segmentation analysis',
    description: 'Retrieve customer segments based on spending behavior'
  })
  @ApiResponse({ status: 200, description: 'Customer segments retrieved successfully' })
  async getCustomerSegments(@Query() query: DashboardQueryDto) {
    const { startDate, endDate } = this.calculateDateRange(query)
    const customerSegments = await this.dashboardService[
      'dashboardRepo'
    ].getCustomerSegments(startDate, endDate)

    return {
      success: true,
      message: 'Customer segments retrieved successfully',
      data: customerSegments
    }
  }

  @Get('geographic-revenue')
  @ApiOperation({
    summary: 'Get geographic revenue distribution',
    description: 'Retrieve revenue breakdown by geographic regions'
  })
  @ApiResponse({ status: 200, description: 'Geographic revenue retrieved successfully' })
  async getGeographicRevenue(@Query() query: DashboardQueryDto) {
    const { startDate, endDate } = this.calculateDateRange(query)
    const geographicRevenue = await this.dashboardService[
      'dashboardRepo'
    ].getGeographicRevenue(startDate, endDate)

    return {
      success: true,
      message: 'Geographic revenue retrieved successfully',
      data: geographicRevenue
    }
  }

  @Get('top-customers')
  @ApiOperation({
    summary: 'Get top customers by revenue',
    description: 'Retrieve list of highest spending customers'
  })
  @ApiResponse({ status: 200, description: 'Top customers retrieved successfully' })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async getTopCustomers(
    @Query() query: DashboardQueryDto,
    @Query('limit') limitParam?: string
  ) {
    const limit = limitParam ? parseInt(limitParam, 10) : 10
    const { startDate, endDate } = this.calculateDateRange(query)
    const topCustomers = await this.dashboardService['dashboardRepo'].getTopCustomers(
      startDate,
      endDate,
      limit
    )

    return {
      success: true,
      message: 'Top customers retrieved successfully',
      data: topCustomers
    }
  }

  @Get('recent-transactions')
  @ApiOperation({
    summary: 'Get recent transactions',
    description: 'Retrieve list of recent successful transactions'
  })
  @ApiResponse({ status: 200, description: 'Recent transactions retrieved successfully' })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async getRecentTransactions(@Query('limit') limitParam?: string) {
    const limit = limitParam ? parseInt(limitParam, 10) : 10
    const recentTransactions =
      await this.dashboardService['dashboardRepo'].getRecentTransactions(limit)

    return {
      success: true,
      message: 'Recent transactions retrieved successfully',
      data: recentTransactions
    }
  }

  @Get('revenue-forecast')
  @ApiOperation({
    summary: 'Get revenue forecast',
    description: 'Get revenue predictions based on historical data'
  })
  @ApiResponse({ status: 200, description: 'Revenue forecast retrieved successfully' })
  @ApiQuery({ name: 'days', type: Number, required: false })
  async getRevenueForecast(@Query('days') daysParam?: string) {
    const days = daysParam ? parseInt(daysParam, 10) : 30
    const forecast = await this.dashboardService.getRevenueForecast(days)

    return {
      success: true,
      message: 'Revenue forecast retrieved successfully',
      data: forecast
    }
  }

  @Get('cohort-analysis')
  @ApiOperation({
    summary: 'Get cohort analysis',
    description: 'Get customer cohort analysis for retention insights'
  })
  @ApiResponse({ status: 200, description: 'Cohort analysis retrieved successfully' })
  @ApiQuery({ name: 'months', type: Number, required: false })
  async getCohortAnalysis(@Query('months') monthsParam?: string) {
    const months = monthsParam ? parseInt(monthsParam, 10) : 6
    const cohortAnalysis = await this.dashboardService.getCohortAnalysis(months)

    return {
      success: true,
      message: 'Cohort analysis retrieved successfully',
      data: cohortAnalysis
    }
  }

  @Get('seasonal-trends')
  @ApiOperation({
    summary: 'Get seasonal trends',
    description: 'Get seasonal revenue trends and patterns'
  })
  @ApiResponse({ status: 200, description: 'Seasonal trends retrieved successfully' })
  async getSeasonalTrends() {
    const seasonalTrends = await this.dashboardService.getSeasonalTrends()

    return {
      success: true,
      message: 'Seasonal trends retrieved successfully',
      data: seasonalTrends
    }
  }

  // ===== HELPER METHODS =====
  private calculateDateRange(query: DashboardQueryDto): {
    startDate: Date
    endDate: Date
  } {
    const now = new Date()

    if (query.period === 'custom' && query.startDate && query.endDate) {
      return {
        startDate: new Date(query.startDate),
        endDate: new Date(query.endDate)
      }
    }

    let startDate: Date
    const endDate = new Date(now)

    switch (query.period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    return { startDate, endDate }
  }
}
