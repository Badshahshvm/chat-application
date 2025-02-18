const Post = require("../models/post")
const User = require("../models/user")
const Comment = require("../models/comments")
const Message = require("../models/message")
const { getReceiverSocketId, io } = require("../socket/socket")
const Conversation = require("../models/conversation")
const cloudinary = require("cloudinary").v2;
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config();

cloudinary.config({
              cloud_name: process.env.CLOUD_NAME,
              api_key: process.env.API_KEY,
              api_secret: process.env.API_SECRET
});

const sendMessage = async (req, res) => {
              try {
                            const token = req.headers.authorization.split(" ")[1];
                            const verifyUser = await jwt.verify(token, process.env.JWT_SECRET);
                            const senderId = verifyUser.id
                            const receiverId = req.params.id
                            let conversation = await Conversation.findOne({
                                          participants: { $all: [senderId, receiverId] }
                            })
                            if (!conversation) {
                                          conversation = await Conversation.create({
                                                        participants: [senderId, receiverId]
                                          })
                            }

                            const message = await Message.create({
                                          senderId: senderId,
                                          receiverId: receiverId,
                                          message: req.body.message
                            })

                            if (message) {
                                          conversation.messages.push(message._id)
                            }

                            await Promise.all([conversation.save(), message.save()])
                            //implement socket io for real time data
                            const gerReceiverId = getReceiverSocketId(receiverId)
                            console.log(gerReceiverId, "receiver")
                            if (gerReceiverId) {
                                          io.to(gerReceiverId).emit("newMessage", message)
                            }


                            res.json({
                                          success: true,

                                          message: message,
                                          conversation: conversation
                            })
              }
              catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message
                            })
              }
}

const getMessage = async (req, res) => {
              try {
                            const token = req.headers.authorization.split(" ")[1];
                            const verifyUser = await jwt.verify(token, process.env.JWT_SECRET);
                            const senderId = verifyUser.id
                            const receiverId = req.params.id
                            const conversation = await Conversation.find({
                                          participants: { $all: [senderId, receiverId] }
                            }).populate("messages")

                            if (!conversation) {
                                          res.json({
                                                        success: false,
                                                        message: "Conversaton not found"
                                          })
                            }
                            res.json({
                                          success: true,
                                          message: "Your conversation is here",
                                          messages: conversation
                            })

              }
              catch (err) {
                            res.json({
                                          success: false, message: err.message
                            })
              }
}
module.exports = { sendMessage, getMessage }
