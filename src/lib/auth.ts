import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch {
    return null
  }
}

export async function createUser(userData: {
  email: string
  name: string
  password: string
  incomeMode: string
  profession: string
  incomeAmount?: number
  currency?: string
  totalLumpSum?: number
  lumpSumDuration?: number
  monthlyStipend?: number
  householdBudget?: number
  customIncomeDesc?: string
}) {
  const hashedPassword = await hashPassword(userData.password)
  
  return db.user.create({
    data: {
      ...userData,
      password: hashedPassword,
    },
  })
}

export async function getUserByEmail(email: string) {
  return db.user.findUnique({
    where: { email },
  })
}

export async function getUserById(id: string) {
  return db.user.findUnique({
    where: { id },
  })
}