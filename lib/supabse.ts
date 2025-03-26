import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://brwhvejlglbabqooicdt.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyd2h2ZWpsZ2xiYWJxb29pY2R0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxMjcyNTQsImV4cCI6MjA1NTcwMzI1NH0.Vv2knPj1i8sG17QVmz5VxmAfacfDTKdu9vBD1esAmVM"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})