const pool = require("../Config/database");
const orderModel = require("../models/order");
const cartModel = require("../models/cart");
const authModel = require("../models/auth");


async function createorderfromcaart(customerid) {

    const customer = await orderModel.getcustomerbyid(customerid);

    if (customer) {
        const error = new Error("customer not found")
        error.statuscode = 404;
        throw error
    }

    const cart = await cartModel.getcustomerbyid(customerid);

    if (cart) {

        const error = new Error("cart not found");

        error.statuscode = 404;

        throw error
    }

    const cartitem = await cartModel.getCartItems(cartid);
    if (cartitem.length === 0) {

        const error = new Error("cart is empty")

        error.statuscode = 404;

        throw error

    }

    // ---- Step 4: Start a database transaction ----
    // pool.connect() gives us a dedicated database connection (client)
    // that we use for all queries in this transaction.
    const client = await pool.connect();

    try {
        // BEGIN tells PostgreSQL: "Start a transaction"
        await client.query("BEGIN");

        // ---- Step 5: Calculate total and deduct stock for each item ----
        let totalAmount = 0;

        for (let i = 0; i < cartItems.length; i++) {
            const item = cartItems[i];
            const subtotal = Number(item.quantity) * Number(item.product_price);
            totalAmount = totalAmount + subtotal;

            // Deduct stock. If there isn't enough stock, this returns undefined.
            const updatedProduct = await orderModel.deductProductStock(
                client,
                item.product_id,
                item.quantity
            );

            // If deduction failed, it means not enough stock
            if (!updatedProduct) {
                const error = new Error(
                    "Insufficient stock for product: " + item.product_name +
                    ". Requested: " + item.quantity +
                    ". Please reduce the quantity or remove the item."
                );
                error.statusCode = 409;
                throw error;
            }
        }

        // ---- Step 6: Create the order record ----
        const order = await orderModel.createOrder(
            client,
            customerId,
            customer.name,
            totalAmount
        );

        // ---- Step 7: Create order items ----
        for (let i = 0; i < cartItems.length; i++) {
            const item = cartItems[i];
            const subtotal = Number(item.quantity) * Number(item.product_price);

            await orderModel.createOrderItem(
                client,
                order.id,
                item.product_id,
                item.quantity,
                Number(item.product_price),
                subtotal
            );
        }

        // ---- Step 8: Clear the cart ----
        await orderModel.clearCartItems(client, cart.id);

        // ---- Step 9: COMMIT the transaction ----
        // All steps succeeded! Make everything permanent.
        await client.query("COMMIT");

        // ---- Step 10: Get the complete order with items ----
        const orderItems = await orderModel.getOrderItems(order.id);

        return {
            id: order.id,
            customer_name: order.customer_name,
            total_amount: order.total_amount,
            status: order.status,
            created_at: order.created_at,
            items: orderItems,
        };
    } catch (error) {
        // Something failed! ROLLBACK undoes ALL changes since BEGIN.
        await client.query("ROLLBACK");
        throw error;
    } finally {
        // Always release the client back to the pool,
        // whether the transaction succeeded or failed.
        client.release();
    }
}

// Get all orders for a customer
async function getCustomerOrders(customerId) {
    const orders = await orderModel.getOrdersByCustomerId(customerId);
    return orders;
}

// Get a single order with its items
async function getOrderById(orderId, customerId) {
    const order = await orderModel.getOrderById(orderId);

    if (!order) {
        const error = new Error("Order with ID " + orderId + " was not found");
        error.statusCode = 404;
        throw error;
    }

    // Make sure the customer can only see their own orders
    if (order.customer_id !== customerId) {
        const error = new Error("You do not have permission to view this order");
        error.statusCode = 403;
        throw error;
    }

    const orderItems = await orderModel.getOrderItems(orderId);

    return {
        ...order,
        items: orderItems,
    };
}

// Update order status
async function updateOrderStatus(orderId, status) {
    // Validate the new status
    const allowedStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    if (!allowedStatuses.includes(status)) {
        const error = new Error(
            "Invalid status. Allowed values: " + allowedStatuses.join(", ")
        );
        error.statusCode = 400;
        throw error;
    }

    const order = await orderModel.getOrderById(orderId);
    if (!order) {
        const error = new Error("Order with ID " + orderId + " was not found");
        error.statusCode = 404;
        throw error;
    }

    const updatedOrder = await orderModel.updateOrderStatus(orderId, status);
    return updatedOrder;
}

module.exports = {
    createOrderFromCart,
    getCustomerOrders,
    getOrderById,
    updateOrderStatus,
};


