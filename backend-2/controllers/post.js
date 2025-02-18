const Post = require("../models/post")
const User = require("../models/user")
const Comment = require("../models/comments")
const cloudinary = require("cloudinary").v2;
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { getReceiverSocketId, io } = require("../socket/socket")
require("dotenv").config();

cloudinary.config({
              cloud_name: process.env.CLOUD_NAME,
              api_key: process.env.API_KEY,
              api_secret: process.env.API_SECRET
});

const addPost = async (req, res) => {
              try {
                            const uploadedImage = await cloudinary.uploader.upload(req.files.image.tempFilePath);
                            const token = req.headers.authorization.split(" ")[1];
                            const verifyUser = await jwt.verify(token, process.env.JWT_SECRET);
                            const post = new Post({
                                          caption: req.body.caption,
                                          imageUrl: uploadedImage.secure_url,
                                          imageId: uploadedImage.public_id,
                                          author: verifyUser.id

                            })

                            await post.save();
                            const user = await User.findById(verifyUser.id)
                            if (user) {
                                          user.posts.push(post._id)
                                          await user.save()
                            }
                            await post.populate({ path: "author" })
                            res.json({
                                          success: true,
                                          message: "Post Created Sucessfully",
                                          post: post
                            })
              }
              catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message
                            })
              }
}

const deletePost = async (req, res) => {
              try {
                            const token = req.headers.authorization.split(" ")[1];
                            const verifyUser = await jwt.verify(token, process.env.JWT_SECRET);
                            const post = await Post.findById(req.params.id);

                            if (!post) {
                                          return res.json({
                                                        success: false,
                                                        message: "Post not found",
                                          });
                            }

                            if (post.author.toString() !== verifyUser.id) {
                                          return res.json({
                                                        success: false,
                                                        message: "Unauthorized action",
                                          });
                            }

                            await Post.findByIdAndDelete(req.params.id);
                            const user = await User.findById(verifyUser.id);
                            user.posts = user.posts.filter(id => id.toString() !== req.params.id);
                            await user.save();
                            await Comment.deleteMany({ post: req.params.id })

                            res.json({
                                          success: true,
                                          message: "Post deleted successfully",
                            });
              } catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message,
                            });
              }
};

const updatePost = async (req, res) => {
              try {
                            const token = req.headers.authorization.split(" ")[1];
                            const verifyUser = await jwt.verify(token, process.env.JWT_SECRET);
                            const post = await Post.findById(req.params.id);

                            if (!post) {
                                          return res.json({
                                                        success: false,
                                                        message: "Post not found",
                                          });
                            }

                            if (post.author.toString() !== verifyUser.id) {
                                          return res.json({
                                                        success: false,
                                                        message: "Unauthorized action",
                                          });
                            }

                            if (req.files && req.files.image) {
                                          const uploadedImage = await cloudinary.uploader.upload(req.files.image.tempFilePath);
                                          post.imageUrl = uploadedImage.secure_url;
                                          post.imageId = uploadedImage.public_id;
                            }

                            if (req.body.caption) {
                                          post.caption = req.body.caption;
                            }

                            await post.save();

                            await post.populate({ path: "author" });

                            res.json({
                                          success: true,
                                          message: "Post updated successfully",
                                          post: post,
                            });
              } catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message,
                            });
              }
};

const commentOnPost = async (req, res) => {
              try {
                            const token = req.headers.authorization.split(" ")[1];
                            const verifyUser = await jwt.verify(token, process.env.JWT_SECRET);
                            const post = await Post.findById(req.params.id)
                            const { text } = req.body
                            if (!post) {
                                          res.json({
                                                        success: false,
                                                        message: "Post Not Found"
                                          })
                            }
                            const comment = new Comment({
                                          text: text,
                                          author: verifyUser.id,
                                          post: post._id
                            })
                            await comment.save()
                            await comment.populate({
                                          path: "author"
                            })
                            post.comments.push(comment._id);
                            await post.save()
                            res.json({
                                          success: true,
                                          message: "Comment is added",
                                          comment: comment
                            })



              }
              catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message
                            })
              }
}

const getAllPost = async (req, res) => {
              try {
                            const posts = await Post.find({})
                                          .sort({ createdAt: -1 })
                                          .populate({ path: "author", select: "username profilePictureUrl" })
                                          .populate({
                                                        path: "comments",
                                                        sort: { createdAt: -1 },
                                                        populate: {
                                                                      path: "author",
                                                                      select: "username profilePictureUrl",
                                                        },
                                          });

                            res.json({
                                          success: true,
                                          posts: posts,
                            });
              } catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message,
                            });
              }
};
const getUserPost = async (req, res) => {
              try {
                            const token = req.headers.authorization.split(" ")[1];
                            const verifyUser = await jwt.verify(token, process.env.JWT_SECRET);

                            const posts = await Post.find({ author: verifyUser.id })
                                          .sort({ createdAt: -1 })
                                          .populate({
                                                        path: "author",
                                                        select: "username profilePictureUrl",
                                          })
                                          .populate({
                                                        path: "comments",
                                                        options: { sort: { createdAt: -1 } },
                                                        populate: {
                                                                      path: "author",
                                                                      select: "username profilePictureUrl",
                                                        },
                                          });

                            res.json({
                                          success: true,
                                          message: "Your Posts are here",
                                          posts: posts,
                            });
              } catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message,
                            });
              }
};


// const likePost = async (req, res) => {
//               try {
//                             const token = req.headers.authorization.split(" ")[1];
//                             const verifyUser = await jwt.verify(token, process.env.JWT_SECRET);
//                             const post = await Post.findById(req.params.id);

//                             if (!post) {
//                                           return res.json({
//                                                         success: false,
//                                                         message: "Post not found",
//                                           });
//                             }

