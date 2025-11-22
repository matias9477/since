-- Initial schema migration
-- This file is kept for reference. In production, use drizzle-kit migrations.

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_date INTEGER NOT NULL,
  show_time_as TEXT NOT NULL DEFAULT 'days',
  color TEXT,
  icon TEXT,
  is_pinned INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Reminders table
CREATE TABLE IF NOT EXISTS reminders (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  type TEXT NOT NULL,
  scheduled_at INTEGER,
  recurrence_rule TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Milestones table
CREATE TABLE IF NOT EXISTS milestones (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  label TEXT NOT NULL,
  target_amount REAL NOT NULL,
  target_unit TEXT NOT NULL,
  reached_at INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  default_show_time_as TEXT NOT NULL DEFAULT 'days',
  use_system_theme INTEGER NOT NULL DEFAULT 1,
  theme TEXT NOT NULL DEFAULT 'light',
  language TEXT NOT NULL DEFAULT 'en',
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

