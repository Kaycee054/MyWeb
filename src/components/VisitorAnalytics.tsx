import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Globe, Users, MapPin, Eye, Mail, TrendingUp, Activity } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface VisitorData {
  totalVisitors: number
  totalPageViews: number
  visitorsWithEmail: number
  topCountries: Array<{ country: string; count: number }>
  topCities: Array<{ city: string; count: number }>
  recentVisitors: Array<{
    id: string
    visitor_id: string
    visitor_name?: string
    visitor_email?: string
    country?: string
    city?: string
    page_path: string
    created_at: string
  }>
  visitorGrowth: Array<{ date: string; count: number }>
}

export function VisitorAnalytics() {
  const [data, setData] = useState<VisitorData>({
    totalVisitors: 0,
    totalPageViews: 0,
    visitorsWithEmail: 0,
    topCountries: [],
    topCities: [],
    recentVisitors: [],
    visitorGrowth: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVisitorAnalytics()
  }, [])

  const fetchVisitorAnalytics = async () => {
    try {
      const { count: totalVisitors } = await supabase
        .from('visitor_sessions')
        .select('*', { count: 'exact', head: true })

      const { count: totalPageViews } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })

      const { count: visitorsWithEmail } = await supabase
        .from('visitor_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('has_contacted', true)

      const { data: countryData } = await supabase
        .from('page_views')
        .select('country')
        .filter('country', 'not.is', 'null')

      const countryCounts = (countryData || []).reduce((acc: { [key: string]: number }, item) => {
        if (item.country) {
          acc[item.country] = (acc[item.country] || 0) + 1
        }
        return acc
      }, {})

      const topCountries = Object.entries(countryCounts)
        .map(([country, count]) => ({ country, count: count as number }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      const { data: cityData } = await supabase
        .from('page_views')
        .select('city')
        .filter('city', 'not.is', 'null')

      const cityCounts = (cityData || []).reduce((acc: { [key: string]: number }, item) => {
        if (item.city) {
          acc[item.city] = (acc[item.city] || 0) + 1
        }
        return acc
      }, {})

      const topCities = Object.entries(cityCounts)
        .map(([city, count]) => ({ city, count: count as number }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      const { data: allPageViews } = await supabase
        .from('page_views')
        .select('id, visitor_id, visitor_name, visitor_email, country, city, page_path, created_at')
        .order('created_at', { ascending: false })
        .limit(20)

      const recentVisitors = (allPageViews || [])
        .filter((item, index, self) => self.findIndex(v => v.visitor_id === item.visitor_id) === index)
        .slice(0, 10)

      const { data: allVisitors } = await supabase
        .from('page_views')
        .select('visitor_id, created_at')

      const dateMap = new Map<string, number>()
      ;(allVisitors || []).forEach(visit => {
        const date = new Date(visit.created_at).toLocaleDateString()
        dateMap.set(date, (dateMap.get(date) || 0) + 1)
      })

      const visitorGrowth = Array.from(dateMap.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-7)

      setData({
        totalVisitors: totalVisitors || 0,
        totalPageViews: totalPageViews || 0,
        visitorsWithEmail: visitorsWithEmail || 0,
        topCountries,
        topCities,
        recentVisitors,
        visitorGrowth
      })
    } catch (error) {
      console.error('Error fetching visitor analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const stats = [
    {
      title: 'Total Visitors',
      value: data.totalVisitors,
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/20'
    },
    {
      title: 'Page Views',
      value: data.totalPageViews,
      icon: Eye,
      color: 'text-green-400',
      bgColor: 'bg-green-900/20'
    },
    {
      title: 'Contact Submissions',
      value: data.visitorsWithEmail,
      icon: Mail,
      color: 'text-purple-400',
      bgColor: 'bg-purple-900/20'
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Visitor Analytics</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900 rounded-xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-xl p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="w-5 h-5 text-blue-400" />
            <h3 className="text-xl font-bold text-white">Top Countries</h3>
          </div>
          <div className="space-y-3">
            {data.topCountries.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <span className="text-gray-300">{item.country || 'Unknown'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 bg-blue-400/20 rounded w-16" style={{
                    width: `${Math.max(20, (item.count / Math.max(...data.topCountries.map(c => c.count), 1)) * 60)}px`
                  }} />
                  <span className="text-white font-semibold text-sm">{item.count}</span>
                </div>
              </div>
            ))}
            {data.topCountries.length === 0 && (
              <p className="text-gray-400">No geographic data yet</p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-xl p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="w-5 h-5 text-green-400" />
            <h3 className="text-xl font-bold text-white">Top Cities</h3>
          </div>
          <div className="space-y-3">
            {data.topCities.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-gray-300">{item.city || 'Unknown'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 bg-green-400/20 rounded" style={{
                    width: `${Math.max(20, (item.count / Math.max(...data.topCities.map(c => c.count), 1)) * 60)}px`
                  }} />
                  <span className="text-white font-semibold text-sm">{item.count}</span>
                </div>
              </div>
            ))}
            {data.topCities.length === 0 && (
              <p className="text-gray-400">No city data yet</p>
            )}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 rounded-xl p-6"
      >
        <div className="flex items-center space-x-2 mb-4">
          <Activity className="w-5 h-5 text-yellow-400" />
          <h3 className="text-xl font-bold text-white">Recent Visitors</h3>
        </div>
        <div className="space-y-2">
          {data.recentVisitors.map((visitor, index) => (
            <div key={visitor.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg text-sm">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium">
                    {visitor.visitor_name || 'Anonymous'}
                  </span>
                  {visitor.visitor_email && (
                    <span className="text-blue-400 text-xs">({visitor.visitor_email})</span>
                  )}
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  {visitor.city && (
                    <span className="text-gray-400 text-xs">{visitor.city}</span>
                  )}
                  {visitor.country && (
                    <span className="text-gray-400 text-xs">{visitor.country}</span>
                  )}
                  <span className="text-gray-500 text-xs">{visitor.page_path}</span>
                </div>
              </div>
              <span className="text-gray-500 text-xs">
                {new Date(visitor.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
          {data.recentVisitors.length === 0 && (
            <p className="text-gray-400">No visitors yet</p>
          )}
        </div>
      </motion.div>
    </div>
  )
}
