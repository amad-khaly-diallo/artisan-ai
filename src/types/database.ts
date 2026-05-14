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
          created_at?: string
          updated_at?: string
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
        Relationships: []
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
          created_at?: string
        }
        Update: {
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          plan?: 'starter' | 'pro' | 'team'
          status?: 'active' | 'canceled' | 'past_due' | 'trialing'
          current_period_end?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'subscriptions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
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
          created_at?: string
        }
        Update: {
          client_name?: string | null
          status?: 'open' | 'closed'
          last_message_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'conversations_artisan_id_fkey'
            columns: ['artisan_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
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
          created_at?: string
        }
        Update: {
          whatsapp_sid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'messages_conversation_id_fkey'
            columns: ['conversation_id']
            isOneToOne: false
            referencedRelation: 'conversations'
            referencedColumns: ['id']
          }
        ]
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
          created_at?: string
        }
        Update: {
          read?: boolean
        }
        Relationships: [
          {
            foreignKeyName: 'notifications_artisan_id_fkey'
            columns: ['artisan_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

// Raccourcis utiles
export type Profile      = Database['public']['Tables']['profiles']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type Conversation = Database['public']['Tables']['conversations']['Row']
export type Message      = Database['public']['Tables']['messages']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
