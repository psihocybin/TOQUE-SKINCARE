export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type NotificationSettings = {
  reminders: boolean;
  tips: boolean;
  weekly_report: boolean;
};

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  reminders: true,
  tips: true,
  weekly_report: false,
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          device:
            | "NUO"
            | "NUO_PRO"
            | "LUMERA"
            | "ELARA"
            | "PULSAR"
            | "ANIMA"
            | "NOVA"
            | "AERIS"
            | "AURA"
            | "VIBE"
            | "QUANTUM"
            | "LYRA"
            | "SYLVA"
            | null;
          age_group: "18-24" | "25-34" | "35-44" | "45-54" | "55+" | null;
          goal: "cleansing" | "tone" | "glow" | "puffiness" | "all" | null;
          is_gift: boolean;
          skin_type:
            | "normal"
            | "dry"
            | "oily"
            | "combo"
            | "sensitive"
            | null;
          experience:
            | "beginner"
            | "familiar"
            | "experienced"
            | "expert"
            | null;
          preferred_time: "morning" | "evening" | "flexible" | null;
          frequency: "low" | "medium" | "daily" | null;
          warranty_serial: string | null;
          warranty_receipt_url: string | null;
          warranty_registered_at: string | null;
          activation_date: string | null;
          notification_settings: NotificationSettings | null;
          // Массив slug устройств (lib/content/devices.ts), для поддержки
          // нескольких приборов у одного пользователя. `device` выше
          // остаётся primary-устройством для обратной совместимости.
          devices: string[] | null;
          // Конструктор ритуала (app/(main)/ritual-builder) — см.
          // lib/ritual-builder/types.ts CustomSchedule.
          custom_schedule: Json | null;
          // Кэш серии дней подряд — на практике не поддерживается отдельным
          // триггером, streak считается на лету в lib/queries/attendance.ts.
          current_streak: number;
          // Одноразовый флаг — показан ли уже экран /program-complete после
          // завершения 30-дневного онбординга (см. миграцию 011).
          completion_celebrated: boolean;
          referral_code: string | null;
          referred_by: string | null;
          activated_at: string;
          created_at: string;
        };
        Insert: {
          id: string;
          name?: string;
          device?: Database["public"]["Tables"]["profiles"]["Row"]["device"];
          age_group?: Database["public"]["Tables"]["profiles"]["Row"]["age_group"];
          goal?: Database["public"]["Tables"]["profiles"]["Row"]["goal"];
          is_gift?: boolean;
          skin_type?: Database["public"]["Tables"]["profiles"]["Row"]["skin_type"];
          experience?: Database["public"]["Tables"]["profiles"]["Row"]["experience"];
          preferred_time?: Database["public"]["Tables"]["profiles"]["Row"]["preferred_time"];
          frequency?: Database["public"]["Tables"]["profiles"]["Row"]["frequency"];
          warranty_serial?: string | null;
          warranty_receipt_url?: string | null;
          warranty_registered_at?: string | null;
          activation_date?: string | null;
          notification_settings?: NotificationSettings | null;
          devices?: string[] | null;
          custom_schedule?: Json | null;
          current_streak?: number;
          completion_celebrated?: boolean;
          referral_code?: string | null;
          referred_by?: string | null;
          activated_at?: string;
          created_at?: string;
        };
        Update: Partial<
          Omit<Database["public"]["Tables"]["profiles"]["Insert"], "id">
        >;
        Relationships: [];
      };

      procedures: {
        Row: {
          id: string;
          profile_id: string;
          day_number: number;
          mode: string;
          duration_seconds: number;
          feedback: "great" | "normal" | "questions" | null;
          note: string | null;
          is_extra: boolean;
          completed_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          day_number: number;
          mode: string;
          duration_seconds: number;
          feedback?: "great" | "normal" | "questions" | null;
          note?: string | null;
          is_extra?: boolean;
          completed_at?: string;
        };
        Update: Partial<
          Omit<Database["public"]["Tables"]["procedures"]["Insert"], "id">
        >;
        Relationships: [];
      };

      surveys: {
        Row: {
          id: string;
          profile_id: string;
          survey_type:
            | "nps_d30"
            | "nps_d30_postponed"
            | "jcs_d60"
            | "week1"
            | "first_procedure";
          score: number | null;
          answer: string | null;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          survey_type:
            | "nps_d30"
            | "nps_d30_postponed"
            | "jcs_d60"
            | "week1"
            | "first_procedure";
          score?: number | null;
          answer?: string | null;
          comment?: string | null;
          created_at?: string;
        };
        Update: Partial<
          Omit<Database["public"]["Tables"]["surveys"]["Insert"], "id">
        >;
        Relationships: [];
      };

      photos: {
        Row: {
          id: string;
          profile_id: string;
          storage_path: string;
          day_number: number;
          taken_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          storage_path: string;
          day_number: number;
          taken_at?: string;
        };
        Update: Partial<
          Omit<Database["public"]["Tables"]["photos"]["Insert"], "id">
        >;
        Relationships: [];
      };

      push_subscriptions: {
        Row: {
          id: string;
          profile_id: string;
          endpoint: string;
          p256dh: string;
          auth: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          endpoint: string;
          p256dh: string;
          auth: string;
          created_at?: string;
        };
        Update: Partial<
          Omit<Database["public"]["Tables"]["push_subscriptions"]["Insert"], "id">
        >;
        Relationships: [];
      };

      rituals: {
        Row: {
          id: string;
          profile_id: string;
          name: string;
          is_active: boolean;
          // RitualSchedule (lib/actions/rituals.ts) — DeviceRitualConfig[].
          schedule: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          name?: string;
          is_active?: boolean;
          schedule?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Omit<Database["public"]["Tables"]["rituals"]["Insert"], "id">
        >;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

// Convenience aliases
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type Procedure = Database["public"]["Tables"]["procedures"]["Row"];
export type ProcedureInsert = Database["public"]["Tables"]["procedures"]["Insert"];

export type Survey = Database["public"]["Tables"]["surveys"]["Row"];
export type SurveyInsert = Database["public"]["Tables"]["surveys"]["Insert"];

export type Photo = Database["public"]["Tables"]["photos"]["Row"];
export type PhotoInsert = Database["public"]["Tables"]["photos"]["Insert"];

export type PushSubscription =
  Database["public"]["Tables"]["push_subscriptions"]["Row"];
export type PushSubscriptionInsert =
  Database["public"]["Tables"]["push_subscriptions"]["Insert"];

export type Ritual = Database["public"]["Tables"]["rituals"]["Row"];
export type RitualInsert = Database["public"]["Tables"]["rituals"]["Insert"];
