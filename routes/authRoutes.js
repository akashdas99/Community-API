const express = require("express");
const {
  signup,
  signin,
  isSignedIn,
  me,
} = require("../controllers/userController");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/me", isSignedIn, me);

module.exports = router;
