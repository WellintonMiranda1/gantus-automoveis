-- Execute no SQL Editor se a tabela site_content já existe.
-- Não remove tabelas, colunas nem registros existentes.
ALTER TABLE public.site_content ADD COLUMN IF NOT EXISTS records jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.site_content ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
CREATE UNIQUE INDEX IF NOT EXISTS site_content_section_unique_idx ON public.site_content (section);
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS gantus_public_read_content ON public.site_content;
CREATE POLICY gantus_public_read_content ON public.site_content FOR SELECT TO anon,authenticated USING (true);
-- Políticas de escrita para administradores já devem existir no banco.
-- IMPORTANTE: a coluna records é pública. Não armazene dados confidenciais nela.
