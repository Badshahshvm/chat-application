// import { useState, useEffect } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import "./App.css";
// import { Button } from "./components/ui/button";
// import Signup from "./components/ui/Signup";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { Toaster } from "./components/ui/sonner";
// import Login from "./components/ui/Login";
// import HomePage from "./Pages/HomePage";
// import Home from "./Pages/Home";
// import Profile from "./Pages/Profile";
// import EditProfile from "./Pages/EditProfile";
// import { Navigate } from "react-router-dom";
// import ChatPage from "./Pages/ChatPage";
// import { io } from "socket.io-client";
// const isAuthenticated = () => {
//   // Replace this with your actual authentication logic
//   return localStorage.getItem("token") !== null;
// };

// const browserRouter = createBrowserRouter([
//   {
//     path: "/",
//     element: isAuthenticated() ? <HomePage /> : <Login />,
//     children: [
//       {
//         index: true, // Redirects to Home by default
//         element: <Home />,
//       },
//       {
//         path: "/",
//         element: <Home />,
//       },
//       {
//         path: "profile/:id",
//         element: <Profile />,
//       },
//       {
//         path: "account/:id/edit",
//         element: <EditProfile />,
//       },
//       {
//         path: "chat",
//         element: <ChatPage />,
//       },
//     ],
//   },
//   {
//     path: "signup",
//     element: <Signup />,
//   },
//   {
//     path: "login",
//     element: <Login />,
//   },
// ]);

// function App() {
//   return (
//     <>
//       <Toaster />
//       <RouterProvider router={browserRouter} />
//     </>
//   );
// }

// export default App;
import { useState, useEffect } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import Login from "./components/ui/Login";
import HomePage from "./Pages/HomePage";
import Home from "./Pages/Home";
import ChatPage from "./Pages/ChatPage";
import Profile from "./Pages/Profile";
import EditProfile from "./Pages/EditProfile";
import { io } from "socket.io-client";
import { toast } from "sonner";
import axios from "axios";
import Signup from "./components/ui/Signup";

const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: isAuthenticated() ? <HomePage /> : <Login />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "profile/:id",
        element: <Profile />,
      },
      {
        path: "account/:id/edit",
        element: <EditProfile />,
      },
      {
        path: "chat",
        element: <ChatPage />,
      },
    ],
  },
  {
    path: "signup",
    element: <Signup />,
  },
  {
    path: "login",
    element: <Login />,
  },
]);

function App() {
  return (
    <>
      <Toaster />
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;
