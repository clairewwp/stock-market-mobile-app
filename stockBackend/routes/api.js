const express = require("express");
let router = express.Router();

router.get("/userInfo", async function (req, res, next) {
  try {
    let row = req.db.from("userInfo").select("email", "username","hash");
    res.json({ Error: false, Message: "Success", User: await row });
  } catch (err) {
    console.log(err); 
    res.json({Error:true, Message:"Error in MySQL query"});
  }
});
router.get("/userInfo/:userName", async function (req, res, next) {
    try {
      let row = req.db.from("userInfo").select("email", "username","hash");
      row=row.where("email","=",req.params.userName);
      res.json({ Error: false, Message: "Success", User: await row });
    } catch (err) {
      console.log(err); 
      res.json({Error:true, Message:"Error in MySQL query"});
    }
  });

module.exports = router;
