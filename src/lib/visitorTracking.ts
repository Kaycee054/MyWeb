import { supabase } from './supabase'

interface GeoLocation {
  country?: string
  city?: string
  region?: string
}

const GEOLOCATION_API = 'https://ipapi.co/json/'

export async function getVisitorGeoLocation(): Promise<GeoLocation> {
  try {
    const response = await fetch(GEOLOCATION_API, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) return {}

    const data = await response.json()
    return {
      country: data.country_name || undefined,
      city: data.city || undefined,
      region: data.region || undefined
    }
  } catch (error) {
    console.error('Error fetching geolocation:', error)
    return {}
  }
}

function getOrCreateVisitorId(): string {
  let visitorId = localStorage.getItem('visitor_id')

  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('visitor_id', visitorId)
  }

  return visitorId
}

export async function trackPageView(pagePath: string, visitorName?: string, visitorEmail?: string) {
  try {
    const visitorId = getOrCreateVisitorId()
    const geo = await getVisitorGeoLocation()

    const pageViewData = {
      visitor_id: visitorId,
      page_path: pagePath,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
      country: geo.country || null,
      city: geo.city || null,
      region: geo.region || null,
      ip_address: null,
      visitor_name: visitorName || null,
      visitor_email: visitorEmail || null,
      session_duration: null
    }

    await supabase.from('page_views').insert(pageViewData)

    const { data: existingSession } = await supabase
      .from('visitor_sessions')
      .select('id')
      .eq('visitor_id', visitorId)
      .maybeSingle()

    if (existingSession) {
      await supabase
        .from('visitor_sessions')
        .update({
          last_visit: new Date().toISOString(),
          total_pages_viewed: supabase.from('visitor_sessions').select('total_pages_viewed'),
          country: geo.country || null,
          city: geo.city || null,
          ...(visitorName && { visitor_name: visitorName }),
          ...(visitorEmail && { contact_email: visitorEmail, has_contacted: true })
        })
        .eq('visitor_id', visitorId)
    } else {
      await supabase.from('visitor_sessions').insert({
        visitor_id: visitorId,
        first_visit: new Date().toISOString(),
        last_visit: new Date().toISOString(),
        total_pages_viewed: 1,
        country: geo.country || null,
        city: geo.city || null,
        has_contacted: !!visitorEmail,
        contact_email: visitorEmail || null
      })
    }
  } catch (error) {
    console.error('Error tracking page view:', error)
  }
}

export function trackVisitorInfo(name: string, email: string) {
  const visitorId = getOrCreateVisitorId()
  localStorage.setItem('visitor_name', name)
  localStorage.setItem('visitor_email', email)

  trackPageView(window.location.pathname, name, email)
}
