/*
  # Add display_order column to resumes table

  1. Changes
    - Add `display_order` column to `resumes` table
    - Set default values for existing records
    - Add index for performance

  2. Security
    - No changes to RLS policies needed
*/

-- Add display_order column to resumes table
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;

-- Set default display_order values for existing records based on creation order
UPDATE resumes 
SET display_order = subquery.row_number - 1
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as row_number
  FROM resumes
) AS subquery
WHERE resumes.id = subquery.id AND resumes.display_order = 0;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_resumes_display_order ON resumes (display_order);