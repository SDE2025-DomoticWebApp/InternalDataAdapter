const express = require('express');
const router = express.Router();
const usersRepo = require('../repositories/users.repo');

router.post('/', (req, res) => {
    const { email, name, surname, passwordHash } = req.body;
    if (!email || !name || !surname || !passwordHash) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    try {
        console.log(`[Internal Data Adapter] Creating user in database: ${email}`);
        usersRepo.createUser({ email, name, surname, passwordHash });
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

module.exports = router;
