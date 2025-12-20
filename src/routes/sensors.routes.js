const express = require('express');
const router = express.Router();
const sensorsRepo = require('../repositories/sensors.repo');

// POST /sensors
router.post('/', (req, res) => {
    const { userEmail, type, name, url } = req.body;

    if (!userEmail || !type || !name || !url) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const result = sensorsRepo.createSensor({
            userEmail,
            type,
            name,
            url
        });

        res.status(201).json({ sensorId: result.lastInsertRowid });
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
            return res.status(409).json({ error: 'Sensor already exists' });
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

// GET /sensors/by-url/:url
router.get('/by-url/:url', (req, res) => {
    const sensor = sensorsRepo.getSensorByUrl(req.params.url);
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
