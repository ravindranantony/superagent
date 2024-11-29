export interface Database {
  public: {
    Tables: {
      agent_tasks: {
        Row: {
          id: string;
          type: string;
          status: string;
          priority: string;
          context: Json;
          steps: Json;
          result: Json | null;
          error: string | null;
          created_at: string;
          updated_at: string;
          completed_at: string | null;
          user_id: string;
        };
        Insert: Omit<Database['public']['Tables']['agent_tasks']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['agent_tasks']['Insert']>;
      };
      agent_credentials: {
        Row: {
          id: string;
          user_id: string;
          service: string;
          encrypted_data: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['agent_credentials']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['agent_credentials']['Insert']>;
      };
      agent_users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          preferences: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['agent_users']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['agent_users']['Insert']>;
      };
    };
  };
}

type Json = Record<string, any>;