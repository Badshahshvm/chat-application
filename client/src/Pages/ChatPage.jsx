// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";

// import { toast } from "sonner"; // Import toast from sonner
// import Messages from "./Messages";
// import { Input } from "@/components/ui/input";
// import { MessageCircleCode } from "lucide-react";
// const ChatPage = () => {
//   const [user, setUser] = useState({});
//   const isOnline = true;
//   const [textMessage, setTextMessage] = useState("");
//   const navigate = useNavigate();
//   const [selectedUser, setSelectedUser] = useState({});

//   const [suggestUsers, setSuggestUser] = useState([]);

//   // Fetch suggested users
//   const getAllSuggestUser = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/v1/auth/all", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       setSuggestUser(res.data.users);
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to fetch suggested users.");
//     }
//   };

//   useEffect(() => {
//     getAllSuggestUser();
//   }, []);

//   const getUser = async () => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       toast.error("You must be logged in to edit your profile.");
//       navigate("/login");
//       return;
//     }

//     try {
//       const res = await axios.get("http://localhost:5000/api/v1/auth/me", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       console.log(res.data);
//       setUser(res.data.user);
//     } catch (err) {
//       console.error("Error fetching user data:", err);
//       toast.error("Failed to fetch user data. Please log in again.");
//       localStorage.removeItem("token");
//       navigate("/login");
//     }
//   };

//   useEffect(() => {
//     getUser();
//   }, []);

//   const sendMessageHandler = () => {
//     console.log("message is sent");
//   };
//   return (
//     <div className="flex ml-[16%] h-screen">
//       <section className="w-full md:w-1/4 my-8">
//         <h1 className="font-bold mb-4 px-3 text-xl"> {user.username}</h1>
//         <hr className="mb-4 border-gray-300" />
//         <div className="overflow-y-auto h-[80vh]">
//           {suggestUsers.map((suggestedUser) => {
//             return (
//               <div
//                 className="flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer"
//                 key={suggestedUser?._id}
//                 onClick={() => {
//                   setSelectedUser(suggestedUser);
//                 }}
//               >
//                 <Avatar className="w-14 h-14">
//                   <AvatarImage src={suggestedUser?.profilePictureUrl} />
//                   <AvatarFallback>CN</AvatarFallback>
//                 </Avatar>
//                 <div className="flex flex-col">
//                   <span className="font-medium">{suggestedUser?.username}</span>
//                   <span
//                     className={`text-xs font-bold ${
//                       isOnline ? "text-green-600" : "text-red-600"
//                     } `}
//                   >
//                     {isOnline ? "online" : "offline"}
//                   </span>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </section>
//       {selectedUser ? (
//         <section className="flex-1 border-l border-l-gray-300 flex flex-col h-full">
//           <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10">
//             <Avatar>
//               <AvatarImage
//                 src={selectedUser?.profilePictureUrl}
//                 alt="profile"
//               />
//               <AvatarFallback>CN</AvatarFallback>
//             </Avatar>
//             <div className="flex flex-col">
//               <span>{selectedUser?.username}</span>
//             </div>
//           </div>
//           <Messages selectedUser={selectedUser} />
//           <div className="flex items-center p-4 border-t border-t-gray-300">
//             <Input
//               value={textMessage}
//               onChange={(e) => setTextMessage(e.target.value)}
//               type="text"
//               className="flex-1 mr-2 focus-visible:ring-transparent"
//               placeholder="Messages..."
//             />
//             <Button onClick={() => sendMessageHandler(selectedUser?._id)}>
//               Send
//             </Button>
//           </div>
//         </section>
//       ) : (
//         <div className="flex flex-col items-center justify-center mx-auto">
//           <MessageCircleCode className="w-32 h-32 my-4" />
//           <h1 className="font-medium">Your messages</h1>
//           <span>Send a message to start a chat.</span>
//         </div>
//       )}
//     </div>
//   );
// };

