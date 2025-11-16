'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Home, TrendingUp, PiggyBank, Users, Target, Sparkles, DollarSign, BookOpen } from 'lucide-react'

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('login')

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="relative"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                <Home className="w-10 h-10 text-white" />
              </div>
            </motion.div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            ExpenseTracker Pro
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your intelligent companion for managing finances across all income types
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: Users, title: "For Everyone", desc: "Students, freelancers, families, retirees" },
              { icon: Target, title: "Smart Tracking", desc: "Detailed expense categorization and analysis" },
              { icon: Sparkles, title: "AI Powered", desc: "Get personalized financial suggestions" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="text-center p-6 bg-white/80 backdrop-blur-sm shadow-lg">
                  <feature.icon className="w-12 h-12 mx-auto mb-4 text-emerald-600" />
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="bg-white/90 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Get Started Today</CardTitle>
              <CardDescription className="text-center">
                Join thousands of users managing their finances smarter
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Custom Tab Implementation */}
              <div className="w-full">
                <div className="grid w-full grid-cols-2 mb-6">
                  <Button
                    variant={activeTab === 'login' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('login')}
                    className="rounded-r-none"
                  >
                    Login
                  </Button>
                  <Button
                    variant={activeTab === 'register' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('register')}
                    className="rounded-l-none"
                  >
                    Register
                  </Button>
                </div>
                
                {activeTab === 'login' && (
                  <form className="space-y-4" onSubmit={(e) => {
                    e.preventDefault()
                    // Handle login
                  }}>
                    <div>
                      <Label htmlFor="login-email">Email</Label>
                      <Input id="login-email" type="email" placeholder="Enter your email" />
                    </div>
                    <div>
                      <Label htmlFor="login-password">Password</Label>
                      <Input id="login-password" type="password" placeholder="Enter your password" />
                    </div>
                    <Button 
                      className="w-full bg-emerald-600 hover:bg-emerald-700" 
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                  </form>
                )}
                
                {activeTab === 'register' && (
                  <form className="space-y-4" onSubmit={(e) => {
                    e.preventDefault()
                    // Handle registration
                  }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="register-name">Full Name</Label>
                        <Input id="register-name" placeholder="John Doe" />
                      </div>
                      <div>
                        <Label htmlFor="register-email">Email</Label>
                        <Input id="register-email" type="email" placeholder="john@example.com" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="register-password">Password</Label>
                      <Input id="register-password" type="password" placeholder="Min 6 characters" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="incomeMode">Income Type</Label>
                        <select 
                          id="incomeMode"
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Select income type</option>
                          <option value="regular">Regular Monthly Income</option>
                          <option value="irregular">Irregular Income</option>
                          <option value="lump_sum">Lump Sum Amount</option>
                          <option value="student">Student Stipend</option>
                          <option value="household">Household Budget</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div>
                        <Label htmlFor="profession">Profession</Label>
                        <Input id="profession" placeholder="e.g., Freelancer, Student" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <select 
                        id="currency"
                        defaultValue="USD"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="JPY">JPY - Japanese Yen</option>
                        <option value="INR">INR - Indian Rupee</option>
                        <option value="CNY">CNY - Chinese Yuan</option>
                      </select>
                    </div>
                    
                    <Button 
                      className="w-full bg-emerald-600 hover:bg-emerald-700" 
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </form>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              { icon: Home, text: "Multi-Currency" },
              { icon: BookOpen, text: "Detailed Analytics" },
              { icon: Home, text: "Household Management" },
              { icon: TrendingUp, text: "Investment Tracking" }
            ].map((item, index) => (
              <Badge key={index} variant="secondary" className="px-4 py-2 text-sm">
                <item.icon className="w-4 h-4 mr-2" />
                {item.text}
              </Badge>
            ))}
          </div>
          
          <p className="text-gray-600">
            Designed for everyone - from students managing pocket money to families tracking household expenses
          </p>
        </motion.div>
      </div>
    </div>
  )
}