// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import axios from "axios";
// import { toast } from "sonner";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// import { Badge } from "@/components/ui/badge";
// import { Link } from "react-router-dom";
// const SuggestedUser = () => {
//   const [suggestUser, setSuggestUser] = useState([]);

//   const getAllSuggestUser = async () => {
//     await axios
//       .get(
//         "http://localhost:5000/api/v1/auth/all",

//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       )
//       .then((res) => {
//         console.log(res.data);
//         setSuggestUser(res.data.users);
//       })
//       .catch((err) => console.log(err));
//   };
//   useEffect(() => {
//     getAllSuggestUser();
//   }, []);
//   return (
//     <div className="my-10">
//       <div className="flex items-center justify-between text-sm gap-3">
//         <h1 className="font-semibold text-gray-600">Suggested For You</h1>
//         <span className="font-medium cursor-pointer">See All</span>
//       </div>
//       {suggestUser.map((user) => {
//         return (
//           <div key={user._id}>
//             <div className="flex items-center gap-2">
//               <Link to={`/profile/${user._id}`}>
//                 <Avatar className="h-10 w-10">
//                   <AvatarImage src={user.profilePictureUrl} alt="post-image" />
//                   <AvatarFallback>CN</AvatarFallback>
//                 </Avatar>
//               </Link>
//               <div className="flex items-center gap-3 flex-col">
//                         <h1 className="font-semibold text-sm">
//                           <Link to={`/profile/${user._id}`}>{user.username}</Link>
//                         </h1>
//                         <span className="text-sm text-gray-400">{user.bio || "bio"}</span>
//                       </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default SuggestedUser;
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const SuggestedUser = () => {
  const [suggestUser, setSuggestUser] = useState([]);

  // Fetch suggested users
  const getAllSuggestUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/auth/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSuggestUser(res.data.users);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch suggested users.");
    }
  };

  useEffect(() => {
    getAllSuggestUser();
  }, []);

  return (
    <div className="my-10 bg-white shadow-sm p-6 rounded-lg ">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-semibold text-sm text-gray-800">
          Suggested For You
        </h1>
        <span className="text-sm text-blue-600 font-medium cursor-pointer hover:underline">
          See All
        </span>
      </div>

      {/* Suggested Users List */}
      {suggestUser.map((user) => (
        <div
          key={user._id}
          className="flex items-center justify-between py-4 border-b border-gray-200"
        >
          <div className="flex items-center gap-2">
            {/* Avatar */}
            <Link to={`/profile/${user._id}`}>
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.profilePictureUrl} alt="user-profile" />
                <AvatarFallback>
                  {user.username ? user.username[0].toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
            </Link>

            {/* User Info */}
            <div className="flex flex-col gap-1 p-1">
              <h2 className="font-semibold text-sm text-gray-800 hover:underline">
                <Link to={`/profile/${user._id}`}>{user.username}</Link>
              </h2>
              <span className="text-sm text-gray-500">
                {user.bio || "No bio available"}
              </span>
            </div>
            <Button className="bg-blue-600 text-white hover:bg-blue-700 text-sm px-2 py-2 rounded-md ">
              Follow
            </Button>
          </div>
        </div>
      ))}

      {/* Empty State */}
      {suggestUser.length === 0 && (
        <div className="text-center text-gray-500 mt-6">
          <p>No suggestions available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default SuggestedUser;
