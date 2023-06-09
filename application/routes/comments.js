var express = require("express");
const { isLoggedIn } = require("../middleware/auth");
var router = express.Router();
var db = require("../conf/database");

router.post("/create", isLoggedIn, async function (req, res, next) {
  var { userId, username, image } = req.session.user;
  var { postId, comment } = req.body;

  try {
    var [insertResult, _] = await db.execute(
      `INSERT INTO comments (text, fk_postId, fk_userId) VALUES (?, ?, ?)`,
      [comment, postId, userId]
    );

    if (insertResult && insertResult.affectedRows == 1) {
      return res.status(201).json({
        commentId: insertResult.insertId,
        username: username,
        commentText: comment,
        avatar: image,
      });
    } else {
      res.json({
        message: "Error",
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
