import React, { useEffect, useState } from "react";
import { Label } from "./label";
import { Input } from "./input";
import { Button } from "./button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [image, setImage] = useState(null); // State for image file
  const [preview, setPreview] = useState(null); // State for image preview
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const imageChangeHandler = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result); // Set preview URL
      reader.readAsDataURL(file);
    }
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Create FormData to send image and other fields
      const formData = new FormData();
      formData.append("username", input.username);
      formData.append("email", input.email);
      formData.append("password", input.password);
      if (image) formData.append("image", image);

      const res = await axios.post(
        "http://localhost:5000/api/v1/auth/register",
        formData
      );
      console.log(res.data);
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
        setInput({
          username: "",
          email: "",
          password: "",
        });
        setImage(null);
        setPreview(null);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Redirect if user is already logged in (removed Redux dependency)
    const user = JSON.parse(localStorage.getItem("user")); // Check user in localStorage
    if (user) {
      navigate("/");
    }
  }, []);

  return (
    <div className="flex items-center w-screen h-screen justify-center bg-gray-100">
      <form
        onSubmit={signupHandler}
        className="shadow-lg flex flex-col gap-5 p-8 bg-white rounded-lg"
      >
        <div className="my-4 flex flex-col items-center">
          {/* Updated logo image */}
          <img
            src="https://cdn.icon-icons.com/icons2/2890/PNG/512/apps_social_media_logo_shapes_shape_website_software_icon_182727.png" // Update with the correct logo image path
            alt="Logo"
            className="w-20 h-20 rounded-full"
          />
        </div>
        <div>
          <span className="font-medium">Username</span>
          <Input
            type="text"
            name="username"
            value={input.username}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        <div>
          <span className="font-medium">Email</span>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        <div>
          <span className="font-medium">Password</span>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        <div>
          <span className="font-medium">Profile Image</span>
          <Input
            type="file"
            accept="image/*"
            onChange={imageChangeHandler}
            className="my-2"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-16 h-16 rounded-full mt-2"
            />
          )}
        </div>
        {loading ? (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button
            type="submit"
            className="bg-blue-400 text-white hover:bg-blue-700"
          >
            Signup
          </Button>
        )}
        <span className="text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Signup;
