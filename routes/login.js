var express = require("express");
var router = express.Router();
const helper = require("../helper/replaceQueryString");
var db = require("../database.js");
const path = require("path");
var dotenv = require("dotenv");
dotenv.config();

/* Get HTML page for login view */
router.get("/login", function (req, res, next) {
  res.sendFile(path.join(__dirname + "/../public/html/login.html"));
});

/* Sets cookie to username and logs user into their homepage */
router.post("/api/login", async function (req, res, next) {
  const response = await db.queryDB(
    `SELECT id FROM users WHERE username='${helper.replaceQueryString(
      req.body.userName
    )}'`
  );

  if (response.rows.length == 0) {
    res.redirect(302, "/login");
  } else {
    res.cookie("cookieName", response.rows[0].id, {
      maxAge: 9000000,
      httpOnly: false,
    });
    res.redirect(302, "/home");
  }
});

/* Get HTML file for signup view */
router.get("/signup", function (req, res, next) {
  res.sendFile(path.join(__dirname + "/../public/html/signup.html"));
});

/* set cookie as username and insert user into database */
router.post("/api/signup", async function (req, res, next) {
  const possibleUserName = await db.queryDB(
    `SELECT * FROM USERS WHERE username='${helper.replaceQueryString(
      req.body.userName
    )}'`
  );

  if (possibleUserName.rows.length != 0) {
    res.redirect(302, "/signup");
  } else {
    await db.queryDB(
      `INSERT INTO users(username, password)
      VALUES ('${helper.replaceQueryString(
        req.body.userName
      )}', '${helper.replaceQueryString(req.body.password)}')`
    );
    res.redirect(302, "/login");
  }
});

module.exports = router;
