import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sssupabasess.coman2uniformes.com';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzE1MDUwODAwLAogICJleHAiOiAxODcyODE3MjAwCn0.vGcSPMihrp1q9HoEM-0f8LuoP-AmqurAPWxu_qpfThk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);