import { defineConfig } from 'drizzle-kit';

/**
 * Drizzle Kit configuration for Expo SQLite
 * 
 * IMPORTANT: Expo SQLite uses a different API than standard SQLite.
 * 
 * Available commands:
 * - `npm run db:generate` - Generate migration files from schema changes (works!)
 * - `npm run db:introspect` - Introspect existing database schema (works!)
 * 
 * Limited/Not Available:
 * - `npm run db:studio` - Drizzle Studio requires better-sqlite3 or @libsql/client
 *   which are not compatible with Expo SQLite. Use your app's UI or a SQLite browser
 *   to inspect the database instead.
 * - `npm run db:push` - Not recommended for Expo SQLite. Use manual migrations
 *   via src/db/client.ts instead.
 * 
 * For actual migrations in Expo, you'll need to run them manually via
 * the expo-sqlite API (as done in src/db/client.ts).
 * 
 * To use Studio or push commands, you would need to:
 * 1. Install better-sqlite3: npm install --save-dev better-sqlite3
 * 2. Point to a local SQLite file (not the Expo-managed one)
 * 3. Note: This would only work for development, not production
 */
export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    // For Expo SQLite, the database file is managed by expo-sqlite
    // This path is used for reference - actual DB connection is handled in src/db/client.ts
    // Note: Studio/push commands won't work without better-sqlite3 or @libsql/client
    url: './since.db',
  },
  verbose: true,
  strict: true,
});

