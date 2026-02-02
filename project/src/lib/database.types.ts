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
      kanji_questions: {
        Row: {
          id: string
          kanji: string
          yomi: string
          level: number
          meaning: string
          created_at: string
        }
        Insert: {
          id?: string
          kanji: string
          yomi: string
          level?: number
          meaning?: string
          created_at?: string
        }
        Update: {
          id?: string
          kanji?: string
          yomi?: string
          level?: number
          meaning?: string
          created_at?: string
        }
      }
      scores: {
        Row: {
          id: string
          player_name: string
          score: number
          correct_count: number
          total_count: number
          level: number
          play_time: number
          created_at: string
        }
        Insert: {
          id?: string
          player_name: string
          score?: number
          correct_count?: number
          total_count?: number
          level?: number
          play_time?: number
          created_at?: string
        }
        Update: {
          id?: string
          player_name?: string
          score?: number
          correct_count?: number
          total_count?: number
          level?: number
          play_time?: number
          created_at?: string
        }
      }
    }
  }
}
