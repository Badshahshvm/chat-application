// import React, { useState } from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { FaHeart } from "react-icons/fa";
// import { FaRegHeart } from "react-icons/fa";
// import { FaComment } from "react-icons/fa";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { AiFillLike } from "react-icons/ai";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
// import CommentDialog from "./CommentDialog";
// const Post = ({ post }) => {
//   const [text, setText] = useState("");
//   const [open, setOpen] = useState(false);
//   return (
//     <div className="my-8 w-full max-w-sm mx-auto">
//       <div className="flex justify-between items-center my-2">
//         <div className="flex gap-2">
//           <Avatar>
//             <AvatarImage src={post.author.profilePictureUrl} alt="post-image" />
//             <AvatarFallback>CN</AvatarFallback>
//           </Avatar>
//           <h1 className="font-semibold">{post.author.username}</h1>
//         </div>

//         <div>
//           <Dialog>
//             <DialogTrigger asChild>
//               <MoreHorizontal className="cursor-pointer" />
//             </DialogTrigger>
//             <DialogContent className="flex flex-col items-center text-sm text-center">
//               <Button
//                 variant="ghost"
//                 className="cursor-pointer w-fit text-blue-300 font-bold border"
//               >
//                 Unfollow
//               </Button>
//               <Button variant="ghost" className="cursor-pointer w-fit border">
//                 Add to Favoriates
//               </Button>
//               <Button
//                 variant="ghost"
//                 className="cursor-pointer w-fit text-blue-300 font-bold border"
//               >
//                 cancel
//               </Button>
//             </DialogContent>
//           </Dialog>
//         </div>
//       </div>
//       <img
//         src={post.imageUrl}
//         alt="post image"
//         className="rounded-sm my-2 w-full object-cove aspect-square"
//       />
//       <div className="flex gap-4 items-center justify-between my-2">
//         <div className="flex gap-3">
//           <FaRegHeart
//             size={"22px"}
//             className="cursor-pointer hover:text-red-600"
//           />

//           <MessageCircle
//             className="cursor-pointer hover:text-gray-600"
//             onClick={() => setOpen(true)}
//           />
//           <Send className="cursor-pointer hover:text-gray-600" />
//         </div>

//         <Bookmark className="cursor-pointer hover:text-gray-600" />
//       </div>
//       <span className="font-medium mb-2">{post.likes.length} likes</span>
//       <p className="cursor-pointer">
//         <span className="font-medium mr-2">{post.author.username}</span>
//         {post.caption}
//       </p>
//       <span
//         onClick={() => setOpen(true)}
//         className="cursor-pointer text-sm text-gray-400"
//       >
//         view all comments
//       </span>
//       <CommentDialog open={open} setOpen={setOpen} />
//       <div className="flex items-center justify-between">
//         <input
//           type="text"
//           placeholder="Add a comment"
//           className="outline-none text-sm w-full"
//           onChange={(e) => setText(e.target.value)}
//         />
//         {text && <span className="text-[#38ADF8] cursor-pointer">Post</span>}
//       </div>
//     </div>
//   );
// };

