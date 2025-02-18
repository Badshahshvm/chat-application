const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
              cors: {
                            origin: "http://localhost:5173", // Replace with your frontend's URL
                            methods: ["GET", "POST"],
              },
});

let onlineUsers = new Map();
const getReceiverSocketId = (receiverId) => onlineUsers.get(receiverId);



io.on("connection", (socket) => {
              const userId = socket.handshake.query.userId;
              if (userId) {
                            onlineUsers.set(userId, socket.id); // Map userId to socket ID
                            console.log(`User connected: ${userId}`);

                            // Emit updated online users list to all clients
                            io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
              }

              socket.on("disconnect", () => {
                            onlineUsers.forEach((value, key) => {
                                          if (value === socket.id) {
                                                        onlineUsers.delete(key); // Remove user from online list
                                          }
                            });

                            // Emit updated online users list
                            io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
                            console.log(`User disconnected: ${userId}`);
              });
});



module.exports = { app, server, io, getReceiverSocketId };
