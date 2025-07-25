import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import userContext from "../components/userContext.jsx";
import { io } from "socket.io-client";

const Loginpage = () => {
  const navigate = useNavigate();
  const { setSelectedUser, setSocket } = useContext(userContext);
  const [message, setmessage] = useState("");
  const [user_name, setuser_name] = useState("");
  const [password, setpassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      "http://localhost:5000/api/users/signin",
      {
        user_name,
        password,
      }
    );
    if (response.data.success) {
      setSelectedUser(response.data.user);
      localStorage.setItem("SelectedUser", JSON.stringify(response.data.user));

      const socketInstance = io("http://localhost:5000", {
        query: { user_name: response.data.user.user_name },
      });
      setSocket(socketInstance);

      navigate("/chats");
    }
    setmessage(response.data.message);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>
        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="user_name"
              value={user_name}
              onChange={(e) => setuser_name(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Submit
          </button>
        </form>
        {message && (
          <div className="mt-4 text-center text-red-500 font-semibold">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Loginpage;
