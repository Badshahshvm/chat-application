const User = require("../models/user")
const cloudinary = require("cloudinary").v2;
const bcrypt = require("bcrypt")
const Post = require("../models/post")
const jwt = require("jsonwebtoken")
require("dotenv").config();

cloudinary.config({
              cloud_name: process.env.CLOUD_NAME,
              api_key: process.env.API_KEY,
              api_secret: process.env.API_SECRET
});
const register = async (req, res) => {
              try {
                            const uploadedImage = await cloudinary.uploader.upload(req.files.image.tempFilePath);

                            const exitUser = await User.findOne({ username: req.body.username })
                            if (exitUser) {
                                          res.json({
                                                        sucess: true,
                                                        message: "Username alreday exist"
                                          })
                            }
                            const hashPassword = await bcrypt.hash(req.body.password, 10);
                            const user = new User({
                                          username: req.body.username,
                                          email: req.body.email,
                                          bio: req.body.bio,
                                          password: hashPassword,
                                          gender: req.body.gender,
                                          profilePictureUrl: uploadedImage.secure_url,
                                          profilePictureId: uploadedImage.public_id

                            })
                            await user.save();
                            res.json({
                                          sucess: true,
                                          message: "User Registered Sucessfully",
                                          user: user
                            })

              }
              catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message
                            })
              }
}
const login = async (req, res) => {
              try {
                            const { usernameOrEmail, password } = req.body;

                            // Check if the user exists (by username or email)
                            const user = await User.findOne({
                                          $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
                            });

                            if (!user) {
                                          return res.json({
                                                        success: false,
                                                        message: "Invalid username or email",
                                          });
                            }


                            const isPasswordMatch = await bcrypt.compare(password, user.password);
                            if (!isPasswordMatch) {
                                          return res.json({
                                                        success: false,
                                                        message: "Invalid password",
                                          });
                            }


                            const token = jwt.sign(
                                          { id: user._id, username: user.username, gender: user.gender }, // Add user 
                                          process.env.JWT_SECRET, // Secret key from environment variable
                                          { expiresIn: "7d" } // Token expiration time
                            );
                            const populatePosts = await Promise.all(user.posts.map(async (postId) => {
                                          const post = await Post.findById(postId);
                                          if (post.author.equals(user._id)) {
                                                        return post
                                          }
                                          return null;
                            }))

                            res.json({
                                          success: true,
                                          message: "Login successful",
                                          token: token,
                                          user: user,
                                          posts: populatePosts
                            });

              }
              catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message
                            })
              }
}

const getProfile = async (req, res) => {
              try {
                            const token = req.headers.authorization.split(" ")[1];
                            const verifyUser = await jwt.verify(token, process.env.JWT_SECRET); // Verify the token
                            const user = await User.findById(verifyUser.id)
                            if (!user) {
                                          res.json({
                                                        success: false,
                                                        message: "User not loggedin"
                                          })
                            }
                            res.json({
                                          success: true,
                                          message: "User data is here",
                                          user: user
                            })
              }
              catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message
                            })
              }
}

const logout = async (req, res) => {
              try {
                            const { token } = req.body;
                            const user = await User.findOne({ token: token });
                            if (!user) {
                                          res.json({
                                                        success: false,
                                                        message: "User not found"
                                          })
                            }
                            user.token = null; // Remove the token from the user record
                            await user.save();

                            res.json({
                                          success: true,
                                          message: "User logged out successfully"
                            });

              }
              catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message
                            })
              }
}

