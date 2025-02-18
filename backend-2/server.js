// const express = require("express")
// require("dotenv").config()
// const mongoose = require("mongoose")
// const cors = require("cors")
// const fileUpload = require("express-fileupload")
// const { app, server } = require("./socket/socket");
// const userRoute = require("./routes/user")
// const postRoute = require("./routes/post")
// const messageRoute = require("./routes/message")
// const app = express()

// app.use(express.json())
// app.use(cors())
// mongoose.connect(process.env.MONGOURI,).then(() => {
//               console.log("connected to the database")
// }).catch((err) => {
//               console.log("not connected")
// })
// app.use(fileUpload({
//               useTempFiles: true,
//               tempFileDir: '/tmp/'
// }))
// app.use("/api/v1/message", messageRoute)
// app.use("/api/v1/auth", userRoute)
// app.use("/api/v1/post", postRoute)
// app.listen(process.env.PORT, () => {
//               console.log("server is running")
// })


const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { app, server } = require("./socket/socket");  // Already importing app and server here
const userRoute = require("./routes/user");
const postRoute = require("./routes/post");
const messageRoute = require("./routes/message");

// No need to redefine `app` here, since it's already imported
// app is imported from './socket/socket'

app.use(express.json());
app.use(cors());

mongoose
              .connect(process.env.MONGOURI)
              .then(() => {
                            console.log("connected to the database");
              })
              .catch((err) => {
                            console.log("not connected", err);
              });

app.use(
              fileUpload({
                            useTempFiles: true,
                            tempFileDir: "/tmp/",
              })
);

app.use("/api/v1/message", messageRoute);
app.use("/api/v1/auth", userRoute);
app.use("/api/v1/post", postRoute);

server.listen(process.env.PORT, () => {
              console.log("server is running");
});
