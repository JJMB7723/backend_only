const express = require("express");
const app = express();

app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const deliveryRoutes = require("./routes/delivery");

app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/deliveries", deliveryRoutes);

// Error Middlewares
const notFound = require("./middleware/notfound");
const errorMiddleware = require("./middleware/errormiddleware");

app.use(notFound);
app.use(errorMiddleware);

module.exports = app;

