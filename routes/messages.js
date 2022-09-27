var express = require("express");
var router = express.Router();
const helper = require("../helper/replaceQueryString");
var db = require("../database.js");
const path = require("path");
var dotenv = require("dotenv");
dotenv.config();

/* get HTML page for messages page view */
router.get("/", function (req, res, next) {
  res.sendFile(path.join(__dirname + "/../public/html/messages.html"));
});

/* get HTML page for create message page view */
router.get("/get/create", function (req, res, next) {
  res.sendFile(path.join(__dirname + "/../public/html/createMessage.html"));
});

/* get name of conversations that user has and the last text sent */
router.get("/get/:id", async (req, res, next) => {
  var results = [];

  const response = await db.queryDB(
    `SELECT DISTINCT users.username, messages.senderid, messages.retrieverid
    FROM users JOIN messages 
    ON users.id = messages.senderid 
    WHERE messages.retrieverid = ${req.params.id};`
  );
  results = response.rows;

  for (let i = 0; i < response.rows.length; i++) {
    let lastText = await db.queryDB(
      `SELECT distinct users.id AS userid, users.username, messages.retrieverid, messages.id AS messagesid, messages.senderid, messages.message 
        FROM users JOIN messages on messages.senderid = users.id 
        WHERE (retrieverid = ${response.rows[i].retrieverid} AND senderid= ${response.rows[i].senderid}) OR (retrieverid = ${response.rows[i].senderid} AND senderid= ${response.rows[i].retrieverid}) 
        ORDER BY messagesid DESC
        LIMIT 1 `
    );
    results[i].message = lastText.rows[0].message;
  }

  res.send(results);
});

/* post message to database */
router.post("/create/:senderid", async function (req, res, next) {
  const retrieverId = await db.queryDB(
    `SELECT id FROM users WHERE username = '${helper.replaceQueryString(
      req.body.retrieverid
    )}'`
  );
  if (retrieverId.rows.length == 0) {
    res.redirect(302, "/messages/get/create");
  } else {
    await db.queryDB(
      `INSERT INTO messages(retrieverid, senderid, message) VALUES (${
        retrieverId.rows[0].id
      }, ${req.params.senderid}, '${helper.replaceQueryString(
        req.body.message
      )}')`
    );
    res.cookie("messageSent", true, {
      maxAge: 2000,
      httpOnly: false,
    });
    res.redirect(302, "/messages");
  }
});

/* set cookie as senderid and serve the HTML page for the conversation view */
router.get("/get/conversation/:id", function (req, res, next) {
  res.cookie("senderid", req.params.id, {
    maxAge: 9000000,
    httpOnly: false,
  });
  res.redirect(302, "/messages");
});

/* get conversation (this includes messages you sent to the reciever and messages the reciever sent to you) */
router.get(
  "/get/conversation/:retrieverid/:senderid",
  async function (req, res, next) {
    if (req.params.senderid === "undefined") {
      res.send("You have no messages");
    } else {
      const response = await db.queryDB(`
        SELECT distinct users.id AS userid, users.username, messages.retrieverid, messages.id AS messagesid, messages.senderid, messages.message 
        FROM users JOIN messages on messages.senderid = users.id 
        WHERE (retrieverid = ${req.params.retrieverid} AND senderid=${req.params.senderid}) OR (retrieverid = ${req.params.senderid} AND senderid=${req.params.retrieverid}) 
        ORDER BY messagesid
        `);
      res.send(response.rows);
    }
  }
);

/* send message */
router.post(
  "/sendMessage/:senderid/:retrieverid",
  async function (req, res, next) {
    const message = await db.queryDB(
      `INSERT INTO messages (senderid, retrieverid, message)
    VAlUES (${req.params.senderid}, ${
        req.params.retrieverid
      }, '${helper.replaceQueryString(req.body.message)}')
    `
    );
    res.redirect(302, "/messages");
  }
);

module.exports = router;
