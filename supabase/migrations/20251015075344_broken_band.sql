/*
  # Add CV uploads table

  1. New Tables
    - `cv_uploads`
      - `id` (uuid, primary key)
      - `filename` (text)
      - `file_path` (text)
      - `file_size` (bigint)
      - `uploaded_at` (timestamp)

  2. Security
    - Enable RLS on `cv_uploads` table
    - Add policy for authenticated users to manage uploads
*/

CREATE TABLE IF NOT EXISTS cv_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  file_path text NOT NULL,
  file_size bigint NOT NULL,
  uploaded_at timestamptz DEFAULT now()
);

ALTER TABLE cv_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage CV uploads"
  ON cv_uploads
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);