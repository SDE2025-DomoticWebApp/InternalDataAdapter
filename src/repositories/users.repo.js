const db = require('../db/database');

function createUser(user) {
    console.log(`[Users Repository] Inserting user into database: ${user.email} (Location: ${user.location})`);
    const stmt = db.prepare(`
    INSERT INTO users (email, name, surname, password_hash, location)
    VALUES (?, ?, ?, ?, ?)
  `);
    const result = stmt.run(
        user.email,
        user.name,
        user.surname,
        user.passwordHash,
        user.location
    );
    console.log(`[Users Repository] User inserted successfully: ${user.email}`);
    return result;
}

function findByEmail(email) {
    return db
        .prepare('SELECT * FROM users WHERE email = ?')
        .get(email);
}

function getUsersLocations() {
    return db
        .prepare('SELECT email,location FROM users')
        .all();
}

module.exports = {
    createUser,
    findByEmail,
    getUsersLocations
};
