const deliveryService = require("../service/delivery");

async function createdelivery(req, res, next) {
    try {
        const { order_id, deliveryaddress } = req.body;

        const delivery = await deliveryService.createDelivery(order_id, deliveryaddress);

        res.status(200).json({
            success: true,
            Message: "delivery created successfully",
            data: delivery
        });
    }
    catch (error) {
        next(error);
    }
}

//all deliveryies
async function getalldelivery(req, res, next) {
    try {
        const deliveries = await deliveryService.getAllDeliveries();

        res.status(200).json({
            success: true,
            Message: "got all deliveries",
            data: deliveries
        });
    }
    catch (error) {
        next(error);
    }
}
async function getdeliverybyid(req, res, next) {
    try {
        const id = req.params.id;
        const delivery = await deliveryService.getDeliveryById(id);

        res.status(200).json({
            success: true,
            Message: "got the delivery by id",
            data: delivery
        });
    }
    catch (error) {
        next(error);
    }
}

// update delivery
async function updatedeliverystaus(req, res, next) {
    try {
        const id = req.params.id;
        const { status } = req.body;
        const delivery = await deliveryService.updateDeliveryStatus(id, status);
        res.status(200).json({
            success: true,
            message: "updated successfully",
            data: delivery
        });
    }
    catch (error) {
        next(error);
    }
}

module.exports = {
    createDelivery: createdelivery,
    getAllDeliveries: getalldelivery,
    getDeliveryById: getdeliverybyid,
    updateDeliveryStatus: updatedeliverystaus,
    createdelivery,
    getalldelivery,
    getdeliverybyid,
    updatedeliverystaus,
};
