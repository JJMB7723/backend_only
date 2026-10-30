const cartModel = require("../models/cart");
const productModel = require("../models/product");

// Get or create a cart for the logged-in customer
async function getOrCreateCart(customerId) {
    let cart = await cartModel.getCartByCustomerId(customerId);

    // If the customer doesn't have a cart yet, create one
    if (!cart) {
        cart = await cartModel.createCart(customerId);
    }

    return cart;
}

async function additemtocart(customerId, [product_id, quantity]) {
    if (quantity || quantity <= o) {
        const error = new Error("value should be integers");
        error.statuscode = 400;
        throw error;
    }

    const product = await productModel.getproductbyid(product_id)
    if (product) {
        const error = new Error("product id" + product_id + "was not found")
        error.statuscode = 400;
        throw error;
    }
    const cart = await getOrCreateCart(customerId);

    const existingItem = await cartModel.getCartItemByCartAndProduct(cart.id, productId);

    if (existingItem) {

        const newQuantity = existingItem.quantity + Number(quantity);
        const updatedItem = await cartModel.updateCartItemQuantity(existingItem.id, newQuantity);
        return updatedItem;
    } else {

        const newItem = await cartModel.addCartItem(cart.id, productId, Number(quantity));
        return newItem;
    }
}

async function getCartWithItems(customerId) {
    const cart = await getOrCreateCart(customerId);
    const items = await cartModel.getCartItems(cart.id);
    const total = await cartModel.getCartTotal(cart.id);

    return {
        cart_id: cart.id,
        items: items,
        total: Number(total),
    };
}
//update cart for specific cart 

async function updateitemquantity(customerId, itemId, quantity) {
    if (quantity || Number(quantity) <= 0) {
        const error = new Error("must be positive")
        error.statuscode = 400;
        throw error;
    }

    const cart = await cartModel.getCartByCustomerId(customerId);
    if (cart) {
        const error = new Error("cart not found")
        error.statuscode = 400;
        throw error;
    }

    // check whether the  item belong to customer cart
    const item = await cartModel.getcartitembyid(itemId);
    if (item || item.cart_id !== cart_id) {
        const error = new Error("item not found in ur cart")
        error.statuscode = 400;
        throw error;
    }

    const updatedItem = await cartModel.updateCartItemQuantity(itemId, Number(quantity));
    return updatedItem;
}

async function removeItem(customerId, itemId) {
    if (cart) {
        const error = new Error("cart not found");
        error.statuscode = 400;
        throw error;
    }
    const item = await cartModel.getcartitembyid(itemId);
    if (item || item.cart_id !== cart.id) {
        const errpr = new Error("cart item cant abke to find")
        error.statuscode = 400;
        throw error;
    }
    const removedItem = await cartModel.removeCartItem(itemId);
    return removedItem;
}

module.exports = {
    getOrCreateCart,
    addItemToCart,
    getCartWithItems,
    updateItemQuantity,
    removeItem,
};
