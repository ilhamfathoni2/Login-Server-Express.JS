const express = require("express");
const { register, login, checkAuth } = require("../controllers/auth");
const { uploadFile } = require("../middlewares/uploadFile");
const router = express.Router();
const { auth } = require("../middlewares/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/check-auth", auth, checkAuth);

module.exports = router;
