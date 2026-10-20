CREATE TABLE public.document_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (char_length(slug) BETWEEN 2 AND 100),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 150),
  category text NOT NULL CHECK (category IN ('Somasi','Gugatan','Kontrak','Surat Kuasa','Perjanjian','Lainnya')),
  description text NOT NULL,
  template_content text NOT NULL,
  variables_schema jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_premium boolean NOT NULL DEFAULT false,
  usage_count integer NOT NULL DEFAULT 0 CHECK (usage_count >= 0),
  rating numeric(2,1) NOT NULL DEFAULT 4.8 CHECK (rating BETWEEN 0 AND 5),
  created_by text NOT NULL DEFAULT 'admin',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.document_templates TO anon, authenticated;
GRANT ALL ON public.document_templates TO service_role;
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read legal templates" ON public.document_templates FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.legal_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id uuid REFERENCES public.document_templates(id) ON DELETE SET NULL,
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 255),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','final')),
  wizard_step integer NOT NULL DEFAULT 1 CHECK (wizard_step BETWEEN 1 AND 5),
  variables jsonb NOT NULL DEFAULT '{}'::jsonb,
  content text NOT NULL DEFAULT '',
  word_count integer NOT NULL DEFAULT 0 CHECK (word_count >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.legal_documents TO authenticated;
GRANT ALL ON public.legal_documents TO service_role;
ALTER TABLE public.legal_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own legal documents" ON public.legal_documents FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own legal documents" ON public.legal_documents FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own legal documents" ON public.legal_documents FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own legal documents" ON public.legal_documents FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX legal_documents_user_updated_idx ON public.legal_documents (user_id, updated_at DESC);

CREATE TABLE public.legal_document_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES public.legal_documents(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  version_number integer NOT NULL CHECK (version_number > 0),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (document_id, version_number)
);
GRANT SELECT, INSERT, DELETE ON public.legal_document_versions TO authenticated;
GRANT ALL ON public.legal_document_versions TO service_role;
ALTER TABLE public.legal_document_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own document versions" ON public.legal_document_versions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own document versions" ON public.legal_document_versions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own document versions" ON public.legal_document_versions FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX legal_document_versions_document_idx ON public.legal_document_versions (document_id, version_number DESC);