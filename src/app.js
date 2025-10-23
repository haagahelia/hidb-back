const express = require("express");
const app = express();

// Middleware
app.use(express.json());

// Routes
const indexRoute = require("./routes/index");
const helloRoute = require("./routes/hello");

app.use("/", indexRoute);
app.use("/hello", helloRoute);

module.exports = app;
