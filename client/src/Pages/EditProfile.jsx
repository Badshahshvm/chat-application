import React, { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner"; // Import toast from sonner

const EditProfile = () => {
  const [user, setUser] = useState({ username: "", bio: "", gender: "" });
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const navigate = useNavigate();
  const imageRef = useRef();
  const { id } = useParams(); // Ensure this is destructured outside `getUser`

  const getUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to edit your profile.");
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
      setBio(res.data.user.bio || "");
      setGender(res.data.user.gender || "");
    } catch (err) {
      console.error("Error fetching user data:", err);
      toast.error("Failed to fetch user data. Please log in again.");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  // const handleProfilePictureChange = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   const formData = new FormData();
  //   formData.append("image", file);

  //   try {
  //     const token = localStorage.getItem("token");
  //     await axios.patch(`http://localhost:5000/api/v1/auth/${id}`, formData, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });
  //     toast.success("Profile picture updated successfully!");
  //     getUser(); // Refresh user data
  //   } catch (err) {
  //     console.error("Error uploading profile picture:", err);
  //     toast.error("Failed to upload profile picture. Try again.");
  //   }
  // };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `http://localhost:5000/api/v1/auth/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedProfilePictureUrl = res.data.user.profilePictureUrl; // Assuming the server responds with the updated profile picture URL.
      setUser((prev) => ({
        ...prev,
        profilePictureUrl: updatedProfilePictureUrl,
      })); // Update the user state.

      toast.success("Profile picture updated successfully!");
    } catch (err) {
      console.error("Error uploading profile picture:", err);
      toast.error("Failed to upload profile picture. Try again.");
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/v1/auth/${id}`,
        { bio, gender },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Profile updated successfully!");
      getUser(); // Refresh user data
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile. Try again.");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="flex flex-col max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="font-bold text-2xl mb-6 text-center">Edit Profile</h1>
      <section className="flex flex-col w-full gap-6">
        <div className="flex items-center gap-4 bg-gray-100 rounded-lg p-4 shadow">
          <Link to={`/profile/${user._id}`}>
            <Avatar className="h-16 w-16 border-2 border-blue-500">
              <AvatarImage src={user.profilePictureUrl} alt="user-profile" />
              <AvatarFallback>
                {user.username?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1">
            <h1 className="font-semibold text-lg text-gray-800">
              <Link to={`/profile/${user._id}`} className="hover:underline">
                {user.username || "Username"}
              </Link>
            </h1>
            <p className="text-sm text-gray-500">
              {user.bio || "No bio available"}
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            ref={imageRef}
            onChange={handleProfilePictureChange}
          />
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => imageRef.current.click()}
          >
            Change Profile
          </Button>
        </div>

        <div>
          <h1 className="font-semibold text-lg mb-2">Bio</h1>
          <Textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write something about yourself..."
          />
        </div>

        <div>
          <h1 className="font-semibold text-lg mb-2">Gender</h1>
          <Select value={gender} onValueChange={(value) => setGender(value)}>
            <SelectTrigger className="w-full border border-gray-300 rounded-lg">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end">
          <Button
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
