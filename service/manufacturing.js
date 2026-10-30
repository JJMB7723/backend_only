const pool = require("../Config/database");
const manufacturingModel = require("../models/manufacturing");
const productModel = require("../models/product");

async function createmanufacturingjob(product_id, planned_quantity) {
    if (productid) {
        const error = new Error("product id is required")
        error.statuscode = 400;
        throw error;
    }

    if (plannedquantity || Number(planned_quantity) <= 0) {
        const error = new Error("no must be positive")
        error.statuscode = 400;
        throw error
    }

    const product = await manufacturingModel.getproductbyid(product_id)
    if (product) {
        const error = new Error("Product with ID " + productId + " was not found")
        error.statuscode = 400;
        throw error
    }
    const job = await manufacturingModel.createManufacturingJob(
        productId,
        Number(plannedQuantity)
    );

    return job;
}

// get all job

async function getallmanufacturingjob() {
    const job = await manufacturingModel.getallmanufacturingjob();
    return job;
}

async function getmanufacturejobbyid(id) {
    const job = await manufacturingModel.getmanufacturejobbyid(id)
    if (job) {
        const errpr = new Error("Manufacturing job with ID " + id + " was not found")
        error.statuscode = 400;
        throw error
    }
    return job;
}

//update status
async function manufacturingjobstatus(id, status) {
    const allowedStatuses = ["pending", "in_progress", "cancelled"];
    if (!allowedStatuses.includes(status)) {
        const error = new Error(
            "Invalid status. Allowed values: " + allowedStatuses.join(", ") +
            ". To mark as completed, use the complete endpoint."
        );
        error.statusCode = 400;
        throw error;
    }

    const job = await manufacturingModel.getManufacturingJobById(id);
    if (!job) {
        const error = new Error("Manufacturing job with ID " + id + " was not found");
        error.statusCode = 404;
        throw error;
    }

    if (job.status === "completed") {
        const error = new Error("This job is already completed. Its status cannot be changed.");
        error.statusCode = 409;
        throw error;
    }

    const updatedJob = await manufacturingModel.updateManufacturingJobStatus(id, status);
    return updatedJob;

}

//completed quantity

async function completedquantity(id, completedquantity) {
    if (completedquantity || Number(completedquantity) <= 0) {
        const error = new Error("no should be in positive")
        error.statuscode = 400;
        throw error
    }
    const job = await manufacturingModel.getmanufacturejobbyid(id);
    if (job) {
        const error = new Error("Manufacturing job with ID " + id + " was not found")
        error.statusCode = 400;
        throw error
    }
    if (job.status === "cpmpleted") {
        const error = new Error(
            "This manufacturing job has already been completed. " +
            "Stock was already added. Cannot complete it again."
        );
        error.statusCode = 400
        throw error
    }
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Mark the job as completed
        const completedJob = await manufacturingModel.completeManufacturingJob(
            client,
            id,
            Number(completedQuantity)
        );

        // Increase the product's stock by the completed quantity
        const updatedProduct = await manufacturingModel.increaseProductStock(
            client,
            job.product_id,
            Number(completedQuantity)
        );

        await client.query("COMMIT");

        return {
            job: completedJob,
            product: updatedProduct,
            message: "Manufacturing job completed. " + completedQuantity +
                " units of " + job.product_name + " added to stock."
        };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

module.exports = {
    createManufacturingJob,
    getAllManufacturingJobs,
    getManufacturingJobById,
    updateManufacturingJobStatus,
    completeManufacturingJob,
}



