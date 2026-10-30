const { getDeliveryByOrderId } = require("../models/delivery");
const orderService = require("../service/order");

async function createorder(req, res, next) {
    try {
        const customerid = req.customer.id;

        const order = await orderService.createorderfromcart(customerid);

        res.status(201).json({
            success: true,
            message: "successful",
            data: order
        })
    }
    catch (error) {
        next(error)
    }
}

// getting my order 

async function gettingorder(req, res, next) {
    try {
        const customerid = req.customer.id;
        const orders = await orderService.gettingcustomerorder(customerid);

        res.status(201).json({
            success: true,
            message: "successful",
            data: orders
        })
    }
    catch (error) {
        next(error)
    }
}

async function getorderbyid(req, res, next) {
    try {
        const customerid = req.customer.id;

        const OrderId = req.order.id;

        const order = await orderService.getorderbyid(customerid, OrderId)

        res.status(201).json({
            success: true,
            message: "success",
            data: order
        })
    }
    catch (error) {
        next(error)
    }
}

async function updateorderstatus(req, res, next) {
    try {
        const OrderId = req.params.id;

        const { status } = req.body;

        const order = await orderService.updateorderstatus(OrderId, status);

        res.status(201).json({
            success: true,
            message: "successful",
            data: order
        })
    }
    catch (error) {
        next(error)
    }
}

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
};
