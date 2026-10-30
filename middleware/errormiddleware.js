function errorMiddleware(err, req, res, next) {
    const statusCode = err.statusCode || err.statuscode || 500;
    res.status(statusCode).json({
        error: err.message || "Internal Server Error",
    });
}

module.exports = errorMiddleware;

