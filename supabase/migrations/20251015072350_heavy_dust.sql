/*
  # Enhanced Resume Platform Schema

  1. New Tables
    - `projects` - Store detailed project information with rich content
    - `resume_projects` - Link projects to specific resumes
    
  2. Enhanced Tables
    - `resumes` - Added intro_text, education, skills, certifications
    - `experiences` - Added location, employment_type, achievements
    
  3. Security
    - Enable RLS on all tables
    - Add policies for authenticated users and public access
    
  4. Features
    - Rich text content support for projects
    - Project-resume associations
    - Enhanced resume and experience fields
    - Skills and certifications tracking
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  content jsonb DEFAULT '{"blocks": []}'::jsonb,
  technologies text[] DEFAULT NULL,
  start_date text NOT NULL,
  end_date text DEFAULT NULL,
  status text DEFAULT 'completed' CHECK (status IN ('completed', 'in_progress', 'planned')),
  featured_image text DEFAULT NULL,
  gallery text[] DEFAULT NULL,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create resume_projects junction table
CREATE TABLE IF NOT EXISTS resume_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(resume_id, project_id)
);

-- Add new columns to resumes table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'resumes' AND column_name = 'intro_text'
  ) THEN
    ALTER TABLE resumes ADD COLUMN intro_text text DEFAULT NULL;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'resumes' AND column_name = 'education'
  ) THEN
    ALTER TABLE resumes ADD COLUMN education jsonb DEFAULT NULL;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'resumes' AND column_name = 'skills'
  ) THEN
    ALTER TABLE resumes ADD COLUMN skills text[] DEFAULT NULL;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'resumes' AND column_name = 'certifications'
  ) THEN
    ALTER TABLE resumes ADD COLUMN certifications jsonb DEFAULT NULL;
  END IF;
END $$;

-- Add new columns to experiences table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'experiences' AND column_name = 'location'
  ) THEN
    ALTER TABLE experiences ADD COLUMN location text DEFAULT NULL;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'experiences' AND column_name = 'employment_type'
  ) THEN
    ALTER TABLE experiences ADD COLUMN employment_type text DEFAULT NULL;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'experiences' AND column_name = 'achievements'
  ) THEN
    ALTER TABLE experiences ADD COLUMN achievements text[] DEFAULT NULL;
  END IF;
END $$;

-- Enable RLS on new tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_projects ENABLE ROW LEVEL SECURITY;

-- Create policies for projects
CREATE POLICY "Public can read projects"
  ON projects
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for resume_projects
CREATE POLICY "Public can read resume projects"
  ON resume_projects
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage resume projects"
  ON resume_projects
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_is_featured ON projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);
CREATE INDEX IF NOT EXISTS idx_resume_projects_resume_id ON resume_projects(resume_id);
CREATE INDEX IF NOT EXISTS idx_resume_projects_project_id ON resume_projects(project_id);
CREATE INDEX IF NOT EXISTS idx_resume_projects_order ON resume_projects(resume_id, order_index);