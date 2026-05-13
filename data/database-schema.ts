/**
 * Database Schema for MedMatch Ghana
 * Supabase/PostgreSQL-compatible schema definitions
 * Use these SQL statements to set up the database
 */

export const DATABASE_SCHEMA = `
-- ============================================================================
-- USERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  name TEXT NOT NULL,
  institution TEXT,
  audience TEXT CHECK (audience IN ('medical-student', 'high-school', 'dental-student')),
  year_of_study INT,
  gpa DECIMAL(3, 2),
  location TEXT, -- Ghana region
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_audience ON users(audience);

-- ============================================================================
-- QUIZ ATTEMPTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  audience TEXT CHECK (audience IN ('medical-student', 'high-school', 'dental-student')),
  responses JSONB NOT NULL, -- { "1": 5, "2": 3, ... }
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  duration_seconds INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_completed_at ON quiz_attempts(completed_at);

-- ============================================================================
-- TRAIT SCORES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS trait_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_attempt_id UUID NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  trait_name TEXT NOT NULL, -- e.g., 'patientInteraction'
  score INT CHECK (score >= 1 AND score <= 100),
  percentile INT CHECK (percentile >= 0 AND percentile <= 100),
  interpretation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_trait_scores_quiz_attempt ON trait_scores(quiz_attempt_id);
CREATE INDEX idx_trait_scores_trait_name ON trait_scores(trait_name);

-- ============================================================================
-- SPECIALTY MATCHES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS specialty_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_attempt_id UUID NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  specialty_id TEXT NOT NULL,
  specialty_name TEXT NOT NULL,
  match_score INT CHECK (match_score >= 0 AND match_score <= 100),
  match_percentage INT CHECK (match_percentage >= 0 AND match_percentage <= 100),
  rank INT CHECK (rank >= 1),
  strengths TEXT[], -- ARRAY of strings
  challenges TEXT[],
  reasoning TEXT,
  confidence_level TEXT CHECK (confidence_level IN ('Low', 'Medium', 'High')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_specialty_matches_quiz_attempt ON specialty_matches(quiz_attempt_id);
CREATE INDEX idx_specialty_matches_rank ON specialty_matches(rank);
CREATE INDEX idx_specialty_matches_specialty_id ON specialty_matches(specialty_id);

-- ============================================================================
-- ASSESSMENT RESULTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_attempt_id UUID NOT NULL UNIQUE REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  trait_scores JSONB NOT NULL, -- Full trait score object
  top_matches JSONB NOT NULL, -- Array of top 5 matches
  personality_summary TEXT,
  personality_type TEXT,
  suggested_next_steps TEXT[],
  study_recommendations TEXT[],
  ghana_specific_guidance TEXT[],
  generated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assessment_results_user_id ON assessment_results(user_id);
CREATE INDEX idx_assessment_results_created_at ON assessment_results(created_at);

-- ============================================================================
-- SAVED REPORTS (FOR SHARING)
-- ============================================================================
CREATE TABLE IF NOT EXISTS saved_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  assessment_result_id UUID NOT NULL REFERENCES assessment_results(id) ON DELETE CASCADE,
  shareable_url TEXT UNIQUE,
  is_public BOOLEAN DEFAULT FALSE,
  view_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_saved_reports_user_id ON saved_reports(user_id);
CREATE INDEX idx_saved_reports_shareable_url ON saved_reports(shareable_url);
CREATE INDEX idx_saved_reports_is_public ON saved_reports(is_public);

-- ============================================================================
-- AUDIT LOG TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- 'quiz_started', 'quiz_completed', 'result_shared', etc.
  user_id UUID REFERENCES users(id),
  entity_id UUID, -- quiz_attempt_id or assessment_result_id
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_log_event_type ON audit_log(event_type);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);

-- ============================================================================
-- ANALYTICS TABLE (for dashboard metrics)
-- ============================================================================
CREATE TABLE IF NOT EXISTS analytics_daily (
  date DATE PRIMARY KEY DEFAULT CURRENT_DATE,
  total_quizzes_started INT DEFAULT 0,
  total_quizzes_completed INT DEFAULT 0,
  unique_users INT DEFAULT 0,
  top_specialty_id TEXT,
  average_completion_time INT, -- seconds
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY (optional but recommended)
-- ============================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_reports ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- SAMPLE ROW LEVEL SECURITY POLICIES
-- ============================================================================
-- Users can only view their own data
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid()::uuid = id);

-- Allow anonymous quiz submissions
CREATE POLICY "Anyone can insert quiz attempts"
  ON quiz_attempts FOR INSERT
  WITH CHECK (true);
`;

// SQL to create indexed views for common queries
export const ANALYTICS_VIEWS = `
-- Top specialties by interest
CREATE OR REPLACE VIEW top_specialties_by_interest AS
SELECT
  specialty_id,
  specialty_name,
  COUNT(*) as interest_count,
  AVG(match_percentage::numeric) as avg_match_percentage,
  COUNT(CASE WHEN rank = 1 THEN 1 END) as top_1_count
FROM specialty_matches
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY specialty_id, specialty_name
ORDER BY interest_count DESC;

-- User demographics summary
CREATE OR REPLACE VIEW user_demographics AS
SELECT
  audience,
  COUNT(*) as user_count,
  COUNT(DISTINCT EXTRACT(YEAR FROM age(NOW(), created_at))) as active_months,
  AVG(EXTRACT(EPOCH FROM (updated_at - created_at))) as avg_active_duration_seconds
FROM users
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY audience;

-- Quiz completion rates
CREATE OR REPLACE VIEW quiz_completion_stats AS
SELECT
  DATE(qa.created_at) as date,
  COUNT(DISTINCT qa.id) as attempts,
  COUNT(DISTINCT ar.id) as completed,
  ROUND(100.0 * COUNT(DISTINCT ar.id) / COUNT(DISTINCT qa.id), 2) as completion_rate,
  AVG(qa.duration_seconds) as avg_duration_seconds
FROM quiz_attempts qa
LEFT JOIN assessment_results ar ON qa.id = ar.quiz_attempt_id
WHERE qa.created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(qa.created_at)
ORDER BY date DESC;
`;

export const DATABASE_SEED_DATA = `
-- Sample data for testing (optional)
-- Do not use in production; use seed functions instead

INSERT INTO users (email, name, institution, audience, year_of_study, location)
VALUES
  ('student1@example.com', 'Ama Mensah', 'University of Ghana', 'medical-student', 3, 'Greater Accra'),
  ('student2@example.com', 'Kwame Asante', 'KNUST', 'medical-student', 2, 'Ashanti'),
  ('student3@example.com', 'Efua Osei', 'University of Ghana', 'dental-student', 1, 'Greater Accra')
ON CONFLICT DO NOTHING;
`;

export function printDatabaseSchema(): void {
  console.log(DATABASE_SCHEMA);
}

export function printAnalyticsViews(): void {
  console.log(ANALYTICS_VIEWS);
}

/**
 * Utility: Get CREATE TABLE statement for a specific table
 */
export function getCreateTableStatement(tableName: string): string | null {
  const statements: Record<string, string> = {
    users: "CREATE TABLE IF NOT EXISTS users ( id UUID PRIMARY KEY DEFAULT gen_random_uuid(), ...",
    quiz_attempts:
      "CREATE TABLE IF NOT EXISTS quiz_attempts ( id UUID PRIMARY KEY DEFAULT gen_random_uuid(), ...",
    assessment_results:
      "CREATE TABLE IF NOT EXISTS assessment_results ( id UUID PRIMARY KEY DEFAULT gen_random_uuid(), ..."
  };

  return statements[tableName] || null;
}
