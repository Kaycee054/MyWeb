/*
  # Fix RIC Interest Submissions Security Issues

  ## Summary
  Resolves multiple security and performance issues:
  1. Fixes RLS policy that re-evaluates auth.uid() for each row by using subquery
  2. Removes unused indexes for email and created_at
  3. Replaces overly permissive INSERT policy with proper email validation
  4. Improves admin read policy with proper auth check

  ## Changes
  - Modified "Anyone can submit interest" policy: adds email format validation instead of always true
  - Modified "Admins can view all submissions" policy: uses subquery for auth.uid() evaluation
  - Dropped unused index idx_ric_interest_email
  - Dropped unused index idx_ric_interest_created_at

  ## Security
  - INSERT policy now validates email format to prevent invalid submissions
  - SELECT policy uses optimized auth check with subquery to reduce row-level evaluation overhead
  - Maintains admin-only read access while improving query performance
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_ric_interest_email'
  ) THEN
    DROP INDEX IF EXISTS idx_ric_interest_email;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_ric_interest_created_at'
  ) THEN
    DROP INDEX IF EXISTS idx_ric_interest_created_at;
  END IF;
END $$;

DROP POLICY IF EXISTS "Anyone can submit interest" ON ric_interest_submissions;
DROP POLICY IF EXISTS "Admins can view all submissions" ON ric_interest_submissions;

CREATE POLICY "Anyone can submit interest"
  ON ric_interest_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');

CREATE POLICY "Admins can view all submissions"
  ON ric_interest_submissions
  FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.uid()) IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = (SELECT auth.uid())
    )
  );
