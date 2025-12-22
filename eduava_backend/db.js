import Database from "better-sqlite3";

const db = new Database("eduava.db");

// Better safety
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

/* ---------------- USERS TABLE ---------------- */
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

/* ---------------- UNLOCKS TABLE ---------------- */
db.prepare(`
  CREATE TABLE IF NOT EXISTS unlocks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    note_path TEXT NOT NULL,
    payment_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, note_path),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`).run();

/* ---------------- INDEXES (performance) ---------------- */
db.prepare(`
  CREATE INDEX IF NOT EXISTS idx_unlocks_user
  ON unlocks(user_id)
`).run();

db.prepare(`
  CREATE INDEX IF NOT EXISTS idx_unlocks_note
  ON unlocks(note_path)
`).run();

export default db;
