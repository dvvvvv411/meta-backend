export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      account_audit_logs: {
        Row: {
          account_id: string
          action: string
          created_at: string | null
          details: Json | null
          id: string
          user_id: string
        }
        Insert: {
          account_id: string
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          user_id: string
        }
        Update: {
          account_id?: string
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_audit_logs_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      accounts: {
        Row: {
          account_status: Database["public"]["Enums"]["account_status"] | null
          assigned_to: string | null
          auto_renew: boolean | null
          balance_eur: number | null
          balance_usdt: number | null
          branding_id: string | null
          created_at: string | null
          expire_at: string | null
          id: string
          invoice_number: string | null
          monthly_budget: number | null
          name: string
          platform: string
          price_paid: number | null
          start_date: string | null
          status: string
          updated_at: string | null
          updated_by: string | null
          user_id: string | null
        }
        Insert: {
          account_status?: Database["public"]["Enums"]["account_status"] | null
          assigned_to?: string | null
          auto_renew?: boolean | null
          balance_eur?: number | null
          balance_usdt?: number | null
          branding_id?: string | null
          created_at?: string | null
          expire_at?: string | null
          id?: string
          invoice_number?: string | null
          monthly_budget?: number | null
          name: string
          platform?: string
          price_paid?: number | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string | null
        }
        Update: {
          account_status?: Database["public"]["Enums"]["account_status"] | null
          assigned_to?: string | null
          auto_renew?: boolean | null
          balance_eur?: number | null
          balance_usdt?: number | null
          branding_id?: string | null
          created_at?: string | null
          expire_at?: string | null
          id?: string
          invoice_number?: string | null
          monthly_budget?: number | null
          name?: string
          platform?: string
          price_paid?: number | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_branding_id_fkey"
            columns: ["branding_id"]
            isOneToOne: false
            referencedRelation: "brandings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_events: {
        Row: {
          created_at: string | null
          description: string | null
          event_type: string
          id: string
          metadata: Json | null
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      brandings: {
        Row: {
          created_at: string | null
          created_by: string | null
          domain: string
          email: string
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          primary_color: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          domain: string
          email: string
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          primary_color?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          domain?: string
          email?: string
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          primary_color?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      campaign_drafts: {
        Row: {
          account_id: string
          ad_data: Json
          adset_data: Json
          buying_type: string
          campaign_data: Json
          created_at: string | null
          id: string
          name: string
          objective: string
          setup: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_id: string
          ad_data?: Json
          adset_data?: Json
          buying_type?: string
          campaign_data?: Json
          created_at?: string | null
          id?: string
          name?: string
          objective?: string
          setup?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_id?: string
          ad_data?: Json
          adset_data?: Json
          buying_type?: string
          campaign_data?: Json
          created_at?: string | null
          id?: string
          name?: string
          objective?: string
          setup?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          balance_eur: number | null
          company_name: string | null
          created_at: string | null
          email: string
          id: string
        }
        Insert: {
          balance_eur?: number | null
          company_name?: string | null
          created_at?: string | null
          email: string
          id: string
        }
        Update: {
          balance_eur?: number | null
          company_name?: string | null
          created_at?: string | null
          email?: string
          id?: string
        }
        Relationships: []
      }
      ticket_attachments: {
        Row: {
          created_at: string | null
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          message_id: string | null
          ticket_id: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          message_id?: string | null
          ticket_id: string
          uploaded_by: string
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          message_id?: string | null
          ticket_id?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "ticket_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_attachments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_internal: boolean | null
          ticket_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          ticket_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          ticket_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          assigned_to: string | null
          closed_at: string | null
          created_at: string | null
          description: string | null
          id: string
          is_read: boolean | null
          last_reply_at: string | null
          priority: string | null
          sla_due_at: string | null
          status: string | null
          subject: string
          ticket_priority: Database["public"]["Enums"]["ticket_priority"] | null
          ticket_status: Database["public"]["Enums"]["ticket_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          closed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_read?: boolean | null
          last_reply_at?: string | null
          priority?: string | null
          sla_due_at?: string | null
          status?: string | null
          subject: string
          ticket_priority?:
            | Database["public"]["Enums"]["ticket_priority"]
            | null
          ticket_status?: Database["public"]["Enums"]["ticket_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          closed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_read?: boolean | null
          last_reply_at?: string | null
          priority?: string | null
          sla_due_at?: string | null
          status?: string | null
          subject?: string
          ticket_priority?:
            | Database["public"]["Enums"]["ticket_priority"]
            | null
          ticket_status?: Database["public"]["Enums"]["ticket_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          account_id: string | null
          amount: number
          coin_type: string | null
          confirmations: number | null
          confirmations_required: number | null
          created_at: string | null
          currency: string | null
          description: string | null
          expires_at: string | null
          fee_amount: number | null
          gross_amount: number | null
          id: string
          network: string | null
          nowpayments_id: string | null
          pay_address: string | null
          pay_amount: number | null
          pay_currency: string | null
          payment_status: string | null
          status: string | null
          tx_hash: string | null
          type: string
          user_id: string
          wallet_address: string | null
        }
        Insert: {
          account_id?: string | null
          amount: number
          coin_type?: string | null
          confirmations?: number | null
          confirmations_required?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          expires_at?: string | null
          fee_amount?: number | null
          gross_amount?: number | null
          id?: string
          network?: string | null
          nowpayments_id?: string | null
          pay_address?: string | null
          pay_amount?: number | null
          pay_currency?: string | null
          payment_status?: string | null
          status?: string | null
          tx_hash?: string | null
          type?: string
          user_id: string
          wallet_address?: string | null
        }
        Update: {
          account_id?: string | null
          amount?: number
          coin_type?: string | null
          confirmations?: number | null
          confirmations_required?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          expires_at?: string | null
          fee_amount?: number | null
          gross_amount?: number | null
          id?: string
          network?: string | null
          nowpayments_id?: string | null
          pay_address?: string | null
          pay_amount?: number | null
          pay_currency?: string | null
          payment_status?: string | null
          status?: string | null
          tx_hash?: string | null
          type?: string
          user_id?: string
          wallet_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      account_status: "active" | "expired" | "canceled" | "suspended"
      app_role: "admin" | "werbetreibender"
      ticket_priority: "low" | "normal" | "high" | "urgent"
      ticket_status: "open" | "in_progress" | "waiting" | "resolved" | "closed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_status: ["active", "expired", "canceled", "suspended"],
      app_role: ["admin", "werbetreibender"],
      ticket_priority: ["low", "normal", "high", "urgent"],
      ticket_status: ["open", "in_progress", "waiting", "resolved", "closed"],
    },
  },
} as const
