const express = require("express")
const checkAuth = require("../middleware/checkAuth")
const { sendMessage, getMessage } = require("../controllers/message")
const router = express.Router()
router.post("/send/:id", checkAuth, sendMessage)
router.get("/all/:id", checkAuth, getMessage)
module.exports = router