const updateUser = async (req, res) => {
              try {
                            const token = req.headers.authorization.split(" ")[1];
                            const verifyUser = await jwt.verify(token, process.env.JWT_SECRET);
                            const userId = req.params.id;
                            if (userId !== verifyUser.id) {
                                          res.json({
                                                        sucess: false,
                                                        message: "Unauthrizaed action"
                                          })
                            }

                            const existingUser = await User.findById(userId);
                            if (!existingUser) {
                                          return res.json({
                                                        success: false,
                                                        message: "User not found",
                                          });
                            }

                            let updatedProfilePicture = {};
                            if (req.files && req.files.image) {
                                          const uploadedImage = await cloudinary.uploader.upload(req.files.image.tempFilePath);
                                          updatedProfilePicture = {
                                                        profilePictureUrl: uploadedImage.secure_url,
                                                        profilePictureId: uploadedImage.public_id,
                                          };
                            }

                            const updatedFields = {
                                          username: req.body.username || existingUser.username,
                                          email: req.body.email || existingUser.email,
                                          bio: req.body.bio || existingUser.bio,
                                          gender: req.body.gender || existingUser.gender,
                                          ...updatedProfilePicture,
                            };

                            const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, { new: true });

                            res.json({
                                          success: true,
                                          message: "User updated successfully",
                                          user: updatedUser,
                            });
              } catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message,
                            });
              }
};

const getSugesstedUser = async (req, res) => {
              try {

                            const token = req.headers.authorization.split(" ")[1];
                            const verifyUser = await jwt.verify(token, process.env.JWT_SECRET);
                            const suggestUser = await User.find({
                                          _id:
                                          {
                                                        $ne: verifyUser.id
                                          }
                            })
                            if (!suggestUser) {
                                          res.json({
                                                        success: false,
                                                        message: "Currently do not have any users"
                                          })
                            }
                            res.json({
                                          success: true,
                                          message: "All user are here",
                                          users: suggestUser
                            })

              }
              catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message
                            })
              }
}
const followOrUnFollow = async (req, res) => {
              try {
                            const token = req.headers.authorization.split(" ")[1];
                            const verifyUser = await jwt.verify(token, process.env.JWT_SECRET);

                            const jiskoFollowKarnahai = req.params.id;

                            if (jiskoFollowKarnahai === verifyUser.id) {
                                          return res.json({
                                                        success: false,
                                                        message: "You cannot follow/unfollow yourself",
                                          });
                            }

                            const user = await User.findById(verifyUser.id);
                            const targetUser = await User.findById(jiskoFollowKarnahai);

                            if (!user || !targetUser) {
                                          return res.json({
                                                        success: false,
                                                        message: "User not found",
                                          });
                            }

                            // Check if already following
                            const isFollowing = user.following.includes(jiskoFollowKarnahai);

                            if (isFollowing) {
                                          // Unfollow logic
                                          await Promise.all([
                                                        User.updateOne(
                                                                      { _id: verifyUser.id },
                                                                      { $pull: { following: jiskoFollowKarnahai } }
                                                        ),
                                                        User.updateOne(
                                                                      { _id: jiskoFollowKarnahai },
                                                                      { $pull: { followers: verifyUser.id } }
                                                        ),
                                          ]);

                                          return res.json({
                                                        success: true,
                                                        message: "Successfully unfollowed the user",
                                          });
                            } else {
                                          // Follow logic
                                          await Promise.all([
                                                        User.updateOne(
                                                                      { _id: verifyUser.id },
                                                                      { $push: { following: jiskoFollowKarnahai } }
                                                        ),
                                                        User.updateOne(
                                                                      { _id: jiskoFollowKarnahai },
                                                                      { $push: { followers: verifyUser.id } }
                                                        ),
                                          ]);

                                          return res.json({
                                                        success: true,
                                                        message: "Successfully followed the user",
                                          });
                            }
              } catch (err) {
                            res.json({
                                          success: false,
                                          message: err.message,
                            });
              }
};
const getProfileById = async (req, res) => {
              try {
                            // Fetch user by ID
                            const user = await User.findById(req.params.id).populate("posts"); // Exclude sensitive fields like password

                            // If user not found
                            if (!user) {
                                          return res.status(404).json({
                                                        success: false,
                                                        message: "User not found",
                                          });
                            }

                            // Return user data
                            res.status(200).json({
                                          success: true,
                                          message: "User profile retrieved successfully",
                                          user: user,
                            });
              } catch (err) {
                            // Handle errors
                            res.status(500).json({
                                          success: false,
                                          message: err.message || "An error occurred while retrieving the user profile",
                            });
              }
};

module.exports = { register, login, getProfile, logout, updateUser, getSugesstedUser, followOrUnFollow, getProfileById }