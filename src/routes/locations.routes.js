const express = require('express');
const router = express.Router();
const usersRepo = require('../repositories/users.repo');

router.get('/', (req, res) => {
    console.log(`[Internal Data Adapter] Fetching users and locations...`);
    const usersLocations = usersRepo.getUsersLocations();
    if (!usersLocations) {
        console.log(`[Internal Data Adapter] Did not retrieve any users & locations.`);
        return res.status(404).end();
    }
    console.log(`[Internal Data Adapter] Users and locations found.`);
    console.log(JSON.stringify(usersLocations, null, 2))
    res.json(usersLocations);
});

module.exports = router;
