import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <div className="flex h-11 bg-[#46C556] text-white font-semibold items-center justify-between px-10 ">
        <h1>WhatsApp</h1>
        <div className="flex gap-10">
          <h1>
            <NavLink to="/signin">Login</NavLink>
          </h1>
          <h1>
            <NavLink to="/register">Signup</NavLink>
          </h1>
        </div>
      </div>
    </>
  );
};

export default Navbar;
