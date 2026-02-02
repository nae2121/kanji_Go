/*
  # Kanji de Go - Database Schema

  1. New Tables
    - `kanji_questions`
      - `id` (uuid, primary key) - Unique question identifier
      - `kanji` (text) - The kanji character(s)
      - `yomi` (text) - Correct reading in hiragana
      - `level` (integer) - Difficulty level (1=beginner, 2=intermediate, 3=advanced)
      - `meaning` (text) - Optional meaning/context
      - `created_at` (timestamptz) - Creation timestamp
    
    - `scores`
      - `id` (uuid, primary key) - Unique score record identifier
      - `player_name` (text) - Player name (guest or registered)
      - `score` (integer) - Final score
      - `correct_count` (integer) - Number of correct answers
      - `total_count` (integer) - Total questions attempted
      - `level` (integer) - Game difficulty level
      - `play_time` (integer) - Time taken in seconds
      - `created_at` (timestamptz) - Timestamp of play

  2. Security
    - Enable RLS on all tables
    - Public read access for kanji_questions
    - Public insert access for scores (guest play)
    - Public read access for scores (ranking)
*/

CREATE TABLE IF NOT EXISTS kanji_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kanji text NOT NULL,
  yomi text NOT NULL,
  level integer NOT NULL DEFAULT 1,
  meaning text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  score integer NOT NULL DEFAULT 0,
  correct_count integer NOT NULL DEFAULT 0,
  total_count integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  play_time integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE kanji_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read kanji questions"
  ON kanji_questions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert scores"
  ON scores FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read scores"
  ON scores FOR SELECT
  USING (true);

CREATE INDEX IF NOT EXISTS idx_kanji_questions_level ON kanji_questions(level);
CREATE INDEX IF NOT EXISTS idx_scores_score ON scores(score DESC);
CREATE INDEX IF NOT EXISTS idx_scores_created_at ON scores(created_at DESC);