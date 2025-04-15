export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          address: string | null
          contact_info: string | null
          customer_id: number
          name: string
        }
        Insert: {
          address?: string | null
          contact_info?: string | null
          customer_id?: number
          name: string
        }
        Update: {
          address?: string | null
          contact_info?: string | null
          customer_id?: number
          name?: string
        }
        Relationships: []
      }
      diseaseoutbreakpredictions: {
        Row: {
          confidence_score: number | null
          predicted_disease: string | null
          prediction_date: string | null
          prediction_id: number
        }
        Insert: {
          confidence_score?: number | null
          predicted_disease?: string | null
          prediction_date?: string | null
          prediction_id?: number
        }
        Update: {
          confidence_score?: number | null
          predicted_disease?: string | null
          prediction_date?: string | null
          prediction_id?: number
        }
        Relationships: []
      }
      inventorylogs: {
        Row: {
          change_type: string | null
          changed_by: number | null
          log_date: string | null
          log_id: number
          medicine_id: number | null
          quantity_changed: number | null
        }
        Insert: {
          change_type?: string | null
          changed_by?: number | null
          log_date?: string | null
          log_id?: number
          medicine_id?: number | null
          quantity_changed?: number | null
        }
        Update: {
          change_type?: string | null
          changed_by?: number | null
          log_date?: string | null
          log_id?: number
          medicine_id?: number | null
          quantity_changed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventorylogs_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "inventorylogs_medicine_id_fkey"
            columns: ["medicine_id"]
            isOneToOne: false
            referencedRelation: "medicines"
            referencedColumns: ["medicine_id"]
          },
        ]
      }
      medicinerecommendations: {
        Row: {
          medicine_id: number | null
          prediction_id: number | null
          recommendation_id: number
          recommendation_reason: string | null
        }
        Insert: {
          medicine_id?: number | null
          prediction_id?: number | null
          recommendation_id?: number
          recommendation_reason?: string | null
        }
        Update: {
          medicine_id?: number | null
          prediction_id?: number | null
          recommendation_id?: number
          recommendation_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medicinerecommendations_medicine_id_fkey"
            columns: ["medicine_id"]
            isOneToOne: false
            referencedRelation: "medicines"
            referencedColumns: ["medicine_id"]
          },
          {
            foreignKeyName: "medicinerecommendations_prediction_id_fkey"
            columns: ["prediction_id"]
            isOneToOne: false
            referencedRelation: "diseaseoutbreakpredictions"
            referencedColumns: ["prediction_id"]
          },
        ]
      }
      medicines: {
        Row: {
          category: string | null
          expiry_date: string | null
          medicine_id: number
          name: string
          price: number
          stock_quantity: number | null
        }
        Insert: {
          category?: string | null
          expiry_date?: string | null
          medicine_id?: number
          name: string
          price: number
          stock_quantity?: number | null
        }
        Update: {
          category?: string | null
          expiry_date?: string | null
          medicine_id?: number
          name?: string
          price?: number
          stock_quantity?: number | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_by: number | null
          order_date: string | null
          order_id: number
          supplier_id: number | null
          total_amount: number | null
        }
        Insert: {
          created_by?: number | null
          order_date?: string | null
          order_id?: number
          supplier_id?: number | null
          total_amount?: number | null
        }
        Update: {
          created_by?: number | null
          order_date?: string | null
          order_id?: number
          supplier_id?: number | null
          total_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["supplier_id"]
          },
        ]
      }
      paymenttransactions: {
        Row: {
          amount_paid: number | null
          payment_date: string | null
          payment_method: string | null
          sale_id: number | null
          transaction_id: number
        }
        Insert: {
          amount_paid?: number | null
          payment_date?: string | null
          payment_method?: string | null
          sale_id?: number | null
          transaction_id?: number
        }
        Update: {
          amount_paid?: number | null
          payment_date?: string | null
          payment_method?: string | null
          sale_id?: number | null
          transaction_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "paymenttransactions_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["sale_id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          customer_id: number | null
          date_issued: string | null
          medicine_id: number | null
          prescribed_by: string | null
          prescription_id: number
        }
        Insert: {
          customer_id?: number | null
          date_issued?: string | null
          medicine_id?: number | null
          prescribed_by?: string | null
          prescription_id?: number
        }
        Update: {
          customer_id?: number | null
          date_issued?: string | null
          medicine_id?: number | null
          prescribed_by?: string | null
          prescription_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "prescriptions_medicine_id_fkey"
            columns: ["medicine_id"]
            isOneToOne: false
            referencedRelation: "medicines"
            referencedColumns: ["medicine_id"]
          },
        ]
      }
      reports: {
        Row: {
          content: string | null
          generated_by: number | null
          report_date: string | null
          report_id: number
          report_type: string | null
        }
        Insert: {
          content?: string | null
          generated_by?: number | null
          report_date?: string | null
          report_id?: number
          report_type?: string | null
        }
        Update: {
          content?: string | null
          generated_by?: number | null
          report_date?: string | null
          report_id?: number
          report_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_generated_by_fkey"
            columns: ["generated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      saledetails: {
        Row: {
          medicine_id: number | null
          price: number | null
          quantity: number | null
          sale_detail_id: number
          sale_id: number | null
        }
        Insert: {
          medicine_id?: number | null
          price?: number | null
          quantity?: number | null
          sale_detail_id?: number
          sale_id?: number | null
        }
        Update: {
          medicine_id?: number | null
          price?: number | null
          quantity?: number | null
          sale_detail_id?: number
          sale_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "saledetails_medicine_id_fkey"
            columns: ["medicine_id"]
            isOneToOne: false
            referencedRelation: "medicines"
            referencedColumns: ["medicine_id"]
          },
          {
            foreignKeyName: "saledetails_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["sale_id"]
          },
        ]
      }
      sales: {
        Row: {
          customer_id: number | null
          sale_date: string | null
          sale_id: number
        }
        Insert: {
          customer_id?: number | null
          sale_date?: string | null
          sale_id?: number
        }
        Update: {
          customer_id?: number | null
          sale_date?: string | null
          sale_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          contact_info: string | null
          name: string
          supplier_id: number
        }
        Insert: {
          address?: string | null
          contact_info?: string | null
          name: string
          supplier_id?: number
        }
        Update: {
          address?: string | null
          contact_info?: string | null
          name?: string
          supplier_id?: number
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          password_hash: string
          role: string
          user_id: number
          username: string
        }
        Insert: {
          created_at?: string | null
          password_hash: string
          role: string
          user_id?: number
          username: string
        }
        Update: {
          created_at?: string | null
          password_hash?: string
          role?: string
          user_id?: number
          username?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
