const pool = require("../Config/database");

async function createCustomer(name, email, hashedPassword) {
    const result = await pool.query(
        "INSERT INTO customers (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at",
        [name, email, hashedPassword]
    );
    return result.rows[0];
}

async function getCustomerByEmail(email) {
    const result = await pool.query(
        "SELECT * FROM customers WHERE email = $1",
        [email]
    );
    return result.rows[0];
}

async function getCustomerById(id) {
    const result = await pool.query(
        "SELECT id, name, email, created_at FROM customers WHERE id = $1",
        [id]
    );
    return result.rows[0];
}

module.exports = {
    createCustomer,
    getCustomerByEmail,
    getCustomerById,
    // aliases for case-insensitivity:
    getcustomerbyemail: getCustomerByEmail,
    getcustomerbyid: getCustomerById,
};
