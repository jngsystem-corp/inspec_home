import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Supabase 클라이언트 (상담신청 CRM 저장용)
 *
 * ⚠️  Cloudflare Pages 환경변수 설정 필요:
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * 환경변수 미설정 시 null 반환 → Web3Forms 이메일만 발송됨 (폼 동작은 정상)
 * Supabase 대시보드에서 inquiries 테이블 RLS(Row Level Security) 활성화 필수.
 */
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
