CREATE TABLE public.contract_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name text NOT NULL CHECK (char_length(file_name) BETWEEN 1 AND 255),
  file_path text NOT NULL,
  file_size bigint NOT NULL CHECK (file_size > 0 AND file_size <= 10485760),
  mime_type text NOT NULL,
  risk_score text NOT NULL CHECK (risk_score IN ('high', 'medium', 'low')),
  risk_percentage integer NOT NULL CHECK (risk_percentage BETWEEN 0 AND 100),
  high_risk_count integer NOT NULL DEFAULT 0 CHECK (high_risk_count >= 0),
  medium_risk_count integer NOT NULL DEFAULT 0 CHECK (medium_risk_count >= 0),
  low_risk_count integer NOT NULL DEFAULT 0 CHECK (low_risk_count >= 0),
  total_clauses integer NOT NULL DEFAULT 0 CHECK (total_clauses >= 0),
  summary text NOT NULL,
  analysis_result jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contract_analyses TO authenticated;
GRANT ALL ON public.contract_analyses TO service_role;
ALTER TABLE public.contract_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own contract analyses" ON public.contract_analyses FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own contract analyses" ON public.contract_analyses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own contract analyses" ON public.contract_analyses FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own contract analyses" ON public.contract_analyses FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX contract_analyses_user_created_idx ON public.contract_analyses (user_id, created_at DESC);

CREATE POLICY "Users can upload own contracts" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'contracts' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can read own contracts" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'contracts' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can delete own contracts" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'contracts' AND (storage.foldername(name))[1] = auth.uid()::text);