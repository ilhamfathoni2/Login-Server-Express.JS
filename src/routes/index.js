const express = require("express");
const {
  register,
  login,
  checkAuth,
  getAllUsers,
  deleteUser,
  updateUser,
} = require("../controllers/auth");
const { uploadFile } = require("../middlewares/uploadFile");
const router = express.Router();
const { auth } = require("../middlewares/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/check-auth", auth, checkAuth);
router.get("/get-all-user", auth, getAllUsers);
router.patch("/update-user", auth, updateUser);
router.delete("/delete-user/:id", auth, deleteUser);

module.exports = router;
