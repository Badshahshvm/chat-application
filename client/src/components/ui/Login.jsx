import React, { useState, useEffect } from "react";
import { Input } from "./input";
import { Button } from "./button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [input, setInput] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/api/v1/auth", input);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("photoUrl", res.data.user.profilePictureUrl);
      localStorage.setItem("id", res.data.user._id);

      if (res.data.success) {
        toast.success(res.data.message);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Invalid login credentials!"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Redirect if user is already logged in
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      navigate("/");
    }
  }, []);

  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <form
        onSubmit={loginHandler}
        className="shadow-lg flex flex-col gap-5 p-8"
      >
        <div className="my-4">
          <div className="my-4 flex flex-col items-center">
            {/* Updated logo image */}
            <img
              src="https://cdn.icon-icons.com/icons2/2890/PNG/512/apps_social_media_logo_shapes_shape_website_software_icon_182727.png" // Update with the correct logo image path
              alt="Logo"
              className="w-20 h-20 rounded-full"
            />
          </div>
          <p className="text-sm text-center font-bold">Login to your account</p>
        </div>
        <div>
          <span className="font-medium">Username</span>
          <Input
            type="text"
            name="usernameOrEmail"
            value={input.usernameOrEmail}
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
        {loading ? (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Logging in...
          </Button>
        ) : (
          <Button
            type="submit"
            className="bg-blue-400 text-white hover:bg-blue-700"
          >
            Login
          </Button>
        )}
        <span className="text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600">
            Signup
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
