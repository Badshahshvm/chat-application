// import React, { useState, useEffect } from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import axios from "axios";
// import { toast } from "sonner";
// import { Badge } from "@/components/ui/badge";
// import { Link } from "react-router-dom";
// import SuggestedUser from "./SuggestedUser";
// const RightSidebar = () => {
//   const [user, setUser] = useState({}); // Initialize user as null

//   const getUser = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/v1/auth/me", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       setUser(res.data.user); // Store user data
//       console.log(res.data.user);
//     } catch (err) {
//       console.error("Error fetching user data:", err);
//     }
//   };

//   useEffect(() => {
//     getUser();
//   }, []);

//   return (
//     <div className="m-fit my-10 pr-32">
//       <div className="flex items-center gap-2">
//         <Link to={`/profile/${user._id}`}>
//           <Avatar className="h-10 w-10">
//             <AvatarImage src={user.profilePictureUrl} alt="post-image" />
//             <AvatarFallback>CN</AvatarFallback>
//           </Avatar>
//         </Link>
//         <div className="flex items-center gap-3 flex-col">
//           <h1 className="font-semibold text-sm">
//             <Link to={`/profile/${user._id}`}>{user.username}</Link>
//           </h1>
//           <span className="text-sm text-gray-400">{user.bio || "bio"}</span>
//         </div>
//       </div>
//       <SuggestedUser />
//     </div>
//   );
// };

// // export default RightSidebar;
// import React, { useState, useEffect } from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import SuggestedUser from "./SuggestedUser";

// const RightSidebar = () => {
//   const [user, setUser] = useState({}); // Initialize user as empty object

//   const getUser = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/v1/auth/me", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       setUser(res.data.user); // Store user data
//     } catch (err) {
//       console.error("Error fetching user data:", err);
//     }
//   };

//   useEffect(() => {
//     getUser();
//   }, []);

//   return (
//     <div className="w-full md:w-72 bg-white p-6 shadow-md rounded-lg space-y-8 my-8">
//       {/* User Profile Section */}
//       <div className="flex items-center gap-4">
//         <Link to={`/profile/${user._id}`}>
//           <Avatar className="h-14 w-14 border-2 border-blue-500">
//             <AvatarImage src={user.profilePictureUrl} alt="user-profile" />
//             <AvatarFallback>
//               {user.username?.charAt(0).toUpperCase() || "U"}
//             </AvatarFallback>
//           </Avatar>
//         </Link>
//         <div>
//           <h1 className="font-semibold text-sm text-gray-800">
//             <Link to={`/profile/${user._id}`} className="hover:underline">
//               {user.username || "Username"}
//             </Link>
//           </h1>
//           <p className="text-sm text-gray-500">
//             {user.bio || "No bio available"}
//           </p>
//         </div>
//       </div>

//       {/* Suggested Users Section */}
//       <SuggestedUser />
//     </div>
//   );
// };

// export default RightSidebar;
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import SuggestedUser from "./SuggestedUser";
import PrivateRoute from "./PrivateRoute";

const RightSidebar = () => {
  const [user, setUser] = useState(null); // Initialize user as null
  const navigate = useNavigate(); // Hook for navigation

  const getUser = async () => {
    const token = localStorage.getItem("token"); // Check if token exists
    if (!token) {
      // If no token, redirect to login page
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/v1/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data.user); // Store user data
    } catch (err) {
      console.error("Error fetching user data:", err);
      // If an error occurs, you can clear the token or handle the error as needed
      localStorage.removeItem("token");
      navigate("/login"); // Redirect to login if there's an issue with the API
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  if (!user) {
    return (
      <div
        className="w-full md:w-72 bg-white p-6 shadow-md rounded-lg space-y-8 my-8"
        style={{
          position: "fixed",
          top: "80px",
          right: "20px",
          maxHeight: "calc(100vh - 100px)",
          overflowY: "auto",
        }}
      >
        <h2 className="text-lg font-semibold text-gray-800">Please log in</h2>
        <p className="text-sm text-gray-500">
          You need to log in to view your profile and suggestions.
        </p>
        <Link to="/login" className="text-blue-500 hover:underline">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <PrivateRoute>
      <div
        className="w-full md:w-72 bg-white p-6 shadow-md rounded-lg space-y-8 my-8"
        style={{
          position: "fixed",
          top: "80px",
          right: "20px",
          maxHeight: "calc(100vh - 100px)",
          overflowY: "auto",
        }}
      >
        {/* User Profile Section */}
        <div className="flex items-center gap-4">
          <Link to={`/profile/${user._id}`}>
            <Avatar className="h-14 w-14 border-2 border-blue-500">
              <AvatarImage src={user.profilePictureUrl} alt="user-profile" />
              <AvatarFallback>
                {user.username?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <h1 className="font-semibold text-sm text-gray-800">
              <Link to={`/profile/${user._id}`} className="hover:underline">
                {user.username || "Username"}
              </Link>
            </h1>
            <p className="text-sm text-gray-500">
              {user.bio || "No bio available"}
            </p>
          </div>
        </div>

        {/* Suggested Users Section */}
        <SuggestedUser />
      </div>
    </PrivateRoute>
  );
};

export default RightSidebar;
