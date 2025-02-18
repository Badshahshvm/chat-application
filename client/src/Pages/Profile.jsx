// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { AtSign, Heart, MessageCircle } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// const Profile = () => {
//   const { id } = useParams(); // Get user ID from URL params
//   const [user, setUser] = useState({}); // State to store user data
//   const [loading, setLoading] = useState(true); // Loading state

//   const fetchUserProfile = async () => {
//     try {
//       const res = await axios.get(
//         `http://localhost:5000/api/v1/auth/profile/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       setUser(res.data.user); // Set fetched user data
//       setLoading(false); // Stop loading
//     } catch (err) {
//       console.error("Error fetching user profile:", err);
//       setLoading(false); // Stop loading even on error
//     }
//   };

//   useEffect(() => {
//     fetchUserProfile(); // Fetch user profile on component mount
//   }, [id]); // Re-run if ID changes

//   return (
//     <div className="flex max-w-5xl justify-center mx-auto pl-10">
//       <div className="flex flex-col gap-20 p-8">
//         <div className="grid grid-cols-2">
//           <section className="flex items-center justify-center">
//             <Avatar className="h-32 w-32">
//               <AvatarImage src={user.profilePictureUrl} />
//             </Avatar>
//           </section>
//           <section>
//             <div className="flex flex-col gap-5">
//               <div className="flex items-center gap-2">
//                 <span className="mr-2 font-semibold">{user.username}</span>
//                 <div className="flex gap-3">
//                   {id === localStorage.getItem("id") ? (
//                     <>
//                       <Button
//                         className="hover:bg-gray-200 h-8"
//                         variant="secondary"
//                       >
//                         Edit
//                       </Button>
//                       <Button
//                         className="hover:bg-gray-200 h-8"
//                         variant="secondary"
//                       >
//                         View Archive
//                       </Button>
//                       <Button
//                         className="hover:bg-gray-200 h-8"
//                         variant="secondary"
//                       >
//                         Add
//                       </Button>
//                     </>
//                   ) : (
//                     <>
//                       <Button
//                         className="hover:bg-gray-200 h-8 hover:text-black bg-blue-500 text-white"
//                         variant="secondary"
//                       >
//                         Follow
//                       </Button>
//                       <Button
//                         className="hover:bg-gray-200 h-8 hover:text-black bg-orange-500 text-white"
//                         variant="secondary"
//                       >
//                         Message
//                       </Button>
//                     </>
//                   )}
//                 </div>
//               </div>

//               <div>
//                 <p>
//                   <span className="font-semibold">
//                     {user.posts.length || 0}{" "}
//                   </span>
//                   posts
//                 </p>
//                 <p>
//                   <span className="font-semibold">
//                     {user.followers.length || 0}{" "}
//                   </span>
//                   followers
//                 </p>
//                 <p>
//                   <span className="font-semibold">
//                     {user.following.length || 0}{" "}
//                   </span>
//                   following
//                 </p>
//               </div>
//               <div className="flex flex-col gap-1">
//                 <span className="font-semibold">
//                   {user?.bio || "bio here..."}
//                 </span>
//                 <Badge className="w-fit" variant="secondary">
//                   <AtSign /> <span className="pl-1">{user?.username}</span>{" "}
//                 </Badge>
//                 <span>🤯Learn code with patel mernstack style</span>
//                 <span>🤯Turing code into fun</span>
//                 <span>🤯DM for collaboration</span>
//               </div>
//             </div>
//           </section>
//         </div>
//       </div>
//     </div>
//   ); // Return user data and loading state
// };

// export default Profile;
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posts");
  const { id } = useParams(); // Get user ID from URL params
  const [user, setUser] = useState(null); // State to store user data
  const [loading, setLoading] = useState(true); // Loading state
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const displayedPost = activeTab === "posts" ? user?.posts : user?.bookmarks;

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/auth/profile/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUser(res.data.user); // Set fetched user data
    } catch (err) {
      console.error("Error fetching user profile:", err);
    } finally {
      setLoading(false); // Stop loading even on error
    }
  };

  useEffect(() => {
    fetchUserProfile(); // Fetch user profile on component mount
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>User not found</p>
      </div>
    );
  }

  return (
    <div className="flex max-w-5xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2 gap-5">
          {/* Avatar Section */}
          <section className="flex items-center justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src={user.profilePictureUrl}
                alt={`${user.username}'s profile`}
              />
              <AvatarFallback>{user.username?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
          </section>

          {/* Profile Info Section */}
          <section>
            <div className="flex flex-col gap-5">
              {/* Username and Actions */}
              <div className="flex items-center gap-2">
                <span className="mr-2 font-semibold text-lg">
                  {user.username}
                </span>
                <div className="flex gap-3">
                  {id === localStorage.getItem("id") ? (
                    <>
                      <Button
                        className="hover:bg-gray-200 h-8"
                        variant="secondary"
                        onClick={() => navigate(`/account/${id}/edit`)}
                      >
                        Edit
                      </Button>
                      <Button
                        className="hover:bg-gray-200 h-8"
                        variant="secondary"
                      >
                        View Archive
                      </Button>
                      <Button
                        className="hover:bg-gray-200 h-8"
                        variant="secondary"
                      >
                        Add
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        className="hover:bg-gray-200 h-8 hover:text-black bg-blue-500 text-white"
                        variant="secondary"
                      >
                        Follow
                      </Button>
                      <Button
                        className="hover:bg-gray-200 h-8 hover:text-black bg-orange-500 text-white"
                        variant="secondary"
                      >
                        Message
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Stats Section */}
              <div className="flex gap-5">
                <p>
                  <span className="font-semibold">
                    {user.posts?.length || 0}
                  </span>{" "}
                  posts
                </p>
                <p>
                  <span className="font-semibold">
                    {user.followers?.length || 0}
                  </span>{" "}
                  followers
                </p>
                <p>
                  <span className="font-semibold">
                    {user.following?.length || 0}
                  </span>{" "}
                  following
                </p>
              </div>

              {/* Bio and Other Info */}
              <div className="flex flex-col gap-1">
                <span className="font-semibold">
                  {user?.bio || "No bio available"}
                </span>
                <Badge className="w-fit" variant="secondary">
                  <AtSign /> <span className="pl-1">{user?.username}</span>
                </Badge>
                <span>🌐 Connect with me on LinkedIn</span>
                <span>🐦 Follow me on Twitter</span>
                <span>📸 Check out me on Instagram</span>
              </div>
            </div>
          </section>
        </div>
        <div className="border-t border-t-gray-200">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "posts" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("posts")}
            >
              POSTS
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "saved" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("saved")}
            >
              SAVED
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "reels" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("reels")}
            >
              REELS
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "tags" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("tags")}
            >
              TAGS
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {displayedPost?.map((post) => {
              return (
                <div key={post?._id} className="relative group cursor-pointer">
                  <img
                    src={post.imageUrl}
                    alt="postimage"
                    className="rounded-sm my-2 w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center text-white space-x-4">
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <Heart />
                        <span>{post?.likes.length}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <MessageCircle />
                        <span>{post?.comments.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
