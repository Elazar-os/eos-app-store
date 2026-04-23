import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(
  supabaseUrl ?? 'http://localhost',
  supabaseAnonKey ?? 'placeholder'
)

// Export createClient function for API routes
export { createClient }

// Database types (you can generate these with `supabase gen types typescript --project-id YOUR_PROJECT_ID`)
export type Database = {
  public: {
    Tables: {
      chatbot_submissions: {
        Row: {
          id: string
          created_at: string
          business_name: string
          business_type: string
          chatbot_purpose: string
          api_endpoints: string | null
          training_data: string
          contact_email: string
          status: 'pending' | 'approved' | 'rejected'
        }
        Insert: {
          id?: string
          created_at?: string
          business_name: string
          business_type: string
          chatbot_purpose: string
          api_endpoints?: string | null
          training_data: string
          contact_email: string
          status?: 'pending' | 'approved' | 'rejected'
        }
        Update: {
          id?: string
          created_at?: string
          business_name?: string
          business_type?: string
          chatbot_purpose?: string
          api_endpoints?: string | null
          training_data?: string
          contact_email?: string
          status?: 'pending' | 'approved' | 'rejected'
        }
      }
      menu_items: {
        Row: {
          id: string
          created_at: string
          name: string
          price: number
          description: string
          category: string
          available: boolean
          restaurant_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          price: number
          description: string
          category: string
          available?: boolean
          restaurant_id: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          price?: number
          description?: string
          category?: string
          available?: boolean
          restaurant_id?: string
        }
      }
      menu_screens: {
        Row: {
          id: string
          created_at: string
          name: string
          status: 'connected' | 'disconnected'
          frozen: boolean
          restaurant_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          status?: 'connected' | 'disconnected'
          frozen?: boolean
          restaurant_id: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          status?: 'connected' | 'disconnected'
          frozen?: boolean
          restaurant_id?: string
        }
      }
      photos: {
        Row: {
          id: string
          created_at: string
          url: string
          score: number
          selected: boolean
          use_case: 'business' | 'personal' | 'dating'
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          url: string
          score?: number
          selected?: boolean
          use_case: 'business' | 'personal' | 'dating'
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          url?: string
          score?: number
          selected?: boolean
          use_case?: 'business' | 'personal' | 'dating'
          user_id?: string
        }
      }
      shuls: {
        Row: {
          id: string
          created_at: string
          name: string
          address: string
          website: string | null
          contact_email: string
          approved: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          address: string
          website?: string | null
          contact_email: string
          approved?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          address?: string
          website?: string | null
          contact_email?: string
          approved?: boolean
        }
      }
      zmanim: {
        Row: {
          id: string
          shul_id: string
          date: string
          shacharis: string
          mincha: string
          maariv: string
        }
        Insert: {
          id?: string
          shul_id: string
          date: string
          shacharis: string
          mincha: string
          maariv: string
        }
        Update: {
          id?: string
          shul_id?: string
          date?: string
          shacharis?: string
          mincha?: string
          maariv?: string
        }
      }
      shiurim: {
        Row: {
          id: string
          shul_id: string
          title: string
          speaker: string
          time: string
          description: string | null
        }
        Insert: {
          id?: string
          shul_id: string
          title: string
          speaker: string
          time: string
          description?: string | null
        }
        Update: {
          id?: string
          shul_id?: string
          title?: string
          speaker?: string
          time?: string
          description?: string | null
        }
      }
      resumes: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
          personal_info: any
          experience: any
          education: any
          skills: string[]
          view_mode: 'professional' | 'personal' | 'both'
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          updated_at?: string
          personal_info: any
          experience: any
          education: any
          skills?: string[]
          view_mode?: 'professional' | 'personal' | 'both'
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          personal_info?: any
          experience?: any
          education?: any
          skills?: string[]
          view_mode?: 'professional' | 'personal' | 'both'
        }
      }
      kosher_launcher_profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          owner_github_id: number
          owner_login: string
          profile_name: string
          platform: 'android' | 'ios' | 'shared'
          strict_mode: boolean
          install_code: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          owner_github_id: number
          owner_login: string
          profile_name?: string
          platform?: 'android' | 'ios' | 'shared'
          strict_mode?: boolean
          install_code?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          owner_github_id?: number
          owner_login?: string
          profile_name?: string
          platform?: 'android' | 'ios' | 'shared'
          strict_mode?: boolean
          install_code?: string | null
        }
      }
      kosher_launcher_apps: {
        Row: {
          id: string
          created_at: string
          profile_id: string
          app_name: string
          app_id: string | null
          category: string
          is_enabled: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          profile_id: string
          app_name: string
          app_id?: string | null
          category?: string
          is_enabled?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          profile_id?: string
          app_name?: string
          app_id?: string | null
          category?: string
          is_enabled?: boolean
        }
      }
    }
  }
}