import { PrismaService } from '@/shared/services/prisma.service'
import { Injectable } from '@nestjs/common'
import {
  CustomerSegment,
  GeographicRevenue,
  PaymentMethodStats,
  RevenueChartData,
  ServicePlanRevenue
} from './dashboard.model'

@Injectable()
export class DashboardRepo {
  constructor(private readonly db: PrismaService) {}

  // ===== OVERVIEW STATISTICS =====
  async getRevenueStats(startDate: Date, endDate: Date) {
    return await this.db.payment.aggregate({
      where: {
        status: 'PAID',
        paidAt: {
          gte: startDate,
          lte: endDate
        },
        deletedAt: null
      },
      _sum: {
        amount: true
      },
      _count: {
        id: true
      }
    })
  }

  async getCustomerStats(startDate: Date, endDate: Date) {
    return await this.db.subscription.aggregate({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        },
        deletedAt: null
      },
      _count: {
        userId: true
      }
    })
  }

  async getUniqueCustomersCount(startDate: Date, endDate: Date) {
    const result = await this.db.subscription.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        },
        deletedAt: null
      },
      select: {
        userId: true
      },
      distinct: ['userId']
    })
    return result.length
  }

  async getActiveInstancesCount(startDate: Date, endDate: Date) {
    return await this.db.qosInstance.count({
      where: {
        OR: [{ statusFE: 'ACTIVE' }, { statusBE: 'ACTIVE' }, { statusDb: 'ACTIVE' }],
        createdAt: {
          gte: startDate,
          lte: endDate
        },
        deletedAt: null
      }
    })
  }

  // ===== REVENUE CHART DATA =====
  async getRevenueChartData(
    startDate: Date,
    endDate: Date,
    granularity: 'hour' | 'day' | 'week' | 'month'
  ): Promise<RevenueChartData[]> {
    let dateFormat: string
    let dateTrunc: string

    switch (granularity) {
      case 'hour':
        dateFormat = 'YYYY-MM-DD HH24:00:00'
        dateTrunc = 'hour'
        break
      case 'day':
        dateFormat = 'YYYY-MM-DD'
        dateTrunc = 'day'
        break
      case 'week':
        dateFormat = 'YYYY-"W"WW'
        dateTrunc = 'week'
        break
      case 'month':
        dateFormat = 'YYYY-MM'
        dateTrunc = 'month'
        break
      default:
        dateFormat = 'YYYY-MM-DD'
        dateTrunc = 'day'
    }

    const query = `
      SELECT
        DATE_TRUNC('${dateTrunc}', "paidAt") as period,
        TO_CHAR(DATE_TRUNC('${dateTrunc}', "paidAt"), '${dateFormat}') as date,
        COALESCE(SUM(amount), 0) as revenue,
        COUNT(*) as orders,
        COALESCE(SUM(SUM(amount)) OVER (ORDER BY DATE_TRUNC('${dateTrunc}', "paidAt")), 0) as "cumulativeRevenue"
      FROM "Payment"
      WHERE status = 'PAID'
        AND "paidAt" >= $1
        AND "paidAt" <= $2
        AND "deletedAt" IS NULL
      GROUP BY DATE_TRUNC('${dateTrunc}', "paidAt")
      ORDER BY period ASC
    `

    const result = await this.db.$queryRawUnsafe(query, startDate, endDate)

    return (result as any[]).map((row) => ({
      date: row.date,
      revenue: Number(row.revenue),
      orders: Number(row.orders),
      cumulativeRevenue: Number(row.cumulativeRevenue)
    }))
  }

  // ===== SERVICE PLAN REVENUE =====
  async getServicePlanRevenue(
    startDate: Date,
    endDate: Date
  ): Promise<ServicePlanRevenue[]> {
    const query = `
      SELECT
        sp.id as "servicePlanId",
        sp.name as "servicePlanName",
        COALESCE(SUM(p.amount), 0) as revenue,
        COUNT(p.id) as orders
      FROM "ServicePlan" sp
      LEFT JOIN "Subscription" s ON s."servicePlanId" = sp.id AND s."deletedAt" IS NULL
      LEFT JOIN "Payment" p ON p."subscriptionId" = s.id
        AND p.status = 'PAID'
        AND p."paidAt" >= $1
        AND p."paidAt" <= $2
        AND p."deletedAt" IS NULL
      WHERE sp."deletedAt" IS NULL
      GROUP BY sp.id, sp.name
      ORDER BY revenue DESC
    `

    const result = await this.db.$queryRawUnsafe(query, startDate, endDate)
    const totalRevenue = (result as any[]).reduce(
      (sum, row) => sum + Number(row.revenue),
      0
    )

    return (result as any[]).map((row) => ({
      servicePlanId: Number(row.servicePlanId),
      servicePlanName: row.servicePlanName,
      revenue: Number(row.revenue),
      orders: Number(row.orders),
      percentage: totalRevenue > 0 ? (Number(row.revenue) / totalRevenue) * 100 : 0,
      growth: 0 // Will be calculated in service layer
    }))
  }

  // ===== PAYMENT METHOD STATS =====
  async getPaymentMethodStats(
    startDate: Date,
    endDate: Date
  ): Promise<PaymentMethodStats[]> {
    const result = await this.db.payment.groupBy({
      by: ['paymentMethod'],
      where: {
        status: 'PAID',
        paidAt: {
          gte: startDate,
          lte: endDate
        },
        deletedAt: null
      },
      _sum: {
        amount: true
      },
      _count: {
        id: true
      }
    })

    const totalRevenue = result.reduce((sum, row) => sum + (row._sum.amount || 0), 0)

    return result.map((row) => ({
      method: row.paymentMethod,
      revenue: row._sum.amount || 0,
      orders: row._count.id,
      percentage: totalRevenue > 0 ? ((row._sum.amount || 0) / totalRevenue) * 100 : 0
    }))
  }

  // ===== CUSTOMER SEGMENTS =====
  async getCustomerSegments(startDate: Date, endDate: Date): Promise<CustomerSegment[]> {
    const query = `
      WITH customer_stats AS (
        SELECT
          u.id,
          u.name,
          COUNT(DISTINCT s.id) as subscription_count,
          COALESCE(SUM(p.amount), 0) as total_revenue
        FROM "User" u
        LEFT JOIN "Subscription" s ON s."userId" = u.id AND s."deletedAt" IS NULL
        LEFT JOIN "Payment" p ON p."subscriptionId" = s.id
          AND p.status = 'PAID'
          AND p."paidAt" >= $1
          AND p."paidAt" <= $2
          AND p."deletedAt" IS NULL
        WHERE u."deletedAt" IS NULL AND u."roleName" = 'CUSTOMER'
        GROUP BY u.id, u.name
      ),
      segments AS (
        SELECT
          CASE
            WHEN total_revenue = 0 THEN 'Inactive'
            WHEN total_revenue < 1000000 THEN 'Low Value'
            WHEN total_revenue < 5000000 THEN 'Medium Value'
            ELSE 'High Value'
          END as segment,
          COUNT(*) as count,
          COALESCE(SUM(total_revenue), 0) as revenue,
          COALESCE(AVG(total_revenue), 0) as average_value
        FROM customer_stats
        GROUP BY segment
      )
      SELECT
        segment,
        count,
        revenue,
        average_value,
        (count * 100.0 / SUM(count) OVER()) as percentage
      FROM segments
      ORDER BY revenue DESC
    `

    const result = await this.db.$queryRawUnsafe(query, startDate, endDate)

    return (result as any[]).map((row) => ({
      segment: row.segment,
      count: Number(row.count),
      revenue: Number(row.revenue),
      averageValue: Number(row.average_value),
      percentage: Number(row.percentage)
    }))
  }

  // ===== GEOGRAPHIC REVENUE =====
  async getGeographicRevenue(
    startDate: Date,
    endDate: Date
  ): Promise<GeographicRevenue[]> {
    const query = `
      SELECT
        CASE
          WHEN s."restaurantAddress" ILIKE '%hồ chí minh%' OR s."restaurantAddress" ILIKE '%tphcm%' OR s."restaurantAddress" ILIKE '%sài gòn%' THEN 'TP. Hồ Chí Minh'
          WHEN s."restaurantAddress" ILIKE '%hà nội%' OR s."restaurantAddress" ILIKE '%hanoi%' THEN 'Hà Nội'
          WHEN s."restaurantAddress" ILIKE '%đà nẵng%' OR s."restaurantAddress" ILIKE '%da nang%' THEN 'Đà Nẵng'
          WHEN s."restaurantAddress" ILIKE '%cần thơ%' OR s."restaurantAddress" ILIKE '%can tho%' THEN 'Cần Thơ'
          WHEN s."restaurantAddress" ILIKE '%hải phòng%' OR s."restaurantAddress" ILIKE '%hai phong%' THEN 'Hải Phòng'
          ELSE 'Khác'
        END as region,
        COALESCE(SUM(p.amount), 0) as revenue,
        COUNT(p.id) as orders
      FROM "Subscription" s
      LEFT JOIN "Payment" p ON p."subscriptionId" = s.id
        AND p.status = 'PAID'
        AND p."paidAt" >= $1
        AND p."paidAt" <= $2
        AND p."deletedAt" IS NULL
      WHERE s."deletedAt" IS NULL
      GROUP BY region
      ORDER BY revenue DESC
    `

    const result = await this.db.$queryRawUnsafe(query, startDate, endDate)
    const totalRevenue = (result as any[]).reduce(
      (sum, row) => sum + Number(row.revenue),
      0
    )

    return (result as any[]).map((row) => ({
      region: row.region,
      revenue: Number(row.revenue),
      orders: Number(row.orders),
      percentage: totalRevenue > 0 ? (Number(row.revenue) / totalRevenue) * 100 : 0
    }))
  }

  // ===== TOP CUSTOMERS =====
  async getTopCustomers(startDate: Date, endDate: Date, limit: number = 10) {
    const query = `
      SELECT
        u.id as "userId",
        u.name as "userName",
        u.email,
        COALESCE(SUM(p.amount), 0) as "totalRevenue",
        COUNT(DISTINCT s.id) as "totalOrders",
        MAX(p."paidAt") as "lastOrderDate"
      FROM "User" u
      LEFT JOIN "Subscription" s ON s."userId" = u.id AND s."deletedAt" IS NULL
      LEFT JOIN "Payment" p ON p."subscriptionId" = s.id
        AND p.status = 'PAID'
        AND p."paidAt" >= $1
        AND p."paidAt" <= $2
        AND p."deletedAt" IS NULL
      WHERE u."deletedAt" IS NULL AND u."roleName" = 'CUSTOMER'
      GROUP BY u.id, u.name, u.email
      HAVING COALESCE(SUM(p.amount), 0) > 0
      ORDER BY "totalRevenue" DESC
      LIMIT $3
    `

    const result = await this.db.$queryRawUnsafe(query, startDate, endDate, limit)

    return (result as any[]).map((row) => ({
      userId: Number(row.userId),
      userName: row.userName || 'N/A',
      email: row.email,
      totalRevenue: Number(row.totalRevenue),
      totalOrders: Number(row.totalOrders),
      lastOrderDate: row.lastOrderDate?.toISOString() || null
    }))
  }

  // ===== RECENT TRANSACTIONS =====
  async getRecentTransactions(limit: number = 10) {
    const result = await this.db.payment.findMany({
      where: {
        status: 'PAID',
        deletedAt: null
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        subscription: {
          include: {
            servicePlan: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        paidAt: 'desc'
      },
      take: limit
    })

    return result.map((payment) => ({
      paymentId: payment.id,
      customerName: payment.user.name || payment.user.email,
      servicePlanName: payment.subscription.servicePlan.name,
      amount: payment.amount,
      status: payment.status,
      paidAt: payment.paidAt?.toISOString() || payment.createdAt.toISOString()
    }))
  }

  // ===== GROWTH CALCULATION HELPERS =====
  async getPreviousPeriodRevenue(
    currentStartDate: Date,
    currentEndDate: Date
  ): Promise<number> {
    const periodDiff = currentEndDate.getTime() - currentStartDate.getTime()
    const previousStartDate = new Date(currentStartDate.getTime() - periodDiff)
    const previousEndDate = new Date(currentEndDate.getTime() - periodDiff)

    const result = await this.db.payment.aggregate({
      where: {
        status: 'PAID',
        paidAt: {
          gte: previousStartDate,
          lte: previousEndDate
        },
        deletedAt: null
      },
      _sum: {
        amount: true
      }
    })

    return result._sum.amount || 0
  }

  async getPreviousPeriodOrdersCount(
    currentStartDate: Date,
    currentEndDate: Date
  ): Promise<number> {
    const periodDiff = currentEndDate.getTime() - currentStartDate.getTime()
    const previousStartDate = new Date(currentStartDate.getTime() - periodDiff)
    const previousEndDate = new Date(currentEndDate.getTime() - periodDiff)

    return await this.db.payment.count({
      where: {
        status: 'PAID',
        paidAt: {
          gte: previousStartDate,
          lte: previousEndDate
        },
        deletedAt: null
      }
    })
  }

  async getPreviousPeriodCustomersCount(
    currentStartDate: Date,
    currentEndDate: Date
  ): Promise<number> {
    const periodDiff = currentEndDate.getTime() - currentStartDate.getTime()
    const previousStartDate = new Date(currentStartDate.getTime() - periodDiff)
    const previousEndDate = new Date(currentEndDate.getTime() - periodDiff)

    const result = await this.db.subscription.findMany({
      where: {
        createdAt: {
          gte: previousStartDate,
          lte: previousEndDate
        },
        deletedAt: null
      },
      select: {
        userId: true
      },
      distinct: ['userId']
    })

    return result.length
  }
}
