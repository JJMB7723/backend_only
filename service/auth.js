const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authModel = require("../models/auth");

// new customer registration
async function registerCustomer(name, email, password) {
    if (!name || name.trim() === "") {
        const error = new Error("name is required");
        error.statusCode = 400;
        throw error;
    }
    if (!email || email.trim() === "") {
        const error = new Error("email is required");
        error.statusCode = 400;
        throw error;
    }
    if (!password || password.length < 6) {
        const error = new Error("check ur password (minimum 6 characters)");
        error.statusCode = 400;
        throw error;
    }
    const existingCustomer = await authModel.getCustomerByEmail(email.trim());
    if (existingCustomer) {
        const error = new Error("email already exists");
        error.statusCode = 400;
        throw error;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const customer = await authModel.createCustomer(name.trim(), email.trim(), hashedPassword);

    return customer;
}

// LOGIN existing customer
async function loginCustomer(email, password) {
    if (!email || email.trim() === "") {
        const error = new Error("email is required");
        error.statusCode = 400;
        throw error;
    }
    if (!password) {
        const error = new Error("enter the correct password");
        error.statusCode = 400;
        throw error;
    }

    // find customer by email id
    const customer = await authModel.getCustomerByEmail(email.trim());
    if (!customer) {
        const error = new Error("invalid password or email");
        error.statusCode = 400;
        throw error;
    }
    const isPasswordCorrect = await bcrypt.compare(password, customer.password);
    if (!isPasswordCorrect) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }
    const token = jwt.sign(
        {
            id: customer.id,
            name: customer.name,
            email: customer.email,
        },
        process.env.JWT_SECRET || "default_jwt_secret",
        { expiresIn: "24h" }
    );
    return {
        customer: {
            id: customer.id,
            name: customer.name,
            email: customer.email,
        },
        token: token,
    };
}

module.exports = {
    registerCustomer,
    loginCustomer,
    registercustomer: registerCustomer,
    logincustomer: loginCustomer,
};
