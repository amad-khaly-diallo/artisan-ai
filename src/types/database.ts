export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          business_name: string | null
          phone: string | null
          whatsapp_number: string | null
          bio: string | null
          services: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          business_name?: string | null
          phone?: string | null
          whatsapp_number?: string | null
          bio?: string | null
          services?: string[] | null
        }
        Update: {
          full_name?: string | null
          business_name?: string | null
          phone?: string | null
          whatsapp_number?: string | null
          bio?: string | null
          services?: string[] | null
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          plan: 'starter' | 'pro' | 'team'
          status: 'active' | 'canceled' | 'past_due' | 'trialing'
          current_period_end: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          plan: 'starter' | 'pro' | 'team'
          status: 'active' | 'canceled' | 'past_due' | 'trialing'
          current_period_end?: string | null
        }
        Update: {
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          plan?: 'starter' | 'pro' | 'team'
          status?: 'active' | 'canceled' | 'past_due' | 'trialing'
          current_period_end?: string | null
        }
      }
      conversations: {
        Row: {
          id: string
          artisan_id: string
          client_phone: string
          client_name: string | null
          status: 'open' | 'closed'
          last_message_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          artisan_id: string
          client_phone: string
          client_name?: string | null
          status?: 'open' | 'closed'
          last_message_at?: string | null
        }
        Update: {
          client_name?: string | null
          status?: 'open' | 'closed'
          last_message_at?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          from_type: 'client' | 'ai' | 'artisan'
          content: string
          whatsapp_sid: string | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          from_type: 'client' | 'ai' | 'artisan'
          content: string
          whatsapp_sid?: string | null
        }
        Update: never
      }
      notifications: {
        Row: {
          id: string
          artisan_id: string
          type: 'new_message' | 'new_conversation'
          message: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          artisan_id: string
          type: 'new_message' | 'new_conversation'
          message: string
          read?: boolean
        }
        Update: {
          read?: boolean
        }
      }
    }
  }
}

// Raccourcis utiles
export type Profile      = Database['public']['Tables']['profiles']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type Conversation = Database['public']['Tables']['conversations']['Row']
export type Message      = Database['public']['Tables']['messages']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
