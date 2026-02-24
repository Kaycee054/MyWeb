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

CREATE POLICY "cv_uploads_select_policy" ON cv_uploads
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "cv_uploads_insert_policy" ON cv_uploads
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "cv_uploads_update_policy" ON cv_uploads
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "cv_uploads_delete_policy" ON cv_uploads
  FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);
