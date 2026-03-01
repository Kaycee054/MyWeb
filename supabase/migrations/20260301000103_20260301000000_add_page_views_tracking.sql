/*
  # Add Page Views and Visitor Tracking

  ## Summary
  Creates tables to track visitor analytics including geographic location data, 
  page views, and visitor identity information when available.

  ## New Tables
  - `page_views`
    - `id` (uuid, primary key)
    - `visitor_id` (text) - Anonymous or logged-in visitor identifier
    - `page_path` (text) - URL path visited
    - `referrer` (text nullable) - HTTP referrer
    - `user_agent` (text) - Browser/device info
    - `country` (text nullable) - Country from IP geolocation
    - `city` (text nullable) - City from IP geolocation
    - `region` (text nullable) - Region/state from IP geolocation
    - `ip_address` (text nullable) - Last octet only (privacy-friendly)
    - `visitor_name` (text nullable) - Name if visitor submitted form
    - `visitor_email` (text nullable) - Email if visitor submitted form
    - `session_duration` (integer nullable) - Time spent in seconds
    - `created_at` (timestamptz)

  - `visitor_sessions`
    - `id` (uuid, primary key)
    - `visitor_id` (text, unique)
    - `first_visit` (timestamptz)
    - `last_visit` (timestamptz)
    - `total_pages_viewed` (integer)
    - `country` (text nullable)
    - `city` (text nullable)
    - `has_contacted` (boolean)
    - `contact_email` (text nullable)

  ## Security
  - Enable RLS on both tables
  - Authenticated users can view all visitor data
  - Public cannot access visitor data
*/

CREATE TABLE IF NOT EXISTS page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id text NOT NULL,
  page_path text NOT NULL,
  referrer text DEFAULT NULL,
  user_agent text DEFAULT NULL,
  country text DEFAULT NULL,
  city text DEFAULT NULL,
  region text DEFAULT NULL,
  ip_address text DEFAULT NULL,
  visitor_name text DEFAULT NULL,
  visitor_email text DEFAULT NULL,
  session_duration integer DEFAULT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS visitor_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id text UNIQUE NOT NULL,
  first_visit timestamptz DEFAULT now(),
  last_visit timestamptz DEFAULT now(),
  total_pages_viewed integer DEFAULT 1,
  country text DEFAULT NULL,
  city text DEFAULT NULL,
  has_contacted boolean DEFAULT false,
  contact_email text DEFAULT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "page_views_select_policy" ON page_views
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "page_views_insert_policy" ON page_views
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "visitor_sessions_select_policy" ON visitor_sessions
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "visitor_sessions_insert_policy" ON visitor_sessions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "visitor_sessions_update_policy" ON visitor_sessions
  FOR UPDATE
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_page_views_visitor_id ON page_views(visitor_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_country ON page_views(country);
CREATE INDEX IF NOT EXISTS idx_page_views_city ON page_views(city);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_country ON visitor_sessions(country);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_last_visit ON visitor_sessions(last_visit DESC);
