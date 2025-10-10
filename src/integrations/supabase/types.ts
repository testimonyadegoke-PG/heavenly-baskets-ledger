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
      budget_template_items: {
        Row: {
          category_id: string | null
          created_at: string
          id: string
          percentage: number
          template_id: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          id?: string
          percentage: number
          template_id?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          id?: string
          percentage?: number
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "budget_template_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_template_items_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "budget_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      budget_templates: {
        Row: {
          created_at: string
          description: string | null
          family_id: string | null
          id: string
          name: string
          template_type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          family_id?: string | null
          id?: string
          name: string
          template_type?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          family_id?: string | null
          id?: string
          name?: string
          template_type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      budgets: {
        Row: {
          budget_type: string
          budgeted_amount: number
          category_color: string
          category_icon: string
          category_id: string
          category_name: string
          created_at: string
          family_id: string | null
          id: string
          month: number
          updated_at: string
          user_id: string
          year: number
        }
        Insert: {
          budget_type?: string
          budgeted_amount: number
          category_color: string
          category_icon: string
          category_id: string
          category_name: string
          created_at?: string
          family_id?: string | null
          id?: string
          month: number
          updated_at?: string
          user_id: string
          year: number
        }
        Update: {
          budget_type?: string
          budgeted_amount?: number
          category_color?: string
          category_icon?: string
          category_id?: string
          category_name?: string
          created_at?: string
          family_id?: string | null
          id?: string
          month?: number
          updated_at?: string
          user_id?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "budgets_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          category_type: string
          color: string
          created_at: string
          family_id: string | null
          icon: string
          id: string
          is_default: boolean | null
          name: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category_type?: string
          color?: string
          created_at?: string
          family_id?: string | null
          icon?: string
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category_type?: string
          color?: string
          created_at?: string
          family_id?: string | null
          icon?: string
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category_id: string
          created_at: string
          date: string
          description: string
          expense_type: string
          family_id: string | null
          id: string
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          category_id: string
          created_at?: string
          date: string
          description: string
          expense_type?: string
          family_id?: string | null
          id?: string
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category_id?: string
          created_at?: string
          date?: string
          description?: string
          expense_type?: string
          family_id?: string | null
          id?: string
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      families: {
        Row: {
          created_at: string
          created_by: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      family_invitations: {
        Row: {
          created_at: string
          expires_at: string
          family_id: string
          id: string
          invited_by: string
          invited_email: string
          role: string
          status: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          family_id: string
          id?: string
          invited_by: string
          invited_email: string
          role?: string
          status?: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          family_id?: string
          id?: string
          invited_by?: string
          invited_email?: string
          role?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_invitations_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      family_members: {
        Row: {
          family_id: string
          id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          family_id: string
          id?: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          family_id?: string
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_members_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      heavens_blessings: {
        Row: {
          amount: number
          created_at: string
          date: string
          family_id: string | null
          id: string
          income_type: string
          notes: string | null
          source: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          date: string
          family_id?: string | null
          id?: string
          income_type?: string
          notes?: string | null
          source: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          family_id?: string | null
          id?: string
          income_type?: string
          notes?: string | null
          source?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "heavens_blessings_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      insights: {
        Row: {
          confidence_score: number
          created_at: string
          data_period_end: string
          data_period_start: string
          description: string
          family_id: string | null
          id: string
          is_active: boolean
          recommendations: Json
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          confidence_score?: number
          created_at?: string
          data_period_end: string
          data_period_start: string
          description: string
          family_id?: string | null
          id?: string
          is_active?: boolean
          recommendations?: Json
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          confidence_score?: number
          created_at?: string
          data_period_end?: string
          data_period_start?: string
          description?: string
          family_id?: string | null
          id?: string
          is_active?: boolean
          recommendations?: Json
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          category: string
          created_at: string
          id: string
          is_read: boolean
          message: string
          metadata: Json | null
          read: boolean
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          category?: string
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          metadata?: Json | null
          read?: boolean
          title: string
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          category?: string
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          metadata?: Json | null
          read?: boolean
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sample_budget_template_items: {
        Row: {
          category_icon: string
          category_name: string
          created_at: string | null
          id: string
          percentage: number
          template_id: string
        }
        Insert: {
          category_icon?: string
          category_name: string
          created_at?: string | null
          id?: string
          percentage: number
          template_id: string
        }
        Update: {
          category_icon?: string
          category_name?: string
          created_at?: string | null
          id?: string
          percentage?: number
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sample_budget_template_items_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "sample_budget_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      sample_budget_templates: {
        Row: {
          created_at: string | null
          description: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_family: {
        Args: { p_name: string }
        Returns: {
          created_at: string
          created_by: string
          id: string
          name: string
          updated_at: string
        }
      }
      delete_expired_notifications: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      mask_email: {
        Args: { email: string; family_id: string; user_id: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
