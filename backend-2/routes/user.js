const express = require("express");
const { register, login, getProfile, logout, updateUser, getSugesstedUser, followOrUnFollow, getProfileById } = require("../controllers/user");
const checkAuth = require("../middleware/checkAuth");
const router = express.Router();
router.post("/register", register)
router.post("/", login)
router.get("/me", checkAuth, getProfile)
router.get("/logout", checkAuth, logout)
router.patch("/:id", checkAuth, updateUser)
router.get("/all", checkAuth, getSugesstedUser)
router.post("/followOrUnFollow/:id", checkAuth, followOrUnFollow)
router.get("/profile/:id", checkAuth, getProfileById)
module.exports = router;
