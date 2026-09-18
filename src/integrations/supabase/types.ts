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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      areas: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_demo: boolean
          name: string
          sort_order: number
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_demo?: boolean
          name: string
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_demo?: boolean
          name?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          new_data: Json | null
          notes: string | null
          previous_data: Json | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          new_data?: Json | null
          notes?: string | null
          previous_data?: Json | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          new_data?: Json | null
          notes?: string | null
          previous_data?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          created_at: string
          description: string | null
          ends_at: string | null
          id: string
          is_demo: boolean
          name: string
          starts_at: string | null
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          is_demo?: boolean
          name: string
          starts_at?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          is_demo?: boolean
          name?: string
          starts_at?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Relationships: []
      }
      commercial_conditions: {
        Row: {
          allowed_roles: Database["public"]["Enums"]["app_role"][]
          campaign_id: string | null
          course_id: string | null
          course_price_id: string | null
          created_at: string
          discount_rule_id: string | null
          id: string
          installment_option_id: string | null
          is_demo: boolean
          name: string
          payment_method_id: string | null
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          validity_minutes: number
        }
        Insert: {
          allowed_roles?: Database["public"]["Enums"]["app_role"][]
          campaign_id?: string | null
          course_id?: string | null
          course_price_id?: string | null
          created_at?: string
          discount_rule_id?: string | null
          id?: string
          installment_option_id?: string | null
          is_demo?: boolean
          name: string
          payment_method_id?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          validity_minutes?: number
        }
        Update: {
          allowed_roles?: Database["public"]["Enums"]["app_role"][]
          campaign_id?: string | null
          course_id?: string | null
          course_price_id?: string | null
          created_at?: string
          discount_rule_id?: string | null
          id?: string
          installment_option_id?: string | null
          is_demo?: boolean
          name?: string
          payment_method_id?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          validity_minutes?: number
        }
        Relationships: [
          {
            foreignKeyName: "commercial_conditions_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commercial_conditions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commercial_conditions_course_price_id_fkey"
            columns: ["course_price_id"]
            isOneToOne: false
            referencedRelation: "course_prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commercial_conditions_discount_rule_id_fkey"
            columns: ["discount_rule_id"]
            isOneToOne: false
            referencedRelation: "discount_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commercial_conditions_installment_option_id_fkey"
            columns: ["installment_option_id"]
            isOneToOne: false
            referencedRelation: "installment_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commercial_conditions_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
        ]
      }
      course_prices: {
        Row: {
          amount: number
          course_id: string
          created_at: string
          ends_at: string | null
          id: string
          is_demo: boolean
          name: string
          starts_at: string | null
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          course_id: string
          created_at?: string
          ends_at?: string | null
          id?: string
          is_demo?: boolean
          name: string
          starts_at?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          course_id?: string
          created_at?: string
          ends_at?: string | null
          id?: string
          is_demo?: boolean
          name?: string
          starts_at?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_prices_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          area_id: string
          created_at: string
          description: string | null
          id: string
          is_demo: boolean
          modality: string
          name: string
          sort_order: number
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          workload_hours: number
        }
        Insert: {
          area_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_demo?: boolean
          modality: string
          name: string
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          workload_hours: number
        }
        Update: {
          area_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_demo?: boolean
          modality?: string
          name?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          workload_hours?: number
        }
        Relationships: [
          {
            foreignKeyName: "courses_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_stages: {
        Row: {
          color_key: string
          created_at: string
          id: string
          is_demo: boolean
          is_lost: boolean
          is_won: boolean
          name: string
          sort_order: number
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
        }
        Insert: {
          color_key?: string
          created_at?: string
          id?: string
          is_demo?: boolean
          is_lost?: boolean
          is_won?: boolean
          name: string
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Update: {
          color_key?: string
          created_at?: string
          id?: string
          is_demo?: boolean
          is_lost?: boolean
          is_won?: boolean
          name?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Relationships: []
      }
      discount_courses: {
        Row: {
          course_id: string
          discount_rule_id: string
        }
        Insert: {
          course_id: string
          discount_rule_id: string
        }
        Update: {
          course_id?: string
          discount_rule_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discount_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discount_courses_discount_rule_id_fkey"
            columns: ["discount_rule_id"]
            isOneToOne: false
            referencedRelation: "discount_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      discount_payment_methods: {
        Row: {
          discount_rule_id: string
          payment_method_id: string
        }
        Insert: {
          discount_rule_id: string
          payment_method_id: string
        }
        Update: {
          discount_rule_id?: string
          payment_method_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discount_payment_methods_discount_rule_id_fkey"
            columns: ["discount_rule_id"]
            isOneToOne: false
            referencedRelation: "discount_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discount_payment_methods_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
        ]
      }
      discount_rules: {
        Row: {
          allowed_roles: Database["public"]["Enums"]["app_role"][]
          created_at: string
          discount_type: Database["public"]["Enums"]["discount_type"]
          ends_at: string | null
          id: string
          is_demo: boolean
          maximum_amount: number | null
          minimum_amount: number | null
          name: string
          recommended: boolean
          requires_approval: boolean
          starts_at: string | null
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          value: number
        }
        Insert: {
          allowed_roles?: Database["public"]["Enums"]["app_role"][]
          created_at?: string
          discount_type: Database["public"]["Enums"]["discount_type"]
          ends_at?: string | null
          id?: string
          is_demo?: boolean
          maximum_amount?: number | null
          minimum_amount?: number | null
          name: string
          recommended?: boolean
          requires_approval?: boolean
          starts_at?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          value: number
        }
        Update: {
          allowed_roles?: Database["public"]["Enums"]["app_role"][]
          created_at?: string
          discount_type?: Database["public"]["Enums"]["discount_type"]
          ends_at?: string | null
          id?: string
          is_demo?: boolean
          maximum_amount?: number | null
          minimum_amount?: number | null
          name?: string
          recommended?: boolean
          requires_approval?: boolean
          starts_at?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          value?: number
        }
        Relationships: []
      }
      followups: {
        Row: {
          completed_at: string | null
          created_at: string
          due_at: string
          id: string
          notes: string | null
          owner_user_id: string
          proposal_id: string | null
          status: Database["public"]["Enums"]["followup_status"]
          student_id: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          due_at: string
          id?: string
          notes?: string | null
          owner_user_id: string
          proposal_id?: string | null
          status?: Database["public"]["Enums"]["followup_status"]
          student_id: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          due_at?: string
          id?: string
          notes?: string | null
          owner_user_id?: string
          proposal_id?: string | null
          status?: Database["public"]["Enums"]["followup_status"]
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "followups_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "followups_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      installment_options: {
        Row: {
          created_at: string
          id: string
          installments: number
          interest_rate: number
          is_demo: boolean
          minimum_amount: number | null
          payment_method_id: string
          sort_order: number
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          installments: number
          interest_rate?: number
          is_demo?: boolean
          minimum_amount?: number | null
          payment_method_id: string
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          installments?: number
          interest_rate?: number
          is_demo?: boolean
          minimum_amount?: number | null
          payment_method_id?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "installment_options_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          created_at: string
          id: string
          is_demo: boolean
          name: string
          sort_order: number
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_demo?: boolean
          name: string
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_demo?: boolean
          name?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Relationships: []
      }
      proposal_events: {
        Row: {
          action: string
          created_at: string
          id: string
          new_data: Json | null
          notes: string | null
          previous_data: Json | null
          proposal_id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          new_data?: Json | null
          notes?: string | null
          previous_data?: Json | null
          proposal_id: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          new_data?: Json | null
          notes?: string | null
          previous_data?: Json | null
          proposal_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposal_events_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      proposal_timer_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          new_valid_until: string | null
          notes: string | null
          previous_valid_until: string | null
          proposal_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          new_valid_until?: string | null
          notes?: string | null
          previous_valid_until?: string | null
          proposal_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          new_valid_until?: string | null
          notes?: string | null
          previous_valid_until?: string | null
          proposal_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposal_timer_events_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      proposals: {
        Row: {
          area_id: string | null
          area_name_snapshot: string
          condition_id: string | null
          course_id: string | null
          course_name_snapshot: string
          created_at: string
          discount_amount: number
          discount_name_snapshot: string | null
          discount_type_snapshot:
            | Database["public"]["Enums"]["discount_type"]
            | null
          discount_value_snapshot: number
          final_price: number
          id: string
          installment_amount: number
          installments: number
          modality_snapshot: string | null
          notes: string | null
          original_price: number
          payment_method_snapshot: string
          seller_user_id: string
          status: Database["public"]["Enums"]["proposal_status"]
          student_id: string
          timer_status: Database["public"]["Enums"]["timer_status"]
          updated_at: string
          valid_until: string | null
          workload_snapshot: number | null
        }
        Insert: {
          area_id?: string | null
          area_name_snapshot: string
          condition_id?: string | null
          course_id?: string | null
          course_name_snapshot: string
          created_at?: string
          discount_amount?: number
          discount_name_snapshot?: string | null
          discount_type_snapshot?:
            | Database["public"]["Enums"]["discount_type"]
            | null
          discount_value_snapshot?: number
          final_price: number
          id?: string
          installment_amount: number
          installments?: number
          modality_snapshot?: string | null
          notes?: string | null
          original_price: number
          payment_method_snapshot: string
          seller_user_id: string
          status?: Database["public"]["Enums"]["proposal_status"]
          student_id: string
          timer_status?: Database["public"]["Enums"]["timer_status"]
          updated_at?: string
          valid_until?: string | null
          workload_snapshot?: number | null
        }
        Update: {
          area_id?: string | null
          area_name_snapshot?: string
          condition_id?: string | null
          course_id?: string | null
          course_name_snapshot?: string
          created_at?: string
          discount_amount?: number
          discount_name_snapshot?: string | null
          discount_type_snapshot?:
            | Database["public"]["Enums"]["discount_type"]
            | null
          discount_value_snapshot?: number
          final_price?: number
          id?: string
          installment_amount?: number
          installments?: number
          modality_snapshot?: string | null
          notes?: string | null
          original_price?: number
          payment_method_snapshot?: string
          seller_user_id?: string
          status?: Database["public"]["Enums"]["proposal_status"]
          student_id?: string
          timer_status?: Database["public"]["Enums"]["timer_status"]
          updated_at?: string
          valid_until?: string | null
          workload_snapshot?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "proposals_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_condition_id_fkey"
            columns: ["condition_id"]
            isOneToOne: false
            referencedRelation: "commercial_conditions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_assignments: {
        Row: {
          assigned_by: string
          created_at: string
          ended_at: string | null
          id: string
          owner_user_id: string | null
          reason: string | null
          started_at: string
          student_id: string
          updated_at: string
        }
        Insert: {
          assigned_by: string
          created_at?: string
          ended_at?: string | null
          id?: string
          owner_user_id?: string | null
          reason?: string | null
          started_at?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          assigned_by?: string
          created_at?: string
          ended_at?: string | null
          id?: string
          owner_user_id?: string | null
          reason?: string | null
          started_at?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_assignments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_interactions: {
        Row: {
          created_at: string
          id: string
          kind: string
          notes: string | null
          student_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind: string
          notes?: string | null
          student_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          notes?: string | null
          student_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_interactions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          created_at: string
          created_by: string
          crm_stage_id: string | null
          current_owner_id: string | null
          email: string | null
          id: string
          is_demo: boolean
          name: string
          notes: string | null
          source: string | null
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          whatsapp: string
        }
        Insert: {
          created_at?: string
          created_by: string
          crm_stage_id?: string | null
          current_owner_id?: string | null
          email?: string | null
          id?: string
          is_demo?: boolean
          name: string
          notes?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          whatsapp: string
        }
        Update: {
          created_at?: string
          created_by?: string
          crm_stage_id?: string | null
          current_owner_id?: string | null
          email?: string | null
          id?: string
          is_demo?: boolean
          name?: string
          notes?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          whatsapp?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_crm_stage_id_fkey"
            columns: ["crm_stage_id"]
            isOneToOne: false
            referencedRelation: "crm_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          active: boolean
          created_at: string
          id: string
          joined_at: string
          team_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          joined_at?: string
          team_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          joined_at?: string
          team_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          description: string | null
          id: string
          manager_user_id: string | null
          name: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          manager_user_id?: string | null
          name: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          manager_user_id?: string | null
          name?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          active: boolean
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "manager" | "seller"
      discount_type: "percentage" | "fixed"
      followup_status: "pending" | "completed" | "cancelled"
      proposal_status:
        | "draft"
        | "sent"
        | "viewed"
        | "awaiting_response"
        | "negotiation"
        | "approved"
        | "refused"
        | "expired"
        | "cancelled"
      record_status: "active" | "inactive"
      timer_status: "active" | "paused" | "expired" | "completed" | "cancelled"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "manager", "seller"],
      discount_type: ["percentage", "fixed"],
      followup_status: ["pending", "completed", "cancelled"],
      proposal_status: [
        "draft",
        "sent",
        "viewed",
        "awaiting_response",
        "negotiation",
        "approved",
        "refused",
        "expired",
        "cancelled",
      ],
      record_status: ["active", "inactive"],
      timer_status: ["active", "paused", "expired", "completed", "cancelled"],
    },
  },
} as const
