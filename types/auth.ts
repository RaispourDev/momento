import { User as SupabaseUser } from '@supabase/supabase-js'


export type User = SupabaseUser

export interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, name: string) => Promise<{
    data: unknown
    error: unknown
  }>
  signIn: (email: string, password: string) => Promise<{
    data: unknown
    error: unknown
  }>
  signOut: () => Promise<{ error: unknown }>
}
