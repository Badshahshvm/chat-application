const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
              caption: { type: String, default: '' },
              imageId: { type: String, required: true },
              imageUrl: { type: String, required: true },

              author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
              likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
              comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
},
              {
                            timestamps: true
              })

const postModel = mongoose.model("Post", postSchema)
module.exports = postModel

