// import React, { useRef } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Avatar } from "@/components/ui/avatar";
// import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
// import { Textarea } from "@/components/ui/textarea";
// const CreatePost = ({ open, setOpen }) => {
//   const imageRef = useRef();
//   const [image.setImage]=
//   const [caption,setCaption]
//   const createPostHandler = async (e) => {
//     e.preventDefault();
//   };

//   return (
//     <Dialog open={open}>
//       <DialogContent onInteractOutside={() => setOpen(false)}>
//         <DialogFooter className="text-center font-semibold">
//           Create A New Post
//         </DialogFooter>{" "}
//         <div className="flex gap-3 items-center">
//           <Avatar>
//             <AvatarImage src={localStorage.getItem("photoUrl")} />
//             <AvatarFallback>Cn</AvatarFallback>
//           </Avatar>
//           <div>
//             <h1 className="font-semibold text-xs">username</h1>
//             <span className="text-gray-700 text-xs">bio...</span>
//           </div>
//         </div>
//         <Textarea
//           className="focus-visible:ring-transparent border-none"
//           placeholder="write a caption"
//         />
//         <input type="file" className="hidden" ref={imageRef} onChange={fileChangeHandler}/>
//         <Button
//           className="w-fit mx-auto bg-blue-500 hover:bg-blue-800 text-white"
//           onClick={() => imageRef.current.click()}
//         >
//           Select From Computer
//         </Button>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default CreatePost;
import React, { useRef, useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { Loader2 } from "lucide-react"; // Import Loader2 from lucide-react
import { toast } from "sonner"; // Import toast from sonner

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [image, setImage] = useState(null); // State to store the selected image
  const [caption, setCaption] = useState(""); // State to store the caption
  const [loading, setLoading] = useState(false); // State to handle the loader
  const [user, setUser] = useState(null); // Initialize user as null

  const getUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/auth/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(res.data.user); // Store user data
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  // Handler for file input change
  const fileChangeHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Save the file in state
    }
  };

  // Function to handle post creation
  const createPostHandler = async (e) => {
    e.preventDefault();

    if (!image || !caption.trim()) {
      toast.error("Please provide both an image and a caption.");
      return;
    }

    setLoading(true); // Set loading state to true
    const formData = new FormData();
    formData.append("image", image);
    formData.append("caption", caption);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/post/new",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Post created successfully!");
        setImage(null); // Reset image
        setCaption(""); // Reset caption
        setOpen(false); // Close dialog
      } else {
        toast.error("Failed to create post. Please try again.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogFooter className="text-center font-semibold">
          Create Post
        </DialogFooter>
        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage
              src={user?.profilePictureUrl || "/default-avatar.png"}
              alt="Avatar"
            />
            <AvatarFallback>{user?.username?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-xs">
              {user?.username || "Guest"}
            </h1>
            <span className="text-gray-700 text-xs">
              {user?.bio || "No bio available"}
            </span>
          </div>
        </div>
        <Textarea
          className="focus-visible:ring-transparent border-none"
          placeholder="Write a caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        {image && (
          <div className="w-full flex justify-center my-4">
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="max-w-full max-h-64 object-contain border border-gray-300 rounded"
            />
          </div>
        )}
        <input
          type="file"
          className="hidden"
          ref={imageRef}
          onChange={fileChangeHandler}
        />
        <Button
          className="w-fit mx-auto bg-blue-500 hover:bg-blue-800 text-white"
          onClick={() => imageRef.current.click()}
          disabled={loading} // Disable button while loading
        >
          {loading ? "Uploading..." : "Select From Computer"}
        </Button>
        <Button
          className="w-fit mx-auto bg-green-500 hover:bg-green-800 text-white mt-4"
          onClick={createPostHandler}
          disabled={loading} // Disable button while loading
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={20} />
              Creating...
            </span>
          ) : (
            "Create Post"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
