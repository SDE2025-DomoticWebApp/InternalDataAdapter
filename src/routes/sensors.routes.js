const express = require('express');
const router = express.Router();
const sensorsRepo = require('../repositories/sensors.repo');

// POST /sensors
router.post('/', (req, res) => {
    const { userEmail, type, name, secretHash } = req.body;

    if (!userEmail || !type || !name || !secretHash) {
        return res.status(400).json({ error: 'Missing required fields: userEmail, type, name, secretHash' });
    }

    try {
        console.log(`[Internal Data Adapter] Creating sensor in database: ${name} for user ${userEmail}`);
        const result = sensorsRepo.createSensor({
            userEmail,
            type,
            name,
            secretHash
        });

        console.log(`[Internal Data Adapter] Sensor successfully created: ${name} (ID: ${result.lastInsertRowid})`);
        res.status(201).json({ sensorId: result.lastInsertRowid });
    } catch (err) {
        console.log(`[Internal Data Adapter] Failed to create sensor ${name}: ${err.message}`);
        if (err.code === 'SQLITE_CONSTRAINT') {
            return res.status(409).json({ error: 'Constraint violation' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /sensors/:id
router.get('/:id', (req, res) => {
    const sensor = sensorsRepo.getSensorById(req.params.id);
    if (!sensor) return res.status(404).end();
    res.json(sensor);
});

// GET /sensors?userEmail=...
router.get('/', (req, res) => {
    const { userEmail } = req.query;
    if (!userEmail) {
        return res.status(400).json({ error: 'userEmail is required' });
    }
    const sensors = sensorsRepo.getSensorsByUser(userEmail);
    res.json(sensors);
});

// DELETE /sensors/:id
router.delete('/:id', (req, res) => {
    const result = sensorsRepo.deleteSensor(req.params.id);
    if (result.changes === 0) return res.status(404).end();
    res.status(204).end();
});

module.exports = router;
