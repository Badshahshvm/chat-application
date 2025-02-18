const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
              text: { type: String, required: true },
              author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
              post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },

},
              {
                            timestamps: true
              })

const commentModel = mongoose.model("Comment", commentSchema)
module.exports = commentModel