export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ContentStatus = "draft" | "published";
export type AvailabilityStatus = "available" | "unavailable" | "limited";
export type ContactStatus = "unread" | "read" | "archived";
export type NavGroup = "main" | "utility" | "footer" | "social";
export type ScriptPlacement = "head" | "body_end";
export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          user_id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          email: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["admin_users"]["Insert"]>;
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: string;
          site_name: string;
          legal_name: string;
          tagline: string;
          description: string;
          email: string;
          phone: string | null;
          location: string;
          city: string | null;
          timezone: string;
          years_of_experience: number;
          copyright_text: string | null;
          availability_status: AvailabilityStatus;
          availability_message: string;
          github_username: string | null;
          resume_summary: string | null;
          maintenance_enabled: boolean;
          maintenance_message: string | null;
          response_time_text: string | null;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["site_settings"]["Row"],
          "id" | "updated_at"
        > & {
          id?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Insert"]>;
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          slug: string;
          title: string;
          summary: string;
          problem: string;
          role: string;
          context: string;
          overview: string;
          architecture_text: string;
          status: ContentStatus;
          featured: boolean;
          display_order: number;
          completion_date: string | null;
          demo_url: string | null;
          github_url: string | null;
          thumbnail_media_id: string | null;
          meta_title: string | null;
          meta_description: string | null;
          og_image_id: string | null;
          canonical_url: string | null;
          robots: string | null;
          published_at: string | null;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["projects"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
        Relationships: [];
      };
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          status: ContactStatus;
          ip_hash: string | null;
          user_agent: string | null;
          read_at: string | null;
          read_by: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["contact_submissions"]["Row"],
          "id" | "created_at"
        > & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["contact_submissions"]["Insert"]
        >;
        Relationships: [];
      };
      app_meta: {
        Row: {
          key: string;
          value: string;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["app_meta"]["Insert"]>;
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          metadata_json: Json;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["audit_logs"]["Row"],
          "id" | "created_at"
        > & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["audit_logs"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      content_status: ContentStatus;
      availability_status: AvailabilityStatus;
      contact_status: ContactStatus;
      nav_group: NavGroup;
      script_placement: ScriptPlacement;
      skill_level: SkillLevel;
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type Inserts<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
