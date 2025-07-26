import React, { useState, useContext } from "react";
import axios from "axios";
import userContext from "../components/userContext";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const Signup = () => {
  const API = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const { socket, setSelectedUser, setSocket } = useContext(userContext);
  const [form, setform] = useState({
    name: "",
    user_name: "",
    password: "",
    gender: "",
  });

  const changeHandler = (e) => {
    setform((form) => ({ ...form, [e.target.name]: e.target.value }));
  };

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(`${API}/api/users/register`, form);
      if (response.data.success) {
        setSelectedUser(response.data.user);
        localStorage.setItem(
          "SelectedUser",
          JSON.stringify(response.data.user)
        );
        const socketInstance = io(`${API}`, {
          query: { user_name: response.data.user.user_name },
          transports: ["websocket"],
          withCredentials: true,
        });
        setSocket(socketInstance);
        navigate("/chats");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="w-full max-w-md bg-gray-800/70 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Create an Account 🚀
        </h2>
        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={changeHandler}
              className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              name="user_name"
              value={form.user_name}
              onChange={changeHandler}
              className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Choose a unique username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={changeHandler}
              className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Create a strong password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={form.gender}
              onChange={changeHandler}
              className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="" disabled>
                Select your gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
