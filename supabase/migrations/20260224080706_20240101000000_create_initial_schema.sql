/*
  # Initial Schema Creation

  Creates all base tables for the portfolio management system:
  - resumes: Portfolio/resume profiles
  - experiences: Work experience entries
  - artifacts: Supporting documents, images, videos
  - messages: Contact form submissions
  - kanban_stages: Workflow stage definitions
  - kanban_tickets: Project/task tickets
  
  All tables have RLS enabled with policies allowing public reads and authenticated writes.
*/

CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  image_url text DEFAULT NULL,
  intro_text text DEFAULT NULL,
  education jsonb DEFAULT NULL,
  skills text[] DEFAULT NULL,
  certifications jsonb DEFAULT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  title text NOT NULL,
  company text NOT NULL,
  description text NOT NULL,
  start_date text NOT NULL,
  end_date text DEFAULT NULL,
  location text DEFAULT NULL,
  employment_type text DEFAULT NULL,
  achievements text[] DEFAULT NULL,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS artifacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id uuid NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('document', 'image', 'video')),
  title text NOT NULL,
  url text NOT NULL,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  resume_id uuid DEFAULT NULL REFERENCES resumes(id) ON DELETE SET NULL,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS kanban_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS kanban_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT NULL,
  stage_id uuid NOT NULL REFERENCES kanban_stages(id) ON DELETE CASCADE,
  message_id uuid DEFAULT NULL REFERENCES messages(id) ON DELETE SET NULL,
  labels text[] DEFAULT NULL,
  due_date text DEFAULT NULL,
  notes text DEFAULT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE kanban_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE kanban_tickets ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "kanban_stages_select_policy" ON kanban_stages
  FOR SELECT
  USING (true);

CREATE POLICY "kanban_stages_insert_policy" ON kanban_stages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "kanban_stages_update_policy" ON kanban_stages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "kanban_stages_delete_policy" ON kanban_stages
  FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "kanban_tickets_select_policy" ON kanban_tickets
  FOR SELECT
  USING (true);

CREATE POLICY "kanban_tickets_insert_policy" ON kanban_tickets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "kanban_tickets_update_policy" ON kanban_tickets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "kanban_tickets_delete_policy" ON kanban_tickets
  FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE INDEX IF NOT EXISTS idx_resumes_display_order ON resumes(display_order);
CREATE INDEX IF NOT EXISTS idx_experiences_resume_id ON experiences(resume_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_experience_id ON artifacts(experience_id);
CREATE INDEX IF NOT EXISTS idx_messages_resume_id ON messages(resume_id);
CREATE INDEX IF NOT EXISTS idx_kanban_tickets_stage_id ON kanban_tickets(stage_id);
CREATE INDEX IF NOT EXISTS idx_kanban_tickets_message_id ON kanban_tickets(message_id);
