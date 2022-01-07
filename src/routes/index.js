const express = require("express");

const { register, login, checkAuth } = require("../controllers/auth");

const { uploadFile } = require("../middleware/uploadFile");

const router = express.Router();

const { auth } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/check-auth", auth, checkAuth);

module.exports = router;
