// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Post from "./Post"; // Import the Post component
// import { Loader2 } from "lucide-react"; // Optional: Add a spinner
// import { toast } from "sonner"; // Optional: Add notifications

// const Posts = () => {
//   const [posts, setPosts] = useState([]); // State to store fetched posts
//   const [loading, setLoading] = useState(true); // State to handle loading
//   const handleDeletePost = (postId) => {
//     setPosts(posts.filter((p) => p._id !== postId)); // Remove post from state
//   };
//   // Function to fetch posts from the API
//   const fetchPosts = async () => {
//     try {
//       const response = await axios.get(
//         "http://localhost:5000/api/v1/post/all",
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       if (response.status === 200) {
//         console.log(response.data);
//         setPosts(response.data.posts); // Set the fetched posts in state
//       } else {
//         toast.error("Failed to fetch posts.");
//       }
//     } catch (error) {
//       console.error("Error fetching posts:", error);
//       toast.error("An error occurred while fetching posts.");
//     } finally {
//       setLoading(false); // Set loading to false after fetching
//     }
//   };

//   // useEffect to fetch posts on component mount
//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <Loader2 className="animate-spin" size={30} />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {posts.length > 0 ? (
//         posts.map((post) => (
//           <Post
//             key={post._id} // Use a unique key like post ID
//             // image={post.image}
//             // caption={post.caption}
//             // author={post.author}
//             post={post}
//             onDelete={handleDeletePost}
//           />
//         ))
//       ) : (
//         <p className="text-center text-gray-500">No posts available.</p>
//       )}
//     </div>
//   );
// };

// export default Posts;
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Post from "./Post"; // Import the Post component
import { Loader2 } from "lucide-react"; // Optional: Add a spinner
import { toast } from "sonner"; // Optional: Add notifications

const Posts = () => {
  const [posts, setPosts] = useState([]); // State to store fetched posts
  const [loading, setLoading] = useState(true); // State to handle loading

  const handleDeletePost = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((p) => p._id !== postId)); // Functional update
  };

  // Function to fetch posts from the API
  const fetchPosts = useCallback(async () => {
    setLoading(true); // Ensure loading state is reset before fetching
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/v1/post/all",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (data?.success) {
        setPosts(data.posts || []); // Use optional chaining to avoid undefined errors
      } else {
        toast.error(data?.message || "Failed to fetch posts.");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error(
        error?.response?.data?.message ||
          "An error occurred while fetching posts."
      );
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  }, []);

  // useEffect to fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin" size={30} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.length > 0 ? (
        posts.map((post) => (
          <Post
            key={post._id} // Use a unique key like post ID
            post={post}
            onDelete={handleDeletePost}
          />
        ))
      ) : (
        <p className="text-center text-gray-500">No posts available.</p>
      )}
    </div>
  );
};

export default Posts;
