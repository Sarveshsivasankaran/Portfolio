export type LinkedInPostRow = {
  id: string
  title: string
  description: string
  linkedin_url: string
  images: string[]
  category: string | null
  published_at: string
  featured: boolean
  visible: boolean
  sort_order: number | null
  created_at: string
  updated_at: string
}

export type LinkedInPostInput = Pick<LinkedInPostRow,
  'title' | 'description' | 'linkedin_url' | 'published_at'> &
  Partial<Pick<LinkedInPostRow, 'id' | 'images' | 'category' | 'featured' | 'visible' | 'sort_order'>>

export type Database = {
  public: {
    Tables: {
      linkedin_posts: {
        Row: LinkedInPostRow
        Insert: LinkedInPostInput
        Update: Partial<LinkedInPostInput>
        Relationships: []
      }
      activity_feed_revision: {
        Row: { id: number; revision: number }
        Insert: { id?: number; revision?: number }
        Update: { revision?: number }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { is_activity_admin: { Args: Record<string, never>; Returns: boolean } }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
