var express = require("express");
var router = express.Router();
const path = require("path");
const helper = require("../helper/replaceQueryString");
var db = require("../database.js");
var dotenv = require("dotenv");
dotenv.config();

////////////////////////////////////////////////////////////////////////////

/* serve friends page view */
router.get("/", function (req, res, next) {
  res.sendFile(path.join(__dirname + "/../public/html/friends.html"));
});

router.get("/addfriend", function (req, res, next) {
  res.sendFile(path.join(__dirname + "/../public/html/addFriend.html"));
});

router.get("/getRequests", function (req, res, next) {
  res.sendFile(path.join(__dirname + "/../public/html/friendRequests.html"));
});

/* get friend requests sent to user */
router.get("/getRequests/:id", async function (req, res, next) {
  const response = await db.queryDB(`
    SELECT friends.requestaccepted, friends.retrieverid, friends.senderid, users.username, friends.id AS friendsid 
    FROM friends JOIN users ON senderid = users.id 
    WHERE retrieverid = ${req.params.id} AND requestaccepted IS NULL
  `);
  res.send(response.rows);
});

/* get username of friends */
router.get("/getfriends/:id", async function (req, res, next) {
  const response = await db.queryDB(`
    SELECT DISTINCT username, users.id, datesincefriends
    FROM friends JOIN users 
    ON (retrieverid = users.id OR senderid = users.id) 
    WHERE (retrieverid = ${req.params.id} AND requestaccepted = TRUE) OR (senderid = ${req.params.id} AND requestaccepted = TRUE)
    ORDER BY username
  `);
  res.send(response.rows);
});

/* send friend request */
router.post("/api/addFriend/:senderid", async function (req, res, next) {
  const retrieverId = await db.queryDB(
    `SELECT id FROM users WHERE username = '${helper.replaceQueryString(
      req.body.retrieverName
    )}'`
  );

  if (retrieverId.rows.length != 0) {
    const statusOfRequest = await db.queryDB(
      `SELECT * FROM friends WHERE (retrieverid = ${retrieverId.rows[0].id} AND senderid = ${req.params.senderid}) OR (retrieverid = ${req.params.senderid} AND senderid = ${retrieverId.rows[0].id});`
    );
    if (statusOfRequest.rows.length == 0) {
      await db.queryDB(
        `INSERT INTO friends (retrieverid, senderid) VALUES (${retrieverId.rows[0].id}, ${req.params.senderid})`
      );
      res.cookie("requestSent", true, {
        maxAge: 3000,
        httpOnly: false,
      });
      res.redirect(302, "/friends");
    } else {
      if (statusOfRequest.rows[0].requestaccepted != null) {
        res.cookie("isRequestAcceptedOrDeclined", true, {
          maxAge: 3000,
          httpOnly: false,
        });
        res.redirect(302, "/friends");
      } else {
        res.cookie("isrequestPending", true, {
          maxAge: 3000,
          httpOnly: false,
        });
        res.redirect(302, "/friends");
      }
    }
  } else {
    res.redirect(302, "/friends/addfriend");
  }
});

/* Accept friend request */
router.get("/accept/:friendsid", async function (req, res, next) {
  await db.queryDB(
    `UPDATE friends SET requestaccepted = TRUE, datesincefriends = CURRENT_DATE WHERE id = ${req.params.friendsid}`
  );
  res.redirect(302, "/friends");
});

/* Decline friend request */
router.get("/decline/:friendsid", async function (req, res, next) {
  await db.queryDB(
    `UPDATE friends SET requestaccepted = FALSE WHERE id = ${req.params.friendsid}`
  );
  res.redirect(302, "/friends");
});

/* set cookie as the friend's id that you are trying to view. Also serve HTML file for view */
router.get("/seefriendstodo/:id", function (req, res, next) {
  res.cookie("friendid", req.params.id, {
    maxAge: 9000000,
    httpOnly: false,
  });
  res.sendFile(path.join(__dirname + "/../public/html/friendstodo.html"));
});

router.get("/get/seefriendstodo/:id", async function (req, res, next) {
  const response = await db.queryDB(
    `SELECT users.username, todos.id AS todoid, todos.todo FROM users JOIN todos ON todos.userid = users.id WHERE users.id = ${req.params.id}`
  );
  res.send(response.rows);
});

module.exports = router;
