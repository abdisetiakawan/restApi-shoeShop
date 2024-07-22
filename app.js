const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const sequelize = require("./config/database.js");
require("dotenv").config(); // To use environment variables
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const adminRouter = require("./routes/admin");
const consumerRouter = require("./routes/consumer");
const sellerRouter = require("./routes/seller");

const app = express();

// view engine setup
app.use(bodyParser.json());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/admin", adminRouter);
app.use("/consumer", consumerRouter);
app.use("/seller", sellerRouter);
app.use("/auth", authRoutes);

// Sync the database
sequelize
  .sync()
  .then(() => {
    console.log("Database synchronized");
  })
  .catch((err) => {
    console.error("Error synchronizing database:", err);
  });
app.get("/", (req, res) => {
  res.send("Selamat datang di Aplikasi Jual Beli Sepatu by Novia Nirwana");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // send the error response
  res.status(err.status || 500).send({
    message: err.message,
    error: req.app.get("env") === "development" ? err : {},
  });
});

module.exports = app;
