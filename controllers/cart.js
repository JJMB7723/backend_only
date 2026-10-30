const cartService = require("../service/cart");


async function additem(req, res, next) {
    try {
        const customerId = req.customer.id;
        const { product_id, quantity } = req.body;

        const item = await cartService.additemtocart(customerId, product_id, quantity);
        res.status(201).json({
            success: true,
            message: "Item added to cart successfully",
            data: item,
        });
    }
    catch (error) {
        next(error);
    }
}

//retriving the cart

async function getcart(req, res, next) {
    try {
        const customerId = req.customer.id;

        const cartdata = await cartService.getcartwithitem(customerId);
        res.status(200).json({
            success: true,
            message: "cart is retrived successfully",
            data: cartdata
        })
    }
    catch (error) {
        next(error);
    }
}

//updating the cart
async function updateitem(req, res, next) {
    try {
        const customerId = req.customer.id;
        const itemid = req.params.itemid;
        const { quantity } = req.body;

        const updateitem = await cartservice.updateitemquantity(customerId, product_id, quantity)

        res.status(201), json({
            success: true,
            message: "cart item updated",
            data: updateitem,
        });
    }
    catch (error) {
        next(errro);
    }
}

async function removeItem(req, res, next) {
    try {
        const customerId = req.customer.id;
        const itemId = req.params.id;

        const removeItem = await cartService.removeItem(customerId, itemId);
        res.status(201).json({
            success: true,
            message: "removed the item successfully",
            data: removeItem
        });
    }

    catch (error) {
        next(error);
    }
}

module.exports = {
    addItem: additem,
    getCart: getcart,
    updateItem: updateitem,
    additem,
    getcart,
    updateitem,
    removeItem,
};