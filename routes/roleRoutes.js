const { getRole, createRole } = require("../controllers/roleController");
const express = require("express");
const router = express.Router();

router.get("/", getRole);
router.post("/", createRole);

module.exports = router;
