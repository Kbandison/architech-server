// Libraries
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

// Routes
const indexRouter = require("./routes/products");
const usersRouter = require("./routes/users");
const wishRouter = require("./routes/wishlist");
const cartRouter = require("./routes/cart");
const ordersRouter = require("./routes/orders");

const { mongooseConnect } = require("./Database/db.js");
mongooseConnect();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.options("*", cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/products", indexRouter);
app.use("/users", usersRouter);
app.use("/wishlist", wishRouter);
app.use("/cart", cartRouter);
app.use("/orders", ordersRouter);

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
