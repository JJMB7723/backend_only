const authService = require("../service/auth");

async function register(req, res, next) {
    try {
        const { name, email, password } = req.body;

        const customer = await authService.registercustomer(name, email, password);
        res.status(201).json({
            success: true,
            message: "Customer registered successfully",
            data: customer,
        });
    }
    catch (error) {
        next(error);
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const result = await authService.logincustomer(email, password);
        res.status(200).json({
            success: true,
            message: "login successfully",
            data: result,
        })
    }
    catch (error) {
        next(error);
    }
}

module.exports = {
    register,
    login,
};