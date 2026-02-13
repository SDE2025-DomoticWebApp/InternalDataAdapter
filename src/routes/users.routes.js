const express = require('express');
const router = express.Router();
const usersRepo = require('../repositories/users.repo');

router.post('/', (req, res) => {
    const { email, name, surname, passwordHash, location } = req.body;
    if (!email || !name || !surname || !passwordHash || !location) {
        return res.status(400).json({ error: 'Missing required fields: email, name, surname, passwordHash, location' });
    }

    try {
        console.log(`[Internal Data Adapter] Creating user in database: ${email} at ${location}`);
        usersRepo.createUser({ email, name, surname, passwordHash, location });
        console.log(`[Internal Data Adapter] User successfully created: ${email}`);
        res.status(201).end();
    } catch (err) {
        console.log(`[Internal Data Adapter] Failed to create user ${email}: ${err.message}`);
        if (err.code === 'SQLITE_CONSTRAINT') {
            return res.status(409).json({ error: 'User already exists' });
        }
        res.status(500).end();
    }
});

router.get('/:email', (req, res) => {
    console.log(`[Internal Data Adapter] Fetching user: ${req.params.email}`);
    const user = usersRepo.findByEmail(req.params.email);
    if (!user) {
        console.log(`[Internal Data Adapter] User not found: ${req.params.email}`);
        return res.status(404).end();
    }
    console.log(`[Internal Data Adapter] User found: ${req.params.email}`);
    res.json(user);
});

router.get('/locations', (req, res) => {
    console.log(`[Internal Data Adapter] Fetching users and locations...`);
    const usersLocations = usersRepo.getUsersLocations();
    if (!usersLocations) {
        console.log(`[Internal Data Adapter] Did not retrieve any users & locations.`);
        return res.status(404).end();
    }
    console.log(`[Internal Data Adapter] Users and locations found.`);
    res.json(usersLocations);
});

module.exports = router;
