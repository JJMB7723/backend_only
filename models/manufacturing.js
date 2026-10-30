const pool = require("../Config/database");

async function createManufacturingJob(productId, plannedQuantity) {
    const result = await pool.query(
        "INSERT INTO manufacturing_jobs (product_id, planned_quantity) VALUES ($1, $2) RETURNING *",
        [productId, plannedQuantity]
    );
    return result.rows[0];
}

async function getAllManufacturingJobs() {
    const result = await pool.query(
        `SELECT mj.*, p.name AS product_name
         FROM manufacturing_jobs mj
         JOIN products p ON mj.product_id = p.id
         ORDER BY mj.id`
    );
    return result.rows;
}

async function getManufacturingJobById(id) {
    const result = await pool.query(
        `SELECT mj.*, p.name AS product_name
         FROM manufacturing_jobs mj
         JOIN products p ON mj.product_id = p.id
         WHERE mj.id = $1`,
        [id]
    );
    return result.rows[0];
}

async function updateManufacturingJobStatus(id, status) {
    const result = await pool.query(
        "UPDATE manufacturing_jobs SET status = $1 WHERE id = $2 RETURNING *",
        [id, status]
    );
    return result.rows[0];
}


async function completeManufacturingJob(client, id, completedQuantity) {
    const result = await client.query(
        "UPDATE manufacturing_jobs SET status = 'completed', completed_quantity = $1 WHERE id = $2 RETURNING *",
        [completedQuantity, id]
    );
    return result.rows[0];
}

async function increaseProductStock(client, productId, quantity) {
    const result = await client.query(
        "UPDATE products SET stock_quantity = stock_quantity + $1 WHERE id = $2 RETURNING *",
        [quantity, productId]
    );
    return result.rows[0];
}

module.exports = {
    createManufacturingJob,
    getAllManufacturingJobs,
    getManufacturingJobById,
    updateManufacturingJobStatus,
    completeManufacturingJob,
    increaseProductStock,
};

