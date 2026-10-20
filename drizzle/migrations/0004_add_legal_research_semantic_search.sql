CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE public.legal_research_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  document_type text NOT NULL CHECK (document_type IN ('UU', 'PP', 'Perpres', 'Permen', 'Putusan MA', 'Putusan PN', 'Peraturan Daerah')),
  category text NOT NULL CHECK (category IN ('Pidana', 'Perdata', 'Bisnis', 'Tata Usaha', 'Agraria', 'Keluarga', 'Konstitusi')),
  number text NOT NULL,
  year integer NOT NULL CHECK (year BETWEEN 1945 AND 2100),
  title text NOT NULL,
  summary text NOT NULL,
  source_url text,
  status text NOT NULL DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Dicabut', 'Diubah')),
  publication_date date,
  view_count integer NOT NULL DEFAULT 0 CHECK (view_count >= 0),
  is_demo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.legal_research_documents TO anon, authenticated;
GRANT ALL ON public.legal_research_documents TO service_role;
ALTER TABLE public.legal_research_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read legal research documents"
  ON public.legal_research_documents FOR SELECT TO anon, authenticated USING (true);
CREATE INDEX legal_research_documents_type_idx ON public.legal_research_documents(document_type);
CREATE INDEX legal_research_documents_category_idx ON public.legal_research_documents(category);
CREATE INDEX legal_research_documents_year_idx ON public.legal_research_documents(year DESC);
CREATE INDEX legal_research_documents_status_idx ON public.legal_research_documents(status);

CREATE TABLE public.legal_research_chunks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES public.legal_research_documents(id) ON DELETE CASCADE,
  section_label text NOT NULL,
  content text NOT NULL,
  chunk_index integer NOT NULL CHECK (chunk_index >= 0),
  embedding vector(1536),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(document_id, chunk_index)
);
GRANT SELECT ON public.legal_research_chunks TO anon, authenticated;
GRANT ALL ON public.legal_research_chunks TO service_role;
ALTER TABLE public.legal_research_chunks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read legal research chunks"
  ON public.legal_research_chunks FOR SELECT TO anon, authenticated USING (true);
CREATE INDEX legal_research_chunks_document_id_idx ON public.legal_research_chunks(document_id);
CREATE INDEX legal_research_chunks_embedding_idx
  ON public.legal_research_chunks USING hnsw (embedding vector_cosine_ops);

CREATE OR REPLACE FUNCTION public.match_legal_research_documents(
  query_embedding vector(1536),
  match_count integer DEFAULT 30,
  filter_document_types text[] DEFAULT NULL,
  filter_categories text[] DEFAULT NULL,
  filter_year_from integer DEFAULT NULL,
  filter_year_to integer DEFAULT NULL,
  filter_statuses text[] DEFAULT NULL
)
RETURNS TABLE (
  chunk_id uuid,
  document_id uuid,
  section_label text,
  content text,
  similarity double precision
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT
    c.id,
    c.document_id,
    c.section_label,
    c.content,
    1 - (c.embedding <=> query_embedding) AS similarity
  FROM public.legal_research_chunks c
  JOIN public.legal_research_documents d ON d.id = c.document_id
  WHERE c.embedding IS NOT NULL
    AND (filter_document_types IS NULL OR d.document_type = ANY(filter_document_types))
    AND (filter_categories IS NULL OR d.category = ANY(filter_categories))
    AND (filter_year_from IS NULL OR d.year >= filter_year_from)
    AND (filter_year_to IS NULL OR d.year <= filter_year_to)
    AND (filter_statuses IS NULL OR d.status = ANY(filter_statuses))
  ORDER BY c.embedding <=> query_embedding
  LIMIT LEAST(GREATEST(match_count, 1), 100);
$$;
GRANT EXECUTE ON FUNCTION public.match_legal_research_documents(vector, integer, text[], text[], integer, integer, text[]) TO anon, authenticated, service_role;

CREATE TABLE public.legal_research_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id uuid NOT NULL REFERENCES public.legal_research_documents(id) ON DELETE CASCADE,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, document_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.legal_research_bookmarks TO authenticated;
GRANT ALL ON public.legal_research_bookmarks TO service_role;
ALTER TABLE public.legal_research_bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own legal research bookmarks" ON public.legal_research_bookmarks FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own legal research bookmarks" ON public.legal_research_bookmarks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own legal research bookmarks" ON public.legal_research_bookmarks FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own legal research bookmarks" ON public.legal_research_bookmarks FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX legal_research_bookmarks_user_id_idx ON public.legal_research_bookmarks(user_id);

CREATE TABLE public.legal_saved_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  query text NOT NULL,
  filters jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.legal_saved_searches TO authenticated;
GRANT ALL ON public.legal_saved_searches TO service_role;
ALTER TABLE public.legal_saved_searches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own legal saved searches" ON public.legal_saved_searches FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own legal saved searches" ON public.legal_saved_searches FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own legal saved searches" ON public.legal_saved_searches FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own legal saved searches" ON public.legal_saved_searches FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX legal_saved_searches_user_id_idx ON public.legal_saved_searches(user_id);

CREATE TABLE public.legal_search_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  query text NOT NULL,
  filters jsonb NOT NULL DEFAULT '{}'::jsonb,
  frequency text NOT NULL DEFAULT 'weekly' CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  is_active boolean NOT NULL DEFAULT true,
  last_checked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.legal_search_alerts TO authenticated;
GRANT ALL ON public.legal_search_alerts TO service_role;
ALTER TABLE public.legal_search_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own legal search alerts" ON public.legal_search_alerts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own legal search alerts" ON public.legal_search_alerts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own legal search alerts" ON public.legal_search_alerts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own legal search alerts" ON public.legal_search_alerts FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX legal_search_alerts_user_id_idx ON public.legal_search_alerts(user_id);