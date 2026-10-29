-- WO-WEB-07: Kho tri thuc van ban phap luat cho Bot An.
-- bot_chunks: cac doan van ban da cat theo Dieu/muc. Noi dung la van ban
-- phap luat da cong bo nen mo doc cong khai; khong mo ghi cong khai.
-- add_bot_chunk: ham nap doan SECURITY DEFINER, chi cap quyen tam cho
-- anon trong luc nap, nap xong THU HOI (chi con service_role).

CREATE TABLE IF NOT EXISTS public.bot_chunks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doc_code text NOT NULL,
  doc_title text NOT NULL,
  section text,
  content text NOT NULL,
  ord int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS bot_chunks_doc_idx ON public.bot_chunks (doc_code);

ALTER TABLE public.bot_chunks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Bot chunks are viewable by everyone" ON public.bot_chunks;
CREATE POLICY "Bot chunks are viewable by everyone"
  ON public.bot_chunks FOR SELECT TO public USING (true);

CREATE OR REPLACE FUNCTION public.add_bot_chunk(
  p_doc_code text, p_doc_title text, p_section text, p_content text, p_ord int
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.bot_chunks (doc_code, doc_title, section, content, ord)
  VALUES (p_doc_code, p_doc_title, p_section, left(p_content, 2000), p_ord);
END;
$$;

REVOKE ALL ON FUNCTION public.add_bot_chunk(text, text, text, text, int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.add_bot_chunk(text, text, text, text, int) TO anon;

COMMIT;
