// Supabase Database 타입 정의
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      books: {
        Row: {
          id: number
          title: string
          author: string
          cover_image: string
          audio_file: string
          description: string | null
          content: string | null
          genre: string | null
          published_year: number | null
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          author: string
          cover_image: string
          audio_file: string
          description?: string | null
          content?: string | null
          genre?: string | null
          published_year?: number | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          author?: string
          cover_image?: string
          audio_file?: string
          description?: string | null
          content?: string | null
          genre?: string | null
          published_year?: number | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
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
  }
}
