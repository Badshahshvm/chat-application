import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlignJustify,
  CircleUser,
  DiamondPlus,
  Heart,
  Home,
  MessageCircle,
  Search,
  TrendingUp,
  LogOut,
} from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import CreatePost from "./CreatePost";

const sidebarItems = [
  { icon: <Home />, text: "Home" },
  { icon: <Search />, text: "Search" },
  { icon: <TrendingUp />, text: "Explore" },
  { icon: <MessageCircle />, text: "Messages" },
  { icon: <Heart />, text: "Notifications" },
  { icon: <DiamondPlus />, text: "Create" },
  {
    icon: (
      <Avatar className="w-8 h-6">
        <AvatarImage src={localStorage.getItem("photoUrl")} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
    text: "Profile",
  },
  { icon: <LogOut />, text: "Logout" },
  { icon: <AlignJustify />, text: "More" },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v1/auth/logout",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        localStorage.removeItem("token");
        localStorage.removeItem("photoUrl");
        localStorage.removeItem("user");
        navigate("/login");
        toast.success(response.data.message || "Logged out successfully!");
      }
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error(error.response?.data?.message || "Failed to log out!");
    }
  };

  const CreatePostHandler = () => {
    setOpen(true);
  };
  const sidebarHandler = (type) => {
    if (type === "Logout") {
      handleLogout();
    } else if (type === "Create") {
      CreatePostHandler();
    }
    else if(type=="Profile")
    {
      navigate(`/profile/${localStorage.getItem("id")}`)
    }
    else if(type=="Home")
    {
      navigate("/")
    }
    else if(type==="Messages")
    {
      navigate("/chat")
    }
  };

  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
      <div className="flex flex-col">
        <div className="my-4 flex flex-col items-center">
          <img
            src="https://cdn.icon-icons.com/icons2/2890/PNG/512/apps_social_media_logo_shapes_shape_website_software_icon_182727.png"
            alt="Logo"
            className="w-20 h-20 rounded-full"
          />
        </div>
        <div>
          {sidebarItems.map((items, index) => (
            <div
              onClick={() => sidebarHandler(items.text)}
              key={index}
              className="flex items-center gap-4 relative hover:bg-blue-100 cursor-pointer rounded-lg p-3 my-3 transition-colors duration-200"
            >
              {items.icon}
              <span>{items.text}</span>
            </div>
          ))}
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default Sidebar;
