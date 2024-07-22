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
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(bodyParser.json());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRouter);
app.use("/consumer", consumerRouter);
app.use("/seller", sellerRouter);
app.use("/auth", authRoutes);

// Sync Sequelize models with database
sequelize.sync({ force: false }).then(() => {
  console.log("Database & tables created!");
});
app.get("/", (req, res) => {
  res.send("Selamat datang di Aplikasi Jual Beli Sepatu by Novia Nirwana");
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

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
