import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { z } from 'zod'

const expenseSchema = z.object({
  totalAmount: z.number().positive(),
  currency: z.string(),
  category: z.enum(['vegetable_marketing', 'grocery_shopping', 'online_shopping', 'lending_borrowing', 'investments', 'custom']),
  subCategory: z.string().optional(),
  customCategory: z.string().optional(),
  date: z.string().transform((str) => new Date(str)),
  isEssential: z.boolean().default(true),
  description: z.string().optional(),
  items: z.array(z.object({
    itemName: z.string(),
    quantity: z.number().positive(),
    unit: z.string(),
    unitPrice: z.number().positive(),
    totalPrice: z.number().positive(),
    isEssential: z.boolean().default(true),
  })).optional(),
})

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const validatedData = expenseSchema.parse(body)

    const expense = await db.expense.create({
      data: {
        userId: decoded.userId,
        ...validatedData,
        items: validatedData.items ? {
          create: validatedData.items
        } : undefined,
      },
      include: {
        items: true,
      },
    })

    return NextResponse.json({ expense })
  } catch (error) {
    console.error('Expense creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create expense' },
      { status: 500 }
    )
  }
}

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
    const category = searchParams.get('category')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const whereClause: any = { userId: decoded.userId }
    
    if (category) whereClause.category = category
    if (startDate) whereClause.date = { ...whereClause.date, gte: new Date(startDate) }
    if (endDate) whereClause.date = { ...whereClause.date, lte: new Date(endDate) }

    const expenses = await db.expense.findMany({
      where: whereClause,
      include: {
        items: true,
      },
      orderBy: {
        date: 'desc',
      },
    })

    return NextResponse.json({ expenses })
  } catch (error) {
    console.error('Expense fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    )
  }
}