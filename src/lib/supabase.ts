import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ CONFIGURATION ERROR: Missing Supabase environment variables!');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing');
  console.error('\nTo fix this:');
  console.error('1. Go to your Netlify dashboard');
  console.error('2. Navigate to Site settings → Environment variables');
  console.error('3. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  console.error('4. Redeploy your site\n');
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'kelechiekpemiro-portfolio'
    }
  }
})

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      resumes: {
        Row: {
          id: string
          slug: string
          title: string
          description: string
          image_url: string | null
          intro_text: string | null
          education: any | null
          skills: string[] | null
          certifications: any | null
          created_at: string
          updated_at: string
          display_order: number | null
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description: string
          image_url?: string | null
          intro_text?: string | null
          education?: any | null
          skills?: string[] | null
          certifications?: any | null
          created_at?: string
          updated_at?: string
          display_order?: number | null
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string
          image_url?: string | null
          intro_text?: string | null
          education?: any | null
          skills?: string[] | null
          certifications?: any | null
          updated_at?: string
          display_order?: number | null
        }
      }
      projects: {
        Row: {
          id: string
          title: string
          description: string
          content: any
          technologies: string[] | null
          start_date: string
          end_date: string | null
          status: 'completed' | 'in_progress' | 'planned'
          featured_image: string | null
          gallery: string[] | null
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          content?: any
          technologies?: string[] | null
          start_date: string
          end_date?: string | null
          status?: 'completed' | 'in_progress' | 'planned'
          featured_image?: string | null
          gallery?: string[] | null
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          content?: any
          technologies?: string[] | null
          start_date?: string
          end_date?: string | null
          status?: 'completed' | 'in_progress' | 'planned'
          featured_image?: string | null
          gallery?: string[] | null
          is_featured?: boolean
          updated_at?: string
        }
      }
      resume_projects: {
        Row: {
          id: string
          resume_id: string
          project_id: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          resume_id: string
          project_id: string
          order_index: number
          created_at?: string
        }
        Update: {
          id?: string
          resume_id?: string
          project_id?: string
          order_index?: number
        }
      }
      experiences: {
        Row: {
          id: string
          resume_id: string
          title: string
          company: string
          description: string
          start_date: string
          end_date: string | null
          location: string | null
          employment_type: string | null
          achievements: string[] | null
          is_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          resume_id: string
          title: string
          company: string
          description: string
          start_date: string
          end_date?: string | null
          location?: string | null
          employment_type?: string | null
          achievements?: string[] | null
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          resume_id?: string
          title?: string
          company?: string
          description?: string
          start_date?: string
          end_date?: string | null
          location?: string | null
          employment_type?: string | null
          achievements?: string[] | null
          is_visible?: boolean
          updated_at?: string
        }
      }
      artifacts: {
        Row: {
          id: string
          experience_id: string
          type: 'document' | 'image' | 'video'
          title: string
          url: string
          is_visible: boolean
          created_at: string
        }
        Insert: {
          id?: string
          experience_id: string
          type: 'document' | 'image' | 'video'
          title: string
          url: string
          is_visible?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          experience_id?: string
          type?: 'document' | 'image' | 'video'
          title?: string
          url?: string
          is_visible?: boolean
        }
      }
      messages: {
        Row: {
          id: string
          name: string
          email: string
          message: string
          resume_id: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          message: string
          resume_id?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          message?: string
          resume_id?: string | null
          status?: string
        }
      }
      kanban_stages: {
        Row: {
          id: string
          title: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          order_index: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          order_index?: number
        }
      }
      kanban_tickets: {
        Row: {
          id: string
          title: string
          description: string | null
          stage_id: string
          message_id: string | null
          labels: string[] | null
          due_date: string | null
          notes: string | null
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          stage_id: string
          message_id?: string | null
          labels?: string[] | null
          due_date?: string | null
          notes?: string | null
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          stage_id?: string
          message_id?: string | null
          labels?: string[] | null
          due_date?: string | null
          notes?: string | null
          order_index?: number
          updated_at?: string
        }
      }
    }
  }
}