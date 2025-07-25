import React, { useState } from "react";
import axios from "axios";
import userContext from "../components/userContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const Signup = () => {
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
      console.log(form);
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        form
      );
      console.log("response received in signup", response.data);
      if (response.data.success) {
        setSelectedUser(response.data.user);
        localStorage.setItem(
          "SelectedUser",
          JSON.stringify(response.data.user)
        );
        const socketInstance = io("http://localhost:5000", {
          query: { user_name: response.data.user.user_name },
        });

        setSocket(socketInstance);

        navigate("/chats");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign Up
        </h2>
        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={changeHandler}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="user_name"
              value={form.user_name}
              onChange={changeHandler}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Choose a unique username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={changeHandler}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Create a strong password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={form.gender}
              onChange={changeHandler}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
