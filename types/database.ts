export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          username: string
          display_name: string | null
          phone: string | null
          birth_date: string | null
          gender: string | null
          country: string | null
          postal_code: string | null
          city: string | null
          role: "conquistador" | "guia_mayor" | "director" | "coordinador_zona" | "coordinador_general" | "instructor"
          avatar_url: string | null
          bio: string | null
          interests: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          username: string
          display_name?: string | null
          phone?: string | null
          birth_date?: string | null
          gender?: string | null
          country?: string | null
          postal_code?: string | null
          city?: string | null
          role?: "conquistador" | "guia_mayor" | "director" | "coordinador_zona" | "coordinador_general" | "instructor"
          avatar_url?: string | null
          bio?: string | null
          interests?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          display_name?: string | null
          phone?: string | null
          birth_date?: string | null
          gender?: string | null
          country?: string | null
          postal_code?: string | null
          city?: string | null
          role?: "conquistador" | "guia_mayor" | "director" | "coordinador_zona" | "coordinador_general" | "instructor"
          avatar_url?: string | null
          bio?: string | null
          interests?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
