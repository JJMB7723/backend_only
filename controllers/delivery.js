const deliveryService = require("../service/delivery");

async function createdelivery(req, res, next) {
    try {
        const { order_id, deliveryaddress } = req.body

        const delivery = await deliveryService.createdelivery(order_id, deliveryaddress);

        res.status(200).json({
            success: true,
            Message: "delivery created successfully",
            data: delivery
        })
    }
    catch (error) {
        ;
        next(error)
    }
}

//all deliveryies
async function getalldelivery(req, res, next) {
    try {
        const deliveries = await deliveryService.getalldelivery();

        res.status(200).json({
            success: true,
            Message: "got all deliveries",
            data: deliveries
        })
    }
    catch (error) {
        next(error)
    }
}
async function getdeliverybyid(res, req, next) {
    try {
        const id = req.params.id;
        const delivery = await deliveryService.getdeliverybyid(id);

        res.status(201).json({
            success: true,
            Message: "got the delivery by id",
            data: delivery
        })
    }
    catch (error) {
        throw (error);
    }
}

// update delivery

async function updatedeliverystaus(res, req, next) {
    try {
        const id = req.params.id;
        const { status } = req.body
        const delivery = await deliveryService.updatedeliverystaus(id, status)
        res, status(201).json({
            success: true,
            message: "updated successfully",
            data: delivery
        })
    }
    catch (error) {
        next(error)
    }
}
module.exports = {
    createDelivery,
    getAllDeliveries,
    getDeliveryById,
    updateDeliveryStatus,
};