
const pool = require("../Config/database");

async function createDelivery(orderId, deliveryAddress) {
    const result = await pool.query(
        "INSERT INTO deliveries (order_id, delivery_address) VALUES ($1, $2) RETURNING *",
        [orderId, deliveryAddress]
    );
    return result.rows[0];
}

async function getAllDeliveries() {
    const result = await pool.query(
        `SELECT d.*, o.customer_name, o.total_amount
         FROM deliveries d
         JOIN orders o ON d.order_id = o.id
         ORDER BY d.id`
    );
    return result.rows;
}

async function getDeliveryById(id) {
    const result = await pool.query(
        `SELECT d.*, o.customer_name, o.total_amount
         FROM deliveries d
         JOIN orders o ON d.order_id = o.id
         WHERE d.id = $1`,
        [id]
    );
    return result.rows[0];
}
async function getDeliveryByOrderId(orderId) {
    const result = await pool.query(
        "SELECT * FROM deliveries WHERE order_id = $1",
        [orderId]
    );
    return result.rows[0];
}

async function updateDeliveryStatus(id, status) {
    const result = await pool.query(
        "UPDATE deliveries SET status = $1 WHERE id = $2 RETURNING *",
        [id, status]
    );
    return result.rows[0];
}

module.exports = {
    createDelivery,
    getAllDeliveries,
    getDeliveryById,
    getDeliveryByOrderId,
    updateDeliveryStatus,
};

