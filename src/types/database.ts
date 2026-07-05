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

type TableDef<Row> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      admin_users: TableDef<{
        user_id: string;
        email: string;
        created_at: string;
      }>;
      site_settings: TableDef<{
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
      }>;
      theme_settings: TableDef<{
        id: string;
        logo_media_id: string | null;
        favicon_media_id: string | null;
        primary_color: string;
        accent_color: string | null;
        background_color: string | null;
        foreground_color: string | null;
        font_heading: string;
        font_body: string;
        font_mono: string;
        custom_css: string | null;
        updated_at: string;
      }>;
      seo_defaults: TableDef<{
        id: string;
        default_title: string;
        default_description: string;
        default_og_image_id: string | null;
        default_robots: string;
        twitter_card_type: string;
        updated_at: string;
      }>;
      analytics_settings: TableDef<{
        id: string;
        plausible_domain: string | null;
        plausible_enabled: boolean;
        ga4_measurement_id: string | null;
        ga4_enabled: boolean;
        updated_at: string;
      }>;
      custom_scripts: TableDef<{
        id: string;
        name: string;
        script_content: string;
        placement: ScriptPlacement;
        enabled: boolean;
        updated_at: string;
      }>;
      social_links: TableDef<{
        id: string;
        platform: string;
        label: string;
        url: string;
        icon: string | null;
        display_order: number;
        visible: boolean;
        created_at: string;
      }>;
      navigation_items: TableDef<{
        id: string;
        nav_group: NavGroup;
        title: string;
        href: string;
        external: boolean;
        display_order: number;
        visible: boolean;
        created_at: string;
      }>;
      section_headers: TableDef<{
        id: string;
        page_key: string;
        section_key: string;
        title: string;
        description: string | null;
        visible: boolean;
        display_order: number;
      }>;
      cta_sections: TableDef<{
        id: string;
        section_key: string;
        title: string;
        description: string | null;
        primary_label: string | null;
        primary_href: string | null;
        secondary_label: string | null;
        secondary_href: string | null;
        visible: boolean;
        updated_at: string;
      }>;
      philosophy_items: TableDef<{
        id: string;
        title: string;
        description: string;
        display_order: number;
      }>;
      expertise_items: TableDef<{
        id: string;
        title: string;
        display_order: number;
      }>;
      about_paragraphs: TableDef<{
        id: string;
        content: string;
        display_order: number;
      }>;
      languages: TableDef<{
        id: string;
        name: string;
        level: string;
        display_order: number;
      }>;
      achievements: TableDef<{
        id: string;
        text: string;
        featured: boolean;
        display_order: number;
      }>;
      media_files: TableDef<{
        id: string;
        filename: string;
        original_filename: string;
        mime_type: string;
        size_bytes: number;
        storage_bucket: string;
        storage_path: string;
        public_url: string;
        alt_text: string | null;
        width: number | null;
        height: number | null;
        uploaded_by: string | null;
        created_at: string;
      }>;
      skill_categories: TableDef<{
        id: string;
        name: string;
        slug: string;
        display_order: number;
      }>;
      skills: TableDef<{
        id: string;
        category_id: string;
        name: string;
        icon: string | null;
        level: SkillLevel | null;
        display_order: number;
      }>;
      experiences: TableDef<{
        id: string;
        legacy_id: string | null;
        company: string;
        role: string;
        location: string;
        start_date: string;
        end_date: string | null;
        description: string | null;
        featured: boolean;
        display_order: number;
        created_at: string;
        updated_at: string;
      }>;
      experience_highlights: TableDef<{
        id: string;
        experience_id: string;
        text: string;
        display_order: number;
      }>;
      experience_technologies: TableDef<{
        id: string;
        experience_id: string;
        technology: string;
        display_order: number;
      }>;
      educations: TableDef<{
        id: string;
        institution: string;
        degree: string;
        location: string;
        start_date: string;
        end_date: string | null;
        description: string | null;
        display_order: number;
      }>;
      education_achievements: TableDef<{
        id: string;
        education_id: string;
        text: string;
        display_order: number;
      }>;
      project_categories: TableDef<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        display_order: number;
      }>;
      projects: TableDef<{
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
      }>;
      project_category_map: TableDef<{
        project_id: string;
        category_id: string;
      }>;
      project_tags: TableDef<{
        id: string;
        project_id: string;
        tag: string;
        display_order: number;
      }>;
      project_technologies: TableDef<{
        id: string;
        project_id: string;
        technology: string;
        display_order: number;
      }>;
      project_links: TableDef<{
        id: string;
        project_id: string;
        label: string;
        href: string;
        display_order: number;
      }>;
      project_metrics: TableDef<{
        id: string;
        project_id: string;
        label: string;
        value: string;
        display_order: number;
      }>;
      project_challenges: TableDef<{
        id: string;
        project_id: string;
        text: string;
        display_order: number;
      }>;
      project_decisions: TableDef<{
        id: string;
        project_id: string;
        decision: string;
        rationale: string;
        tradeoff: string;
        display_order: number;
      }>;
      project_results: TableDef<{
        id: string;
        project_id: string;
        text: string;
        display_order: number;
      }>;
      project_lessons: TableDef<{
        id: string;
        project_id: string;
        text: string;
        display_order: number;
      }>;
      project_future_improvements: TableDef<{
        id: string;
        project_id: string;
        text: string;
        display_order: number;
      }>;
      project_gallery: TableDef<{
        id: string;
        project_id: string;
        media_id: string;
        caption: string | null;
        display_order: number;
      }>;
      project_architecture_diagrams: TableDef<{
        id: string;
        project_id: string;
        title: string;
        nodes_json: Json;
        edges_json: Json;
      }>;
      articles: TableDef<{
        id: string;
        slug: string;
        title: string;
        excerpt: string;
        content_json: Json | null;
        content_html: string | null;
        status: ContentStatus;
        published_at: string | null;
        reading_time_minutes: number;
        meta_title: string | null;
        meta_description: string | null;
        og_image_id: string | null;
        canonical_url: string | null;
        robots: string | null;
        deleted_at: string | null;
        created_at: string;
        updated_at: string;
      }>;
      article_tags: TableDef<{
        id: string;
        article_id: string;
        tag: string;
        display_order: number;
      }>;
      certifications: TableDef<{
        id: string;
        name: string;
        issuer: string;
        issue_date: string | null;
        credential_id: string | null;
        verification_url: string | null;
        image_media_id: string | null;
        display_order: number;
        visible: boolean;
      }>;
      testimonials: TableDef<{
        id: string;
        author_name: string;
        author_role: string | null;
        author_company: string | null;
        content: string;
        rating: number | null;
        avatar_media_id: string | null;
        featured: boolean;
        display_order: number;
        visible: boolean;
      }>;
      services: TableDef<{
        id: string;
        title: string;
        description: string;
        icon: string | null;
        display_order: number;
        visible: boolean;
      }>;
      resume_versions: TableDef<{
        id: string;
        title: string;
        file_media_id: string;
        is_active: boolean;
        display_order: number;
        uploaded_at: string;
      }>;
      contact_submissions: TableDef<{
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
      }>;
      github_settings: TableDef<{
        id: string;
        username: string;
        show_live_stats: boolean;
        updated_at: string;
      }>;
      curated_repos: TableDef<{
        id: string;
        repo_full_name: string;
        github_repo_id: number | null;
        pinned: boolean;
        hidden: boolean;
        override_description: string | null;
        display_order: number;
      }>;
      pages: TableDef<{
        id: string;
        slug: string;
        title: string;
        content_json: Json | null;
        content_html: string | null;
        template: string;
        status: ContentStatus;
        meta_title: string | null;
        meta_description: string | null;
        og_image_id: string | null;
        canonical_url: string | null;
        robots: string | null;
        published_at: string | null;
        deleted_at: string | null;
        created_at: string;
        updated_at: string;
      }>;
      audit_logs: TableDef<{
        id: string;
        actor_id: string | null;
        action: string;
        entity_type: string;
        entity_id: string | null;
        metadata_json: Json;
        created_at: string;
      }>;
      app_meta: TableDef<{
        key: string;
        value: string;
        updated_at: string;
      }>;
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