// export default Post;
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import CommentDialog from "./CommentDialog";
import axios from "axios";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
const Post = ({ post, onDelete }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [comments, setComments] = useState([]); // Initialize with post comments
  const [comment, setComment] = useState({});

  const getAllComments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/post/comment/${post._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.status === 200) {
        setComments(res.data.comments); // Set fetched comments
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments.");
    }
  };

  useEffect(() => {
    getAllComments(); // Fetch comments when the component mounts
  }, [post]);

  const getUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/auth/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(res.data.user);
      setLike(post.likes.includes(res.data.user?._id));
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const likeOrDislikeHandler = async () => {
    try {
      const apiEndpoint = like
        ? `http://localhost:5000/api/v1/post/dislike/${post._id}`
        : `http://localhost:5000/api/v1/post/like/${post._id}`;

      const response = await axios.post(
        apiEndpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setLike(!like);
        setLikeCount((prev) => (like ? prev - 1 : prev + 1));
        toast.success(like ? "Like removed!" : "Post liked!");
      } else {
        toast.error("Failed to update like/dislike status. Please try again.");
      }
    } catch (error) {
      console.error("Error liking or disliking the post:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/v1/post/${post._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.status === 200) {
        toast.success("Post deleted successfully!");
        onDelete(post._id);
      } else {
        toast.error("Failed to delete post. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("An error occurred while deleting the post.");
    }
  };

  const createCommentHandler = async () => {
    if (!text.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/api/v1/post/comment/${post._id}`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.status === 200) {
        setComment(res.data.comment);
        setText("");
        toast.success("Comment added successfully!");
      } else {
        toast.error("Failed to add comment. Please try again.");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("An error occurred while adding the comment.");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 my-8 w-full max-w-sm mx-auto border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.author.profilePictureUrl} alt="post-image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {post.author._id === user?._id ? (
            <div className="flex flex-col">
              <div className="text-sm font-semibold">
                {post.author.username}
              </div>
              <Badge className="mt-1" variant="secondary">
                Author
              </Badge>
            </div>
          ) : (
            <div className="text-sm font-semibold">{post.author.username}</div>
          )}
        </div>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <MoreHorizontal className="cursor-pointer hover:text-gray-600" />
            </DialogTrigger>
            <DialogContent className="flex flex-col items-center text-sm text-center bg-gray-50 rounded-lg p-4">
              <Button
                variant="ghost"
                className="cursor-pointer w-fit text-red-600 font-medium border border-gray-200 py-1 px-2 hover:bg-red-50"
              >
                Unfollow
              </Button>
              <Button
                variant="ghost"
                className="cursor-pointer w-fit border border-gray-200 py-1 px-2 hover:bg-gray-100"
              >
                Add to Favorites
              </Button>
              {post.author._id === user?._id && (
                <Button
                  variant="ghost"
                  onClick={deletePostHandler}
                  className="cursor-pointer w-fit text-blue-500 font-medium border border-gray-200 py-1 px-2 hover:bg-blue-50"
                >
                  Delete
                </Button>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Post Image */}
      <img
        src={post.imageUrl}
        alt="post image"
        className="rounded-md my-3 w-full object-cover aspect-square border border-gray-200"
      />

      {/* Action Buttons */}
      <div className="flex gap-4 items-center justify-between my-3">
        <div className="flex gap-3">
          {like ? (
            <FaHeart
              size={"22px"}
              className="cursor-pointer text-red-600 hover:text-red-800"
              onClick={likeOrDislikeHandler}
            />
          ) : (
            <FaRegHeart
              size={"22px"}
              className="cursor-pointer hover:text-red-600"
              onClick={likeOrDislikeHandler}
            />
          )}
          <MessageCircle
            size={"22px"}
            className="cursor-pointer hover:text-gray-600"
            onClick={() => setOpen(true)}
          />
          <Send size={"22px"} className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark
          size={"22px"}
          className="cursor-pointer hover:text-gray-600"
        />
      </div>

      {/* Likes and Caption */}
      <div className="mb-3">
        <span className="font-medium text-sm">{likeCount} likes</span>
        <p className="cursor-pointer text-sm mt-1">
          <span className="font-medium mr-2">{post.author.username}</span>
          {post.caption}
        </p>
      </div>

      {/* Comments Section
      <div className="mb-3" onClick={() => setOpen(true)}>
        {comments.map((comment, index) => (
          <p key={index} className="text-sm mt-1">
            <span className="font-medium mr-2">{comment.author.username}</span>
            {comment.text}
          </p>
        ))}
      </div> */}

      {/* View Comments */}
      <span
        onClick={() => setOpen(true)}
        className="cursor-pointer text-sm text-blue-400 hover:underline"
      >
        View all {comments.length} comments
      </span>
      <CommentDialog open={open} setOpen={setOpen} post={post} />

      {/* Add a Comment */}
      <div className="flex items-center justify-between mt-3 border-t pt-3">
        <input
          type="text"
          placeholder="Write a comment"
          value={text}
          className="outline-none text-sm w-full text-gray-700 placeholder-gray-400 bg-transparent"
          onChange={(e) => setText(e.target.value)}
        />
        {text && (
          <span
            onClick={createCommentHandler}
            className="text-blue-500 font-medium text-sm cursor-pointer hover:underline"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
