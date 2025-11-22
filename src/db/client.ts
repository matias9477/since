import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as SQLite from 'expo-sqlite';
import * as schema from './schema';

let sqliteDb: SQLite.SQLiteDatabase | null = null;
let drizzleDb: ReturnType<typeof drizzle> | null = null;

/**
 * Initialize SQLite database connection
 */
const getDatabase = () => {
  if (!sqliteDb) {
    sqliteDb = SQLite.openDatabaseSync('since.db');
  }
  if (!drizzleDb) {
    drizzleDb = drizzle(sqliteDb, { schema });
  }
  return drizzleDb;
};

/**
 * Get or create database instance
 */
export const getDb = () => {
  return getDatabase();
};

/**
 * Run initial schema migration
 * Creates all tables if they don't exist
 */
const runMigrations = async () => {
  if (!sqliteDb) {
    sqliteDb = SQLite.openDatabaseSync('since.db');
  }

  // Create events table
  sqliteDb.execSync(`
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
    )
  `);

  // Create reminders table
  sqliteDb.execSync(`
    CREATE TABLE IF NOT EXISTS reminders (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      type TEXT NOT NULL,
      scheduled_at INTEGER,
      recurrence_rule TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    )
  `);

  // Create milestones table
  sqliteDb.execSync(`
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
    )
  `);

  // Create settings table
  sqliteDb.execSync(`
    CREATE TABLE IF NOT EXISTS settings (
      id TEXT PRIMARY KEY DEFAULT 'default',
      default_show_time_as TEXT NOT NULL DEFAULT 'days',
      use_system_theme INTEGER NOT NULL DEFAULT 1,
      theme TEXT NOT NULL DEFAULT 'light',
      language TEXT NOT NULL DEFAULT 'en',
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);

  // Ensure drizzleDb is initialized after migrations
  if (!drizzleDb && sqliteDb) {
    drizzleDb = drizzle(sqliteDb, { schema });
  }
};

/**
 * Initialize database schema (run migrations)
 * This should be called once at app startup
 */
export const initializeDatabase = async () => {
  // Run migrations to create tables
  await runMigrations();
  
  const db = getDb();
  
  if (!db) {
    throw new Error('Failed to initialize database connection');
  }
  
  // Initialize default settings if they don't exist
  const defaultSettings = await db.select().from(schema.settings).limit(1);
  
  if (defaultSettings.length === 0) {
    await db.insert(schema.settings).values({
      id: 'default',
      defaultShowTimeAs: 'days',
      useSystemTheme: true,
      theme: 'light',
      language: 'en',
    });
  }
  
  return db;
};

