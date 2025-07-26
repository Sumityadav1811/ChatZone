import React from "react";
import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center relative">
      {/* Navbar */}
      <div className="absolute top-0 left-0 w-full px-6 py-4 flex justify-between items-center backdrop-blur-md bg-gray-900/70 border-b border-gray-700">
        <h1 className="text-white text-2xl font-bold">ChatZone</h1>
        <div className="space-x-6">
          <NavLink
            to="/signin"
            className="text-gray-300 font-medium hover:text-white transition"
          >
            Sign In
          </NavLink>
          <NavLink
            to="/register"
            className="text-gray-300 font-medium hover:text-white transition"
          >
            Sign Up
          </NavLink>
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center p-10 bg-gray-800/60 rounded-3xl backdrop-blur-md shadow-2xl max-w-2xl border border-gray-700">
        <h2 className="text-white text-4xl md:text-5xl font-extrabold mb-4">
          Welcome to ChatZone
        </h2>
        <p className="text-gray-300 text-lg mb-8">
          Your gateway to real-time, secure, and lightning-fast conversations.
        </p>
        <div className="space-x-4">
          <NavLink
            to="/signin"
            className="px-6 py-2 bg-gray-100 text-gray-900 font-semibold rounded-xl shadow hover:bg-gray-200 transition"
          >
            Sign In
          </NavLink>
          <NavLink
            to="/register"
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-xl shadow hover:bg-indigo-700 transition"
          >
            Sign Up
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Home;
