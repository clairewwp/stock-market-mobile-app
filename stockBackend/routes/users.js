var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

router.get("/", async function (req, res, next) {
  res.send("respond with a resource");
});
router.post("/login", async function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.status(400).json({
      error: true,
      message: "Email and password are all needed",
    });
    return;
  }
  const queryUsers = await req.db
    .from("userInfo")
    .select("*")
    .where("email", "=", email);
  if (queryUsers.length === 0) {
    console.log("This email does not exist!");
    res.json({
      error: true,
      message: "This email does not exist!",
    });
    return;
  }
  const user = queryUsers[0];
  const match = await bcrypt.compare(password, user.hash);
  if (!match) {
    res.json({ error: true, message: "The passwords do not match" });
    return;
  }
  const secretKey = "###";
  const expires_in = 60 * 60 * 24;
  const exp = Date.now() + expires_in * 1000;
  const token = jwt.sign({ email, exp }, secretKey);
  res.json({ token_type: "Bearer", token, expires_in });
});
router.post("/register", async function (req, res, next) {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  if (!email || !username || !password) {
    res.status(400).json({
      error: true,
      message: "Email, username and password are all needed",
    });
    return;
  }
  const queryUsers = await req.db
    .from("userInfo")
    .select("*")
    .where("email", "=", email);
  if (queryUsers.length > 0) {
    console.log("This email already exists! ");
    res.json({
      error: true,
      message: "This email already exists!",
    });
    return;
  }
  const saltRounds = 10;
  const hash = bcrypt.hashSync(password, saltRounds);
  await req.db.from("userInfo").insert({ email, username, hash });
  res.json({ error: false, message: "Thanks for your registration! Return to login." });
});

module.exports = router;
