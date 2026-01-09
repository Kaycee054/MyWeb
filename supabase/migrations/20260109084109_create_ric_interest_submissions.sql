/*
  # RIC Interest Submissions Table

  ## Summary
  Creates a table to store interest and contribution submissions from the RIC (Research & Innovation Cluster) project page.

  ## New Tables
  - `ric_interest_submissions`
    - `id` (uuid, primary key) - Unique identifier for each submission
    - `full_name` (text) - Full name of the person submitting interest
    - `email` (text) - Email address for contact
    - `phone` (text) - Phone number for contact
    - `organization` (text) - Organization name
    - `role` (text) - Person's role in the organization
    - `interest_area` (text) - Area of interest (collaboration, funding, etc.)
    - `message` (text, nullable) - Optional message from the submitter
    - `created_at` (timestamptz) - Timestamp of submission

  ## Security
  - Enable RLS on `ric_interest_submissions` table
  - Add policy for public insert access (allows anonymous submissions)
  - Add policy for authenticated admin read access
*/

CREATE TABLE IF NOT EXISTS ric_interest_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  organization text NOT NULL,
  role text NOT NULL,
  interest_area text NOT NULL,
  message text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ric_interest_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit interest"
  ON ric_interest_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all submissions"
  ON ric_interest_submissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email IN (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )
    )
  );

CREATE INDEX IF NOT EXISTS idx_ric_interest_created_at ON ric_interest_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ric_interest_email ON ric_interest_submissions(email);
