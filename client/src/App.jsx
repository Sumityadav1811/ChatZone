import React, { useState, useEffect, useContext } from "react";
import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import userContext from "./components/userContext";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import ChatApp from "./pages/ChatApp";
import { io } from "socket.io-client";

const App = () => {
  const { SelectedUser, setSelectedUser, socket, setSocket } =
    useContext(userContext);

  useEffect(() => {
    const storedUser = localStorage.getItem("SelectedUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setSelectedUser(parsedUser);

      const newSocket = io("http://localhost:5000", {
        query: { user_name: parsedUser.user_name },
      });
      setSocket(newSocket);

      return () => newSocket.close(); // cleanup
    }
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/chats" element={<ChatApp />} />
      </Routes>
    </div>
  );
};

export default App;