// // export default ChatPage;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { toast } from "sonner";
// import Messages from "./Messages";
// import { Input } from "@/components/ui/input";
// import { MessageCircleCode } from "lucide-react";

// const ChatPage = () => {
//   const [user, setUser] = useState(null);
//   const [textMessage, setTextMessage] = useState("");
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [suggestUsers, setSuggestUsers] = useState([]);
//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const navigate = useNavigate();

//   // Fetch suggested users
//   const getAllSuggestUsers = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/v1/auth/all", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       setSuggestUsers(res.data.users);
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to fetch suggested users.");
//     }
//   };

//   // Fetch logged-in user data
//   const getUser = async () => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       toast.error("You must be logged in to access this page.");
//       navigate("/login");
//       return;
//     }

//     try {
//       const res = await axios.get("http://localhost:5000/api/v1/auth/me", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setUser(res.data.user);
//     } catch (err) {
//       console.error("Error fetching user data:", err);
//       toast.error("Failed to fetch user data. Please log in again.");
//       localStorage.removeItem("token");
//       navigate("/login");
//     }
//   };

//   // Send a new message
//   const sendMessageHandler = async (receiverId) => {
//     if (!textMessage.trim()) {
//       toast.error("Message cannot be empty.");
//       return;
//     }
//     try {
//       const res = await axios.post(
//         `http://localhost:5000/api/v1/message/send/${receiverId}`,
//         { textMessage },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       if (res.data.success) {
//         toast.success("Message sent successfully!");
//         setTextMessage("");
//       } else {
//         toast.error("Failed to send message.");
//       }
//     } catch (error) {
//       console.error("Error sending message:", error);
//       toast.error("An error occurred while sending the message.");
//     }
//   };

//   useEffect(() => {
//     getUser();
//     getAllSuggestUsers();
//   }, []);

//   return (
//     <div className="flex ml-[16%] h-screen">
//       {/* Suggested Users Section */}
//       <section className="w-full md:w-1/4 my-8">
//         <h1 className="font-bold mb-4 px-3 text-xl">{user?.username}</h1>
//         <hr className="mb-4 border-gray-300" />
//         <div className="overflow-y-auto h-[80vh]">
//           {suggestUsers.map((suggestedUser) => {
//             const isOnline = onlineUsers.includes(suggestedUser?._id);
//             return (
//               <div
//                 key={suggestedUser?._id}
//                 onClick={() => setSelectedUser(suggestedUser)}
//                 className="flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer"
//               >
//                 <Avatar className="w-14 h-14">
//                   <AvatarImage src={suggestedUser?.profilePictureUrl} />
//                   <AvatarFallback>CN</AvatarFallback>
//                 </Avatar>
//                 <div className="flex flex-col">
//                   <span className="font-medium">{suggestedUser?.username}</span>
//                   <span
//                     className={`text-xs font-bold ${
//                       isOnline ? "text-green-600" : "text-red-600"
//                     }`}
//                   >
//                     {isOnline ? "online" : "offline"}
//                   </span>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </section>

//       {/* Chat Section */}
//       {selectedUser ? (
//         <section className="flex-1 border-l border-l-gray-300 flex flex-col h-full">
//           <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10">
//             <Avatar>
//               <AvatarImage
//                 src={selectedUser?.profilePictureUrl}
//                 alt="profile"
//               />
//               <AvatarFallback>CN</AvatarFallback>
//             </Avatar>
//             <div className="flex flex-col">
//               <span>{selectedUser?.username}</span>
//             </div>
//           </div>
//           <Messages selectedUser={selectedUser} />
//           <div className="flex items-center p-4 border-t border-t-gray-300">
//             <Input
//               value={textMessage}
//               onChange={(e) => setTextMessage(e.target.value)}
//               type="text"
//               className="flex-1 mr-2 focus-visible:ring-transparent"
//               placeholder="Messages..."
//             />
//             <Button onClick={() => sendMessageHandler(selectedUser?._id)}>
//               Send
//             </Button>
//           </div>
//         </section>
//       ) : (
//         <div className="flex flex-col items-center justify-center mx-auto">
//           <MessageCircleCode className="w-32 h-32 my-4" />
//           <h1 className="font-medium">Your messages</h1>
//           <span>Send a message to start a chat.</span>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatPage;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import Messages from "./Messages";
import { Input } from "@/components/ui/input";
import { MessageCircleCode } from "lucide-react";
import { io } from "socket.io-client";

