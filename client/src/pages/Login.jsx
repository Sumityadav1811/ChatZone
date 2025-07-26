import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import userContext from "../components/userContext.jsx";
import { io } from "socket.io-client";

const Loginpage = () => {
  const API = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const { setSelectedUser, setSocket } = useContext(userContext);
  const [message, setmessage] = useState("");
  const [user_name, setuser_name] = useState("");
  const [password, setpassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    const response = await axios.post(`${API}/api/users/signin`, {
      user_name,
      password,
    });
    if (response.data.success) {
      setSelectedUser(response.data.user);
      localStorage.setItem("SelectedUser", JSON.stringify(response.data.user));

      const socketInstance = io(`${API}`, {
        query: { user_name: response.data.user.user_name },
      });
      setSocket(socketInstance);

      navigate("/chats");
    }
    setmessage(response.data.message);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="w-full max-w-md bg-gray-800/70 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Welcome Back 👋
        </h2>
        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              name="user_name"
              value={user_name}
              onChange={(e) => setuser_name(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            Sign In
          </button>
        </form>
        {message && (
          <div className="mt-4 text-center text-red-400 font-medium">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Loginpage;