//                             if (!post.likes.includes(verifyUser.id)) {
//                                           post.likes.push(verifyUser.id);
//                                           await post.save();
//                             }




//                             res.json({
//                                           success: true,
//                                           message: "Post liked successfully",
//                                           post: post,
//                             });
//               } catch (err) {
//                             res.json({
//                                           success: false,
//                                           message: err.message,
//                             });
//               }
// };

// const dislikePost = async (req, res) => {
//               try {
//                             const token = req.headers.authorization.split(" ")[1];
//                             const verifyUser = await jwt.verify(token, process.env.JWT_SECRET);
//                             const post = await Post.findById(req.params.id);

//                             if (!post) {
//                                           return res.json({
//                                                         success: false,
//                                                         message: "Post not found",
//                                           });
//                             }

//                             if (post.likes.includes(verifyUser.id)) {
//                                           post.likes = post.likes.filter((id) => id !== verifyUser.id);
//                                           await post.save();
//                             }

//                             res.json({
//                                           success: true,
//                                           message: "Post disliked successfully",
//                                           post: post,
//                             });
//               } catch (err) {
//                             res.json({
//                                           success: false,
//                                           message: err.message,
//                             });
//               }
// };

const likePost = async (req, res) => {
              try {
                            const token = req.headers.authorization.split(" ")[1];
                            const verifyUser = await jwt.verify(token, process.env.JWT_SECRET);
                            const post = await Post.findById(req.params.id);

                            if (!post) {
                                          return res.status(404).json({
                                                        success: false,
                                                        message: "Post not found",
                                          });
                            }

                            // Check if user has already liked the post
                            if (!post.likes.includes(verifyUser.id)) {
                                          post.likes.push(verifyUser.id);
                                          await post.save();
                            }

                            const user = await User.findById(verifyUser.id);
                            const postOwnerId = post.author.toString();

                            // Notify post owner if liker is not the owner
                            if (user._id.toString() !== postOwnerId) {
                                          const notification = {
                                                        type: "Like",
                                                        userId: user._id,
                                                        user: user,
                                                        postId: post._id,
                                                        message: "Your post was liked",
                                          };

                                          const postOwnerSocketId = getReceiverSocketId(postOwnerId); // Retrieve socket ID of post owner
                                          if (postOwnerSocketId) {
                                                        io.to(postOwnerSocketId).emit("notification", notification); // Emit notification
                                          }
                            }

                            res.status(200).json({
                                          success: true,
                                          message: "Post liked successfully",
                                          post,
                            });
              } catch (err) {
                            res.status(500).json({
                                          success: false,
                                          message: err.message,
                            });
              }
};

const dislikePost = async (req, res) => {
              try {
                            const token = req.headers.authorization.split(" ")[1];
                            const verifyUser = await jwt.verify(token, process.env.JWT_SECRET);
                            const post = await Post.findById(req.params.id);

                            if (!post) {
                                          return res.status(404).json({
                                                        success: false,
                                                        message: "Post not found",
                                          });
                            }

                            // Remove like if user already liked the post
                            if (post.likes.includes(verifyUser.id)) {
                                          post.likes = post.likes.filter((id) => id !== verifyUser.id);
                                          await post.save();
                            }

                            const user = await User.findById(verifyUser.id);
                            const postOwnerId = post.author.toString();

                            // Notify post owner if disliker is not the owner
                            if (user._id.toString() !== postOwnerId) {
                                          const notification = {
                                                        type: "Dislike",
                                                        userId: user._id,
                                                        user: user,
                                                        postId: post._id,
                                                        message: "Your post was disliked",
                                          };

                                          const postOwnerSocketId = getReceiverSocketId(postOwnerId); // Retrieve socket ID of post owner
                                          if (postOwnerSocketId) {
                                                        io.to(postOwnerSocketId).emit("notification", notification); // Emit notification
                                          }
                            }

                            res.status(200).json({
                                          success: true,
                                          message: "Post disliked successfully",
                                          post,
                            });
              } catch (err) {
                            res.status(500).json({
                                          success: false,
                                          message: err.message,
                            });
              }
};

const getCommentsOfPost = async (req, res) => {
              try {
                            const postId = req.params.id;

                            // Fetch the post using the postId
                            const post = await Post.findById(postId);
                            if (!post) {
                                          return res.json({
                                                        success: false,
                                                        message: "Post Not Found",
                                          });
                            }

                            // Fetch the comments related to the post
                            const comments = await Comment.find({ post: postId }).populate("post")
                                          .populate("author") // Populate the comment author
                                          .exec();

                            // Return the post and its comments
                            return res.json({
                                          success: true,
                                          message: "Post and comments fetched successfully",
                                          post: post,
                                          comments: comments,
                            });
              } catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message,
                            });
              }
};

const bookmarkPost = async (req, res) => {
              try {
                            const token = req.headers.authorization.split(" ")[1];
                            const verifyUser = await jwt.verify(token, process.env.JWT_SECRET);
                            const post = await Post.findById(req.params.id);
                            if (!post) {
                                          return res.json({
                                                        success: false,
                                                        message: "Post Not Found",
                                          });
                            }
                            const user = await User.findById(verifyUser.id);
                            if (user.bookmarks.includes(post._id)) {
                                          user.bookmarks = user.bookmarks.filter(id => id.toString() !== post._id.toString());
                            } else {
                                          user.bookmarks.push(post._id);
                            }
                            await user.save();
                            res.json({
                                          success: true,
                                          message: "Bookmark updated successfully",
                            });
              } catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message,
                            });
              }
};

module.exports = { addPost, deletePost, updatePost, commentOnPost, getAllPost, getUserPost, likePost, dislikePost, getCommentsOfPost, bookmarkPost }