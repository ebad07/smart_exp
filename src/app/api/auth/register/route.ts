import { NextRequest, NextResponse } from 'next/server'
import { createUser, getUserByEmail, generateToken } from '@/lib/auth'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(6),
  incomeMode: z.enum(['regular', 'irregular', 'lump_sum', 'student', 'household', 'other']),
  profession: z.string().min(2),
  incomeAmount: z.number().optional(),
  currency: z.string().default('USD'),
  totalLumpSum: z.number().optional(),
  lumpSumDuration: z.number().optional(),
  monthlyStipend: z.number().optional(),
  householdBudget: z.number().optional(),
  customIncomeDesc: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    const existingUser = await getUserByEmail(validatedData.email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    const user = await createUser(validatedData)
    const token = generateToken(user.id)
    
    return NextResponse.json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        incomeMode: user.incomeMode,
        profession: user.profession,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}