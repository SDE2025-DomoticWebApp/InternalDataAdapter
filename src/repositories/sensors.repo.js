// src/repositories/sensors.repo.js
const db = require('../db/database');

/**
 * Create a new sensor
 */
function createSensor({ userEmail, type, name, secretHash }) {
    console.log(`[Sensors Repository] Inserting sensor into database: ${name} for user ${userEmail}`);
    const stmt = db.prepare(`
    INSERT INTO sensors (user_email, type, name, secret_hash)
    VALUES (?, ?, ?, ?)
  `);

    const result = stmt.run(userEmail, type, name, secretHash);
    console.log(`[Sensors Repository] Sensor inserted successfully: ${name} (ID: ${result.lastInsertRowid})`);
    return result;
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
    getSensorsByUser,
    deleteSensor
};
