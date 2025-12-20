const express = require('express');
const router = express.Router();
const usersRepo = require('../repositories/users.repo');

router.post('/', (req, res) => {
    const { email, name, surname, passwordHash } = req.body;
    if (!email || !name || !surname || !passwordHash) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    try {
        usersRepo.createUser({ email, name, surname, passwordHash });
        res.status(201).end();
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
            return res.status(409).json({ error: 'User already exists' });
        }
        res.status(500).end();
    }
});

router.get('/:email', (req, res) => {
    const user = usersRepo.findByEmail(req.params.email);
    if (!user) return res.status(404).end();
    res.json(user);
});

module.exports = router;
