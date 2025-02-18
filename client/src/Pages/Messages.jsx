// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// const Messages = ({ selectedUser }) => {
//   const [textMessage,setTextMessage]=useState({})
//   return (
//     <div className="overflow-y-auto flex-1 p-4">
//       <div className="flex justify-center">
//         <div className="flex flex-col items-center justify-center">
//           <Avatar>
//             <AvatarImage src={selectedUser.profilePictureUrl} alt="logo" />
//             <AvatarFallback>CN</AvatarFallback>
//           </Avatar>
//           <span>{selectedUser.username}</span>
//           <Link to={`/profile/${selectedUser._id}`}>
//             <Button className="h-8 my-2 " variant="secondary">
//               View Profile
//             </Button>
//           </Link>
//         </div>
//       </div>
//       <div className="flex flex-col gap-3">
//         {[1, 2, 3, 4, 5].map((messgae) => {
//           return (
//             <div className={`[flex]`}>
//               <div>{messgae}</div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Messages;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const Messages = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]); // State to hold fetched messages

  // Function to fetch messages from the server
  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/message/all/${selectedUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        console.log(res.data.messages);
        setMessages(res.data.messages[0].messages); // Access the messages inside the first conversation
      } else {
        toast.error("Failed to fetch messages.");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("An error occurred while fetching messages.");
    }
  };

  // Fetch messages when the component mounts or when the selected user changes
  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
    }
  }, [selectedUser, fetchMessages]);

  return (
    <div className="overflow-y-auto flex-1 p-4">
      {/* Profile Section */}
      <div className="flex justify-center mb-6">
        <div className="flex flex-col items-center justify-center">
          <Avatar>
            <AvatarImage src={selectedUser.profilePictureUrl} alt="logo" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span>{selectedUser.username}</span>
          <Link to={`/profile/${selectedUser._id}`}>
            <Button className="h-8 my-2" variant="secondary">
              View Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Messages Section */}
      <div className="flex flex-col gap-3 mt-4">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-4 ${
                message.senderId === selectedUser._id
                  ? "self-start bg-gray-200 text-gray-800"
                  : "self-end bg-blue-500 text-white"
              } p-4 rounded-lg max-w-xs shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105`}
            >
              {/* Sender Profile Picture */}

              {/* Message Text */}
              <div>
                <p>{message.message}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center">No messages yet</div>
        )}
      </div>
    </div>
  );
};

export default Messages;
