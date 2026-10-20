export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      chat_messages: {
        Row: {
          ai_message_id: string | null;
          created_at: string;
          id: string;
          message: Json;
          role: string;
          thread_id: string;
          user_id: string;
        };
        Insert: {
          ai_message_id?: string | null;
          created_at?: string;
          id?: string;
          message: Json;
          role: string;
          thread_id: string;
          user_id: string;
        };
        Update: {
          ai_message_id?: string | null;
          created_at?: string;
          id?: string;
          message?: Json;
          role?: string;
          thread_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chat_messages_thread_id_fkey";
            columns: ["thread_id"];
            isOneToOne: false;
            referencedRelation: "chat_threads";
            referencedColumns: ["id"];
          },
        ];
      };
      chat_threads: {
        Row: {
          created_at: string;
          id: string;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          title?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      contract_analyses: {
        Row: {
          analysis_result: Json;
          created_at: string;
          file_name: string;
          file_path: string;
          file_size: number;
          high_risk_count: number;
          id: string;
          low_risk_count: number;
          medium_risk_count: number;
          mime_type: string;
          risk_percentage: number;
          risk_score: string;
          summary: string;
          total_clauses: number;
          user_id: string;
        };
        Insert: {
          analysis_result?: Json;
          created_at?: string;
          file_name: string;
          file_path: string;
          file_size: number;
          high_risk_count?: number;
          id?: string;
          low_risk_count?: number;
          medium_risk_count?: number;
          mime_type: string;
          risk_percentage: number;
          risk_score: string;
          summary: string;
          total_clauses?: number;
          user_id: string;
        };
        Update: {
          analysis_result?: Json;
          created_at?: string;
          file_name?: string;
          file_path?: string;
          file_size?: number;
          high_risk_count?: number;
          id?: string;
          low_risk_count?: number;
          medium_risk_count?: number;
          mime_type?: string;
          risk_percentage?: number;
          risk_score?: string;
          summary?: string;
          total_clauses?: number;
          user_id?: string;
        };
        Relationships: [];
      };
      document_tags: {
        Row: {
          created_at: string;
          document_id: string;
          id: string;
          tag_name: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          document_id: string;
          id?: string;
          tag_name: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          document_id?: string;
          id?: string;
          tag_name?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "document_tags_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "documents";
            referencedColumns: ["id"];
          },
        ];
      };
      document_templates: {
        Row: {
          category: string;
          created_at: string;
          created_by: string;
          description: string;
          id: string;
          is_premium: boolean;
          name: string;
          rating: number;
          slug: string;
          template_content: string;
          usage_count: number;
          variables_schema: Json;
        };
        Insert: {
          category: string;
          created_at?: string;
          created_by?: string;
          description: string;
          id?: string;
          is_premium?: boolean;
          name: string;
          rating?: number;
          slug: string;
          template_content: string;
          usage_count?: number;
          variables_schema?: Json;
        };
        Update: {
          category?: string;
          created_at?: string;
          created_by?: string;
          description?: string;
          id?: string;
          is_premium?: boolean;
          name?: string;
          rating?: number;
          slug?: string;
          template_content?: string;
          usage_count?: number;
          variables_schema?: Json;
        };
        Relationships: [];
      };
      documents: {
        Row: {
          content: string | null;
          created_at: string;
          description: string | null;
          document_name: string;
          document_type: string;
          file_path: string | null;
          file_size: number | null;
          file_url: string | null;
          folder_id: string | null;
          id: string;
          mime_type: string | null;
          source_id: string | null;
          source_type: string | null;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          content?: string | null;
          created_at?: string;
          description?: string | null;
          document_name: string;
          document_type?: string;
          file_path?: string | null;
          file_size?: number | null;
          file_url?: string | null;
          folder_id?: string | null;
          id?: string;
          mime_type?: string | null;
          source_id?: string | null;
          source_type?: string | null;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          content?: string | null;
          created_at?: string;
          description?: string | null;
          document_name?: string;
          document_type?: string;
          file_path?: string | null;
          file_size?: number | null;
          file_url?: string | null;
          folder_id?: string | null;
          id?: string;
          mime_type?: string | null;
          source_id?: string | null;
          source_type?: string | null;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "documents_folder_id_fkey";
            columns: ["folder_id"];
            isOneToOne: false;
            referencedRelation: "folders";
            referencedColumns: ["id"];
          },
        ];
      };
      folders: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          parent_id: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          parent_id?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          parent_id?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "folders_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "folders";
            referencedColumns: ["id"];
          },
        ];
      };
      legal_document_versions: {
        Row: {
          content: string;
          created_at: string;
          document_id: string;
          id: string;
          user_id: string;
          version_number: number;
        };
        Insert: {
          content: string;
          created_at?: string;
          document_id: string;
          id?: string;
          user_id: string;
          version_number: number;
        };
        Update: {
          content?: string;
          created_at?: string;
          document_id?: string;
          id?: string;
          user_id?: string;
          version_number?: number;
        };
        Relationships: [
          {
            foreignKeyName: "legal_document_versions_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "legal_documents";
            referencedColumns: ["id"];
          },
        ];
      };
      legal_documents: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          status: string;
          template_id: string | null;
          title: string;
          updated_at: string;
          user_id: string;
          variables: Json;
          wizard_step: number;
          word_count: number;
        };
        Insert: {
          content?: string;
          created_at?: string;
          id?: string;
          status?: string;
          template_id?: string | null;
          title: string;
          updated_at?: string;
          user_id: string;
          variables?: Json;
          wizard_step?: number;
          word_count?: number;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          status?: string;
          template_id?: string | null;
          title?: string;
          updated_at?: string;
          user_id?: string;
          variables?: Json;
          wizard_step?: number;
          word_count?: number;
        };
        Relationships: [
          {
            foreignKeyName: "legal_documents_template_id_fkey";
            columns: ["template_id"];
            isOneToOne: false;
            referencedRelation: "document_templates";
            referencedColumns: ["id"];
          },
        ];
      };
      legal_research_bookmarks: {
        Row: {
          created_at: string;
          document_id: string;
          id: string;
          note: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          document_id: string;
          id?: string;
          note?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          document_id?: string;
          id?: string;
          note?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "legal_research_bookmarks_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "legal_research_documents";
            referencedColumns: ["id"];
          },
        ];
      };
      legal_research_chunks: {
        Row: {
          chunk_index: number;
          content: string;
          created_at: string;
          document_id: string;
          embedding: string | null;
          id: string;
          section_label: string;
        };
        Insert: {
          chunk_index: number;
          content: string;
          created_at?: string;
          document_id: string;
          embedding?: string | null;
          id?: string;
          section_label: string;
        };
        Update: {
          chunk_index?: number;
          content?: string;
          created_at?: string;
          document_id?: string;
          embedding?: string | null;
          id?: string;
          section_label?: string;
        };
        Relationships: [
          {
            foreignKeyName: "legal_research_chunks_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "legal_research_documents";
            referencedColumns: ["id"];
          },
        ];
      };
      legal_research_documents: {
        Row: {
          category: string;
          created_at: string;
          document_type: string;
          id: string;
          is_demo: boolean;
          number: string;
          publication_date: string | null;
          slug: string;
          source_url: string | null;
          status: string;
          summary: string;
          title: string;
          updated_at: string;
          view_count: number;
          year: number;
        };
        Insert: {
          category: string;
          created_at?: string;
          document_type: string;
          id?: string;
          is_demo?: boolean;
          number: string;
          publication_date?: string | null;
          slug: string;
          source_url?: string | null;
          status?: string;
          summary: string;
          title: string;
          updated_at?: string;
          view_count?: number;
          year: number;
        };
        Update: {
          category?: string;
          created_at?: string;
          document_type?: string;
          id?: string;
          is_demo?: boolean;
          number?: string;
          publication_date?: string | null;
          slug?: string;
          source_url?: string | null;
          status?: string;
          summary?: string;
          title?: string;
          updated_at?: string;
          view_count?: number;
          year?: number;
        };
        Relationships: [];
      };
      legal_saved_searches: {
        Row: {
          created_at: string;
          filters: Json;
          id: string;
          name: string;
          query: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          filters?: Json;
          id?: string;
          name: string;
          query: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          filters?: Json;
          id?: string;
          name?: string;
          query?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      legal_search_alerts: {
        Row: {
          created_at: string;
          filters: Json;
          frequency: string;
          id: string;
          is_active: boolean;
          last_checked_at: string | null;
          name: string;
          query: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          filters?: Json;
          frequency?: string;
          id?: string;
          is_active?: boolean;
          last_checked_at?: string | null;
          name: string;
          query: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          filters?: Json;
          frequency?: string;
          id?: string;
          is_active?: boolean;
          last_checked_at?: string | null;
          name?: string;
          query?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          full_name: string;
          id: string;
          institution: string | null;
          phone: string | null;
          profession: string | null;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          full_name: string;
          id: string;
          institution?: string | null;
          phone?: string | null;
          profession?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          full_name?: string;
          id?: string;
          institution?: string | null;
          phone?: string | null;
          profession?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      match_legal_research_documents: {
        Args: {
          filter_categories?: string[];
          filter_document_types?: string[];
          filter_statuses?: string[];
          filter_year_from?: number;
          filter_year_to?: number;
          match_count?: number;
          query_embedding: string;
        };
        Returns: {
          chunk_id: string;
          content: string;
          document_id: string;
          section_label: string;
          similarity: number;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
