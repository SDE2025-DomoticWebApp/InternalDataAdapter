-- =========================
-- USERS
-- =========================
CREATE TABLE IF NOT EXISTS users (
  email TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  surname TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  location TEXT NOT NULL
);

-- =========================
-- SENSORS
-- =========================
CREATE TABLE IF NOT EXISTS sensors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_email TEXT NOT NULL,
  type TEXT NOT NULL CHECK (
    type IN ('temperature', 'humidity', 'wind')
  ),
  name TEXT NOT NULL,
  secret_hash TEXT NOT NULL,

  FOREIGN KEY (user_email)
    REFERENCES users(email)
    ON DELETE CASCADE
);

-- =========================
-- MEASURES
-- =========================
CREATE TABLE IF NOT EXISTS measures (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sensor_id INTEGER NOT NULL,
  timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  value REAL NOT NULL,

  FOREIGN KEY (sensor_id)
    REFERENCES sensors(id)
    ON DELETE CASCADE
);

-- =========================
-- INDEXES (performance)
-- =========================
CREATE INDEX IF NOT EXISTS idx_sensors_user
  ON sensors(user_email);

CREATE INDEX IF NOT EXISTS idx_measures_sensor_time
  ON measures(sensor_id, timestamp);
