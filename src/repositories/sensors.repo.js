// src/repositories/sensors.repo.js
const db = require('../db/database');

/**
 * Create a new sensor
 */
function createSensor({ userEmail, type, name, url }) {
    const stmt = db.prepare(`
    INSERT INTO sensors (user_email, type, name, url)
    VALUES (?, ?, ?, ?)
  `);

    return stmt.run(userEmail, type, name, url);
}

/**
 * Get a sensor by ID
 */
function getSensorById(sensorId) {
    return db
        .prepare('SELECT * FROM sensors WHERE id = ?')
        .get(sensorId);
}

/**
 * Get a sensor by URL (slug)
 */
function getSensorByUrl(url) {
    return db
        .prepare('SELECT * FROM sensors WHERE url = ?')
        .get(url);
}

/**
 * Get all sensors for a given user
 */
function getSensorsByUser(userEmail) {
    return db
        .prepare('SELECT * FROM sensors WHERE user_email = ?')
        .all(userEmail);
}

/**
 * Delete a sensor
 * (measures will be deleted automatically via ON DELETE CASCADE)
 */
function deleteSensor(sensorId) {
    return db
        .prepare('DELETE FROM sensors WHERE id = ?')
        .run(sensorId);
}

module.exports = {
    createSensor,
    getSensorById,
    getSensorByUrl,
    getSensorsByUser,
    deleteSensor
};
