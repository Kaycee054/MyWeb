/*
  # Fix Security Issues

  ## Changes Made

  1. **Add Missing Indexes on Foreign Keys**
     - Add index on `artifacts.experience_id`
     - Add index on `experiences.resume_id`
     - Add index on `kanban_tickets.message_id`
     - Add index on `kanban_tickets.stage_id`
     - Add index on `messages.resume_id`

  2. **Drop Unused Indexes**
     - Drop `idx_projects_status` (unused)
     - Drop `idx_projects_is_featured` (unused)
     - Drop `idx_resume_projects_resume_id` (unused)
     - Drop `idx_resume_projects_project_id` (unused)

  3. **Fix Multiple Permissive Policies**
     - Replace overlapping policies with single restrictive policies
     - Ensure proper access control for authenticated vs public users

  4. **Security Notes**
     - Leaked password protection must be enabled in Supabase Dashboard
     - Postgres version upgrade must be done through Supabase Dashboard
*/

-- Add missing indexes on foreign keys for query performance
CREATE INDEX IF NOT EXISTS idx_artifacts_experience_id ON artifacts(experience_id);
CREATE INDEX IF NOT EXISTS idx_experiences_resume_id ON experiences(resume_id);
CREATE INDEX IF NOT EXISTS idx_kanban_tickets_message_id ON kanban_tickets(message_id);
CREATE INDEX IF NOT EXISTS idx_kanban_tickets_stage_id ON kanban_tickets(stage_id);
CREATE INDEX IF NOT EXISTS idx_messages_resume_id ON messages(resume_id);

-- Drop unused indexes
DROP INDEX IF EXISTS idx_projects_status;
DROP INDEX IF EXISTS idx_projects_is_featured;
DROP INDEX IF EXISTS idx_resume_projects_resume_id;
DROP INDEX IF EXISTS idx_resume_projects_project_id;

-- Fix artifacts policies - replace multiple permissive policies with restrictive ones
DROP POLICY IF EXISTS "Authenticated users can manage artifacts" ON artifacts;
DROP POLICY IF EXISTS "Public can read visible artifacts" ON artifacts;

CREATE POLICY "artifacts_select_policy" ON artifacts
  FOR SELECT
  USING (
    is_visible = true OR auth.uid() IS NOT NULL
  );

CREATE POLICY "artifacts_insert_policy" ON artifacts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "artifacts_update_policy" ON artifacts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "artifacts_delete_policy" ON artifacts
  FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Fix experiences policies
DROP POLICY IF EXISTS "Authenticated users can manage experiences" ON experiences;
DROP POLICY IF EXISTS "Public can read visible experiences" ON experiences;

CREATE POLICY "experiences_select_policy" ON experiences
  FOR SELECT
  USING (
    is_visible = true OR auth.uid() IS NOT NULL
  );

CREATE POLICY "experiences_insert_policy" ON experiences
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "experiences_update_policy" ON experiences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "experiences_delete_policy" ON experiences
  FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Fix messages policies
DROP POLICY IF EXISTS "Authenticated users can manage messages" ON messages;
DROP POLICY IF EXISTS "Public can insert messages" ON messages;

CREATE POLICY "messages_select_policy" ON messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "messages_insert_policy" ON messages
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "messages_update_policy" ON messages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "messages_delete_policy" ON messages
  FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Fix projects policies
DROP POLICY IF EXISTS "Authenticated users can manage projects" ON projects;
DROP POLICY IF EXISTS "Public can read projects" ON projects;

CREATE POLICY "projects_select_policy" ON projects
  FOR SELECT
  USING (true);

CREATE POLICY "projects_insert_policy" ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "projects_update_policy" ON projects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "projects_delete_policy" ON projects
  FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Fix resume_projects policies
DROP POLICY IF EXISTS "Authenticated users can manage resume projects" ON resume_projects;
DROP POLICY IF EXISTS "Public can read resume projects" ON resume_projects;

CREATE POLICY "resume_projects_select_policy" ON resume_projects
  FOR SELECT
  USING (true);

CREATE POLICY "resume_projects_insert_policy" ON resume_projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "resume_projects_update_policy" ON resume_projects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "resume_projects_delete_policy" ON resume_projects
  FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Fix resumes policies
DROP POLICY IF EXISTS "Authenticated users can manage resumes" ON resumes;
DROP POLICY IF EXISTS "Public can read resumes" ON resumes;

CREATE POLICY "resumes_select_policy" ON resumes
  FOR SELECT
  USING (true);

CREATE POLICY "resumes_insert_policy" ON resumes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "resumes_update_policy" ON resumes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "resumes_delete_policy" ON resumes
  FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);