const ChatPage = () => {
  const [user, setUser] = useState(null); // Logged-in user
  const [textMessage, setTextMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null); // Selected chat user
  const [suggestUsers, setSuggestUsers] = useState([]); // Suggested users
  const [onlineUsers, setOnlineUsers] = useState([]); // List of online users
  const [socket, setSocket] = useState(null); // Socket instance
  const navigate = useNavigate();

  // Fetch suggested users
  const getAllSuggestUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/auth/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSuggestUsers(res.data.users);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch suggested users.");
    }
  };

  // Fetch logged-in user data
  const getUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You must be logged in to access this page.");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/v1/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data.user);
    } catch (err) {
      console.error("Error fetching user data:", err);
      toast.error("Failed to fetch user data. Please log in again.");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  // Send a new message
  const sendMessageHandler = async (receiverId) => {
    if (!textMessage.trim()) {
      toast.error("Message cannot be empty.");
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:5000/api/v1/message/send/${receiverId}`,

        {
          message: textMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        toast.success("Message sent successfully!");
        setTextMessage("");
      } else {
        toast.error("Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("An error occurred while sending the message.");
    }
  };

  useEffect(() => {
    getUser();
    getAllSuggestUsers();
  }, []);

  // Socket connection and listeners
  useEffect(() => {
    if (user) {
      const socketio = io("http://localhost:5000", {
        query: { userId: user._id },
        transports: ["websocket"],
      });
      setSocket(socketio);

      // Listen for online users
      socketio.on("getOnlineUsers", (users) => {
        setOnlineUsers(users); // Update online users
      });

      return () => {
        socketio.disconnect(); // Clean up socket connection
      };
    }
  }, [user]);

  return (
    <div className="flex ml-[16%] h-screen">
      {/* Suggested Users Section */}
      <section className="w-full md:w-1/4 my-8">
        <h1 className="font-bold mb-4 px-3 text-xl">{user?.username}</h1>
        <hr className="mb-4 border-gray-300" />
        <div className="overflow-y-auto h-[80vh]">
          {suggestUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id);
            return (
              <div
                key={suggestedUser?._id}
                onClick={() => setSelectedUser(suggestedUser)}
                className="flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer"
              >
                <Avatar className="w-14 h-14">
                  <AvatarImage src={suggestedUser?.profilePictureUrl} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{suggestedUser?.username}</span>
                  <span
                    className={`text-xs font-bold ${
                      isOnline ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isOnline ? "online" : "ofline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Chat Section */}
      {selectedUser ? (
        <section className="flex-1 border-l border-l-gray-300 flex flex-col h-full">
          <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10">
            <Avatar>
              <AvatarImage
                src={selectedUser?.profilePictureUrl}
                alt="profile"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span>{selectedUser?.username}</span>
            </div>
          </div>
          <Messages selectedUser={selectedUser} />
          <div className="flex items-center p-4 border-t border-t-gray-300">
            <Input
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              type="text"
              className="flex-1 mr-2 focus-visible:ring-transparent"
              placeholder="Messages..."
            />
            <Button onClick={() => sendMessageHandler(selectedUser?._id)}>
              Send
            </Button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center mx-auto">
          <MessageCircleCode className="w-32 h-32 my-4" />
          <h1 className="font-medium">Your messages</h1>
          <span>Send a message to start a chat.</span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
