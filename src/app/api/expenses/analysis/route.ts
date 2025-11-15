import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const months = parseInt(searchParams.get('months') || '3')

    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - months)

    const expenses = await db.expense.findMany({
      where: {
        userId: decoded.userId,
        date: {
          gte: startDate,
        },
      },
      include: {
        items: true,
      },
      orderBy: {
        date: 'desc',
      },
    })

    // Category-wise analysis
    const categoryAnalysis = expenses.reduce((acc: any, expense) => {
      const category = expense.category
      if (!acc[category]) {
        acc[category] = {
          totalAmount: 0,
          count: 0,
          essentialAmount: 0,
          nonEssentialAmount: 0,
          items: {},
        }
      }
      
      acc[category].totalAmount += expense.totalAmount
      acc[category].count += 1
      
      if (expense.isEssential) {
        acc[category].essentialAmount += expense.totalAmount
      } else {
        acc[category].nonEssentialAmount += expense.totalAmount
      }

      // Item-wise analysis
      expense.items.forEach((item) => {
        const itemName = item.itemName
        if (!acc[category].items[itemName]) {
          acc[category].items[itemName] = {
            totalQuantity: 0,
            totalAmount: 0,
            count: 0,
            unit: item.unit,
          }
        }
        acc[category].items[itemName].totalQuantity += item.quantity
        acc[category].items[itemName].totalAmount += item.totalPrice
        acc[category].items[itemName].count += 1
      })

      return acc
    }, {})

    // Monthly trends
    const monthlyTrends = expenses.reduce((acc: any, expense) => {
      const monthKey = expense.date.toISOString().slice(0, 7) // YYYY-MM
      if (!acc[monthKey]) {
        acc[monthKey] = {
          totalAmount: 0,
          count: 0,
          essentialAmount: 0,
          nonEssentialAmount: 0,
        }
      }
      
      acc[monthKey].totalAmount += expense.totalAmount
      acc[monthKey].count += 1
      
      if (expense.isEssential) {
        acc[monthKey].essentialAmount += expense.totalAmount
      } else {
        acc[monthKey].nonEssentialAmount += expense.totalAmount
      }

      return acc
    }, {})

    // Top spending categories
    const topCategories = Object.entries(categoryAnalysis)
      .map(([category, data]: [string, any]) => ({
        category,
        totalAmount: data.totalAmount,
        count: data.count,
        essentialAmount: data.essentialAmount,
        nonEssentialAmount: data.nonEssentialAmount,
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount)

    // Suggestions based on spending patterns
    const suggestions = []
    
    // High non-essential spending
    const totalNonEssential = Object.values(categoryAnalysis).reduce((sum: number, data: any) => 
      sum + data.nonEssentialAmount, 0)
    const totalSpending = Object.values(categoryAnalysis).reduce((sum: number, data: any) => 
      sum + data.totalAmount, 0)
    
    if (totalNonEssential > totalSpending * 0.3) {
      suggestions.push({
        type: 'warning',
        message: `Your non-essential spending is ${(totalNonEssential / totalSpending * 100).toFixed(1)}% of total expenses. Consider reducing unnecessary expenses.`,
        priority: 'high',
      })
    }

    // Frequent small purchases
    Object.entries(categoryAnalysis).forEach(([category, data]: [string, any]) => {
      if (data.count > 10 && data.totalAmount < 500) {
        suggestions.push({
          type: 'info',
          message: `You have ${data.count} purchases in ${category.replace('_', ' ')} with total $${data.totalAmount.toFixed(2)}. Consider bulk buying to save money.`,
          priority: 'medium',
        })
      }
    })

    return NextResponse.json({
      analysis: {
        categoryAnalysis,
        monthlyTrends,
        topCategories,
        totalExpenses: totalSpending,
        totalNonEssential,
        totalEssential: totalSpending - totalNonEssential,
        suggestions,
        period: `${months} months`,
      },
    })
  } catch (error) {
    console.error('Expense analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze expenses' },
      { status: 500 }
    )
  }
}