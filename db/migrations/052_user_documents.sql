CREATE TABLE user_documents (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
  file_name text NOT NULL CHECK (length(file_name) BETWEEN 1 AND 180),
  category text NOT NULL CHECK (category IN ('historico', 'diploma', 'traducao', 'recomendacao', 'certificado', 'curriculo', 'outro')),
  mime_type text NOT NULL CHECK (mime_type IN ('application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg')),
  size_bytes integer NOT NULL CHECK (size_bytes BETWEEN 1 AND 5242880),
  content bytea NOT NULL CHECK (octet_length(content) = size_bytes),
  uploaded_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX user_documents_user_uploaded_idx ON user_documents (user_id, uploaded_at DESC);
