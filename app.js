var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var db = require("./database");
var dotenv = require("dotenv");
dotenv.config();

var indexRouter = require("./routes/login");
var usersRouter = require("./routes/home");
var messagesRouter = require("./routes/messages");
var friendsRouter = require("./routes/friends");
const e = require("express");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/* check if user still has cookie */
app.use((req, res, next) => {
  if (
    req.path == "/login" ||
    req.path == "/api/login" ||
    req.path == "/signup" ||
    req.path == "/api/signup"
  ) {
    next();
  } else {
    const value = `; ${req.headers.cookie}`;
    const parts = value.split(`; cookieName=`);
    if (parts.length === 2) {
      next();
    } else {
      res.redirect(302, "/login");
    }
  }
});

app.use("/", indexRouter);
app.use("/home", usersRouter);
app.use("/messages", messagesRouter);
app.use("/friends", friendsRouter);

db.pool.connect();

process.on("exit", () => {
  db.pool.end();
});

module.exports = app;
