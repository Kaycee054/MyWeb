/*
  # Optimize RLS Policies and Fix Index Issues

  ## Summary
  This migration addresses critical security and performance issues identified by Supabase:
  1. Adds missing foreign key index on resume_projects.project_id
  2. Optimizes all RLS policies to use (SELECT auth.uid()) pattern for better performance
  3. Removes unused indexes that add overhead without benefit

  ## Changes

  ### 1. Missing Foreign Key Index
  - **resume_projects.project_id**: Add index to improve JOIN performance

  ### 2. RLS Policy Optimization
  Replace `auth.uid()` with `(SELECT auth.uid())` in all policies to prevent 
  re-evaluation for each row, significantly improving query performance at scale.
  
  Tables optimized:
  - artifacts (4 policies)
  - experiences (4 policies)
  - messages (3 policies)
  - projects (3 policies)
  - resume_projects (3 policies)
  - resumes (3 policies)

  ### 3. Remove Unused Indexes
  - idx_kanban_tickets_message_id
  - idx_kanban_tickets_stage_id
  - idx_messages_resume_id

  ### 4. Manual Actions Required
  The following must be configured in Supabase Dashboard:
  - Enable leaked password protection (Auth settings)
  - Upgrade Postgres version to latest (Database settings)
*/

-- ============================================================================
-- 1. ADD MISSING FOREIGN KEY INDEX
-- ============================================================================

-- Add index on resume_projects.project_id for better JOIN performance
CREATE INDEX IF NOT EXISTS idx_resume_projects_project_id ON resume_projects(project_id);


-- ============================================================================
-- 2. OPTIMIZE RLS POLICIES - ARTIFACTS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "artifacts_select_policy" ON artifacts;
DROP POLICY IF EXISTS "artifacts_insert_policy" ON artifacts;
DROP POLICY IF EXISTS "artifacts_update_policy" ON artifacts;
DROP POLICY IF EXISTS "artifacts_delete_policy" ON artifacts;

CREATE POLICY "artifacts_select_policy" ON artifacts
  FOR SELECT
  USING (
    is_visible = true OR (SELECT auth.uid()) IS NOT NULL
  );

CREATE POLICY "artifacts_insert_policy" ON artifacts
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "artifacts_update_policy" ON artifacts
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) IS NOT NULL)
  WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "artifacts_delete_policy" ON artifacts
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) IS NOT NULL);


-- ============================================================================
-- 3. OPTIMIZE RLS POLICIES - EXPERIENCES TABLE
-- ============================================================================

DROP POLICY IF EXISTS "experiences_select_policy" ON experiences;
DROP POLICY IF EXISTS "experiences_insert_policy" ON experiences;
DROP POLICY IF EXISTS "experiences_update_policy" ON experiences;
DROP POLICY IF EXISTS "experiences_delete_policy" ON experiences;

CREATE POLICY "experiences_select_policy" ON experiences
  FOR SELECT
  USING (
    is_visible = true OR (SELECT auth.uid()) IS NOT NULL
  );

CREATE POLICY "experiences_insert_policy" ON experiences
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "experiences_update_policy" ON experiences
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) IS NOT NULL)
  WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "experiences_delete_policy" ON experiences
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) IS NOT NULL);


-- ============================================================================
-- 4. OPTIMIZE RLS POLICIES - MESSAGES TABLE
-- ============================================================================

DROP POLICY IF EXISTS "messages_select_policy" ON messages;
DROP POLICY IF EXISTS "messages_insert_policy" ON messages;
DROP POLICY IF EXISTS "messages_update_policy" ON messages;
DROP POLICY IF EXISTS "messages_delete_policy" ON messages;

CREATE POLICY "messages_select_policy" ON messages
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "messages_insert_policy" ON messages
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "messages_update_policy" ON messages
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) IS NOT NULL)
  WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "messages_delete_policy" ON messages
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) IS NOT NULL);


-- ============================================================================
-- 5. OPTIMIZE RLS POLICIES - PROJECTS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "projects_select_policy" ON projects;
DROP POLICY IF EXISTS "projects_insert_policy" ON projects;
DROP POLICY IF EXISTS "projects_update_policy" ON projects;
DROP POLICY IF EXISTS "projects_delete_policy" ON projects;

CREATE POLICY "projects_select_policy" ON projects
  FOR SELECT
  USING (true);

CREATE POLICY "projects_insert_policy" ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "projects_update_policy" ON projects
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) IS NOT NULL)
  WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "projects_delete_policy" ON projects
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) IS NOT NULL);


-- ============================================================================
-- 6. OPTIMIZE RLS POLICIES - RESUME_PROJECTS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "resume_projects_select_policy" ON resume_projects;
DROP POLICY IF EXISTS "resume_projects_insert_policy" ON resume_projects;
DROP POLICY IF EXISTS "resume_projects_update_policy" ON resume_projects;
DROP POLICY IF EXISTS "resume_projects_delete_policy" ON resume_projects;

CREATE POLICY "resume_projects_select_policy" ON resume_projects
  FOR SELECT
  USING (true);

CREATE POLICY "resume_projects_insert_policy" ON resume_projects
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "resume_projects_update_policy" ON resume_projects
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) IS NOT NULL)
  WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "resume_projects_delete_policy" ON resume_projects
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) IS NOT NULL);


-- ============================================================================
-- 7. OPTIMIZE RLS POLICIES - RESUMES TABLE
-- ============================================================================

DROP POLICY IF EXISTS "resumes_select_policy" ON resumes;
DROP POLICY IF EXISTS "resumes_insert_policy" ON resumes;
DROP POLICY IF EXISTS "resumes_update_policy" ON resumes;
DROP POLICY IF EXISTS "resumes_delete_policy" ON resumes;

CREATE POLICY "resumes_select_policy" ON resumes
  FOR SELECT
  USING (true);

CREATE POLICY "resumes_insert_policy" ON resumes
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "resumes_update_policy" ON resumes
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) IS NOT NULL)
  WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "resumes_delete_policy" ON resumes
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) IS NOT NULL);


-- ============================================================================
-- 8. DROP UNUSED INDEXES
-- ============================================================================

-- These indexes were created but are not being used by any queries
-- Removing them reduces storage overhead and improves write performance

DROP INDEX IF EXISTS idx_kanban_tickets_message_id;
DROP INDEX IF EXISTS idx_kanban_tickets_stage_id;
DROP INDEX IF EXISTS idx_messages_resume_id;
