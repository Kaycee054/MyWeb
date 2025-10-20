import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'
import { AdminLogin } from '../components/AdminLogin'
import { AdminDashboard } from '../components/AdminDashboard'

export function AdminPage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  if (loading) {
    return (
      <Layout>
        <div className="pt-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    )
  }

  // Add some basic protection - redirect if accessed directly without auth
  React.useEffect(() => {
    if (!user && !loading) {
      const timer = setTimeout(() => {
        if (!user) {
          navigate('/')
        }
      }, 5000) // Give 5 seconds for login attempt
      
      return () => clearTimeout(timer)
    }
  }, [user, loading, navigate])

  return (
    <Layout>
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        {user ? <AdminDashboard /> : <AdminLogin />}
      </div>
    </Layout>
  )
}