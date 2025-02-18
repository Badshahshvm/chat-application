// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Avatar } from "@/components/ui/avatar";
// import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
// import { Link } from "react-router-dom";
// import { MoreHorizontal } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import axios from "axios";
// import { toast } from "sonner";
// const CommentDialog = ({ open, setOpen, post }) => {
//   const [comments, setComments] = useState(post.comments || []);
//   const [comment, setComment] = useState({});
//   const [text, setText] = useState("");
//   const changeEventHandler = (e) => {
//     const t = e.target.value;
//     if (t.trim()) {
//       setText(t);
//     } else {
//       setText("");
//     }
//   };

//   const createCommentHandler = async () => {
//     if (!text.trim()) {
//       toast.error("Comment cannot be empty.");
//       return;
//     }

//     try {
//       const res = await axios.post(
//         `http://localhost:5000/api/v1/post/comment/${post._id}`,
//         { text },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       if (res.status === 200) {
//         setComment(res.data.comment);
//         setText("");
//         toast.success("Comment added successfully!");
//       } else {
//         toast.error("Failed to add comment. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error adding comment:", error);
//       toast.error("An error occurred while adding the comment.");
//     }
//   };
//   const sendMessageHandler = async () => {
//     alert(text);
//   };
//   const getAllComments = async () => {};

//   useEffect(() => {
//     getAllComments();
//   }, []);

//   return (
//     <Dialog open={open}>
//       <DialogContent
//         onInteractOutside={() => setOpen(false)}
//         className="max-w-5xl p-0 flex flex-col"
//       >
//         <div className="flex flex-1">
//           <div className="w-1/2">
//             <img
//               src={post.imageUrl}
//               alt="post_img"
//               className="w-full h-full object-cover rounded-l-lg"
//             />
//           </div>
//           <div className="w-1/2 flex flex-col justify-between">
//             <div className="flex items-center justify-between p-4">
//               <div className="flex gap-3 items-center">
//                 <Link>
//                   <Avatar>
//                     <AvatarImage src={localStorage.getItem("photoUrl")} />
//                     <AvatarFallback>CN</AvatarFallback>
//                   </Avatar>
//                 </Link>
//                 <div>
//                   <Link className="font-semibold text-xs">username</Link>
//                   {/* <span className='text-gray-600 text-sm'>Bio here...</span> */}
//                 </div>
//               </div>

//               <Dialog>
//                 <DialogTrigger asChild>
//                   <MoreHorizontal className="cursor-pointer" />
//                 </DialogTrigger>
//                 <DialogContent className="flex flex-col items-center text-sm text-center">
//                   <div className="cursor-pointer w-full text-[#ED4956] font-bold">
//                     Unfollow
//                   </div>
//                   <div className="cursor-pointer w-full">Add to favorites</div>
//                 </DialogContent>
//               </Dialog>
//             </div>
//             <hr />
//             <div className="flex-1 overflow-y-auto max-h-96 p-4">comments</div>
//             <div className="p-4">
//               <div className="flex items-center gap-2">
//                 <input
//                   type="text"
//                   placeholder="Add a comment..."
//                   className="w-full outline-none border text-sm border-gray-300 p-2 rounded"
//                   onChange={changeEventHandler}
//                 />
//                 <Button
//                   variant="outline"
//                   disabled={!text.trim()}
//                   onClick={sendMessageHandler}
//                 >
//                   Send
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default CommentDialog;

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";

const CommentDialog = ({ open, setOpen, post }) => {
  const [comments, setComments] = useState(post.comments || []);
  const [text, setText] = useState("");

  const changeEventHandler = (e) => {
    const t = e.target.value;
    if (t.trim()) {
      setText(t);
    } else {
      setText("");
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
        setComments([res.data.comment, ...comments]); // Prepend new comment
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

  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogContent className="max-w-5xl p-0 flex flex-col">
        <div className="flex flex-1">
          <div className="w-1/2">
            <img
              src={post.imageUrl}
              alt="post_img"
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar className="border-2 border-gray-300">
                    <AvatarImage src={localStorage.getItem("photoUrl")} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-xs text-blue-500 hover:text-blue-700 transition-colors duration-300">
                    UserName
                  </Link>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer text-gray-600 hover:text-black transition-colors" />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center">
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                    Unfollow
                  </div>
                  <div className="cursor-pointer w-full">Add to favorites</div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-96 p-4 space-y-4">
              {comments.length === 0 ? (
                <p className="text-center text-gray-500">No comments yet.</p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg shadow-sm"
                  >
                    <Avatar className="border-2 border-gray-300">
                      <AvatarImage src={comment.author.profilePictureUrl} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <Link className="font-semibold text-sm text-blue-600 hover:text-blue-800 transition-colors duration-300">
                        {comment.author.username}
                      </Link>
                      <p className="text-sm text-gray-700 mt-1">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="w-full outline-none border text-sm border-gray-300 p-2 rounded"
                  onChange={changeEventHandler}
                  value={text}
                />
                <Button
                  variant="outline"
                  disabled={!text.trim()}
                  onClick={createCommentHandler}
                  className="cursor-pointer px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
