var express = require("express");
var router = express.Router();
const path = require("path");
const helper = require("../helper/replaceQueryString");
var db = require("../database.js");
var dotenv = require("dotenv");
dotenv.config();

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* Get HTML page for home page view */
router.get("/", function (req, res, next) {
  res.sendFile(path.join(__dirname + "/../public/html/home.html"));
});

/* Get name for user */
router.get("/name/:id", async function (req, res, next) {
  const response = await db.queryDB(
    `SELECT username from USERS WHERE id=${req.params.id}`
  );
  res.send(response.rows);
});

/* Get individual user's todos */
router.get("/todos/:id", async function (req, res, next) {
  const response = await db.queryDB(
    `SELECT * FROM todos WHERE userid=${req.params.id} ORDER BY id ASC`
  );
  res.send(response.rows);
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* Get HTML page for create page view */
router.get("/create", function (req, res, next) {
  res.sendFile(path.join(__dirname + "/../public/html/createTodo.html"));
});

/* Post todo and redirect back to home page */
router.post("/api/create/:id", async function (req, res, next) {
  if (req.body.todo.length != 0) {
    const response = await db.queryDB(`
      INSERT INTO todos(userid, todo) 
      VALUES (${req.params.id}, '${helper.replaceQueryString(
      req.body.todo
    )}')`);
    res.redirect(302, "/home");
  } else {
    res.redirect(302, "/home/create");
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* get HTML page for edit page view and set cookie to todoid*/
router.get("/edit/:id", function (req, res, next) {
  res.cookie("todoid", req.params.id, {
    maxAge: 9000000,
    httpOnly: false,
  });
  res.sendFile(path.join(__dirname + "/../public/html/editTodo.html"));
});

/* get value of todo that will be edited */
router.get("/edit/get/:id", async function (req, res, next) {
  const response = await db.queryDB(
    `SELECT todo FROM todos WHERE id=${req.params.id}`
  );
  res.send(response.rows);
});

/* update the todo in the database and send the user back to the homepage */
router.post("/api/edit/:id", async function (req, res, next) {
  await db.queryDB(
    `UPDATE todos SET todo = '${helper.replaceQueryString(
      req.body.todo
    )}' WHERE id=${req.params.id}`
  );
  res.redirect(302, "/home");
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* Delete a todo */
router.get("/delete/:id", async function (req, res, next) {
  await db.queryDB(`DELETE FROM todos WHERE id=${req.params.id}`);
  res.redirect(302, "/home");
});

module.exports = router;
