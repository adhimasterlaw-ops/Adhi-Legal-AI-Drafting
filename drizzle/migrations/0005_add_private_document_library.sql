CREATE TABLE public.folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL CHECK (char_length(btrim(name)) BETWEEN 1 AND 100),
  parent_id uuid REFERENCES public.folders(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.folders TO authenticated;
GRANT ALL ON public.folders TO service_role;
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own folders" ON public.folders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own folders" ON public.folders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own folders" ON public.folders FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own folders" ON public.folders FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX folders_user_parent_idx ON public.folders(user_id, parent_id);
CREATE UNIQUE INDEX folders_user_parent_name_idx ON public.folders(user_id, COALESCE(parent_id, '00000000-0000-0000-0000-000000000000'::uuid), lower(name));

CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  document_type text NOT NULL DEFAULT 'Lainnya',
  document_name text NOT NULL CHECK (char_length(btrim(document_name)) BETWEEN 1 AND 255),
  description text,
  file_path text,
  file_url text,
  content text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'final')),
  folder_id uuid REFERENCES public.folders(id) ON DELETE SET NULL,
  file_size bigint CHECK (file_size IS NULL OR file_size >= 0),
  mime_type text,
  source_type text CHECK (source_type IS NULL OR source_type IN ('drafting', 'contract_analysis', 'upload')),
  source_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT documents_source_pair_check CHECK ((source_type IS NULL) = (source_id IS NULL))
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;
GRANT ALL ON public.documents TO service_role;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own documents" ON public.documents FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own documents" ON public.documents FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND (folder_id IS NULL OR EXISTS (SELECT 1 FROM public.folders f WHERE f.id = folder_id AND f.user_id = auth.uid())));
CREATE POLICY "Users can update own documents" ON public.documents FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id AND (folder_id IS NULL OR EXISTS (SELECT 1 FROM public.folders f WHERE f.id = folder_id AND f.user_id = auth.uid())));
CREATE POLICY "Users can delete own documents" ON public.documents FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX documents_user_folder_updated_idx ON public.documents(user_id, folder_id, updated_at DESC);
CREATE INDEX documents_user_type_idx ON public.documents(user_id, document_type);
CREATE UNIQUE INDEX documents_user_source_idx ON public.documents(user_id, source_type, source_id) WHERE source_id IS NOT NULL;

CREATE TABLE public.document_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  tag_name text NOT NULL CHECK (char_length(btrim(tag_name)) BETWEEN 1 AND 40),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.document_tags TO authenticated;
GRANT ALL ON public.document_tags TO service_role;
ALTER TABLE public.document_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own document tags" ON public.document_tags FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own document tags" ON public.document_tags FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.documents d WHERE d.id = document_id AND d.user_id = auth.uid()));
CREATE POLICY "Users can update own document tags" ON public.document_tags FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.documents d WHERE d.id = document_id AND d.user_id = auth.uid()));
CREATE POLICY "Users can delete own document tags" ON public.document_tags FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE UNIQUE INDEX document_tags_user_document_name_idx ON public.document_tags(user_id, document_id, lower(tag_name));

CREATE OR REPLACE FUNCTION public.validate_folder_hierarchy()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE cursor_id uuid;
BEGIN
  IF NEW.parent_id IS NULL THEN RETURN NEW; END IF;
  IF NEW.parent_id = NEW.id THEN RAISE EXCEPTION 'Folder tidak dapat menjadi induk dirinya sendiri'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.folders WHERE id = NEW.parent_id AND user_id = NEW.user_id) THEN
    RAISE EXCEPTION 'Folder induk tidak valid';
  END IF;
  cursor_id := NEW.parent_id;
  WHILE cursor_id IS NOT NULL LOOP
    IF cursor_id = NEW.id THEN RAISE EXCEPTION 'Struktur folder melingkar tidak diizinkan'; END IF;
    SELECT parent_id INTO cursor_id FROM public.folders WHERE id = cursor_id AND user_id = NEW.user_id;
  END LOOP;
  RETURN NEW;
END;
$$;
CREATE TRIGGER validate_folder_hierarchy_trigger BEFORE INSERT OR UPDATE OF parent_id ON public.folders FOR EACH ROW EXECUTE FUNCTION public.validate_folder_hierarchy();

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER folders_touch_updated_at BEFORE UPDATE ON public.folders FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER documents_touch_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE UNIQUE INDEX legal_research_bookmarks_user_document_unique_idx ON public.legal_research_bookmarks(user_id, document_id);