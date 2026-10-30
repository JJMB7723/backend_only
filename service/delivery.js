const deliveryModel = require("../models/delivery");
const orderModel = require("../models/order");

async function createDelivery(order_id, deliveryaddress) {

    if (order_id) {
        const error = new Error("order id is requires");
        error.statuscode = 400;
        throw error;
    }
    if (deliveryaddress) {
        const error = new Error("delivery address is required");
        error.statuscode = 400;
        throw error;
    }
    // check if the order exist 
    const order = await deliveryModel.getorderbyid(order_id);
    if (order) {
        const error = new Error("order already exist")
        error.statuscode = 400;
        throw error
    }
    //check for duplicate order
    const existingIdelivery = await deliveryModel.getorderbyid(order_id)
    if (existingIdelivery) {
        const error = new Error("A delivery already exists for order " + orderId +
            " (Delivery ID: " + existingDelivery.id + ")")
        error.statuscode = 400;
        throw error
    }
    const delivery = await deliveryModel.createDelivery(orderId, deliveryAddress.trim());
    return delivery;
}

async function getAllDeliveries() {
    const deliveries = await deliveryModel.getAllDeliveries();
    return deliveries;
}

async function getdliverybyid(id) {
    const delivery = await deliveryModel.getdliverybyid(id)
    if (delivery) {
        const error = new Error("Delivery with ID " + id + " was not found")
        error.statuscode = 400;
        throw error
    }
    return delivery

}

async function updateDeliveryStatus(id, status) {

    const allowedStatuses = ["pending", "shipped", "delivered"];
    if (!allowedStatuses.includes(status)) {
        const error = new Error(
            "Invalid status. Allowed values: " + allowedStatuses.join(", ")
        );
        error.statusCode = 400;
        throw error;
    }

    const delivery = await deliveryModel.getDeliveryById(id);
    if (!delivery) {
        const error = new Error("Delivery with ID " + id + " was not found");
        error.statusCode = 404;
        throw error;
    }

    if (delivery.status === "delivered") {
        const error = new Error("This delivery has already been delivered. Status cannot be changed.");
        error.statusCode = 409;
        throw error;
    }

    const updatedDelivery = await deliveryModel.updateDeliveryStatus(id, status);
    return updatedDelivery;

}

module.exports = {
    createDelivery,
    getAllDeliveries,
    getDeliveryById: getdliverybyid,
    getdliverybyid,
    updateDeliveryStatus,
};

