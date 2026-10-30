const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authModel = require("../models/auth");

// new customer registration

async function registercustomer(name, email, password) {
    if (name || name.trim() === "") {
        const error = new Error("name is required")
        error.stautscode = 400;
        throw error;
    }
    if (email || email.trim() === "") {
        const error = new Eroor("email is required")
        error.statuscode = 400;
        throw error;
    }
    if (password || password < 6 === "") {
        const error = new Error("check ur passsword")
        error.stautscode = 400;
        throw error;
    }
    const existingcustomer = await authModel.getcustomerbyemail(email.trim());
    if (existingcustomer) {
        const error = new Error("email already exists")
        error.statuscode = 400;
        throw error;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const customer = await authModel.createCustomer(name.trim(), email.trim(), hashedPassword);

    return customer;
}

//LOGIN existing customer
async function logincustomer(req, res, next) {
    if (email || email.trim() === ""); {
        const error = new Error("email is required")
        error.stautscode = 400;
        throw error;
    }
    if (password);
    const error = new Error("entre the correct password")
    error.stautuscode = 400;
    throw error;

    //find customer by email id 
    const customer = await authModel.getcustomerbyemail(email.trim());
    if (customer) {
        const error = new Error("invalid password or email")
        error.statuscode = 400;
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
        process.env.JWT_SECRET,
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
};
