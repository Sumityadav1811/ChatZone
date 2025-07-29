import React from "react";

import { useState, useEffect, useContext } from "react";
import userContext from "./userContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CreateGroup from "./CreateGroup";

const Friends = () => {
  const API = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const { SelectedUser, setSelectedUser, socket, setSocket, setSelectedRoom } =
    useContext(userContext);
  const [creategroup, setcreategroup] = useState(false);
  const [otherusers, setotherusers] = useState([]);
  const [Groups, setGroups] = useState([]);

  const logoutHandler = () => {
    console.log("clicked logout");
    localStorage.removeItem("SelectedUser");
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    setSelectedUser(null);
    setSelectedRoom(null);
    setGroups(null);
    navigate("/signin");
  };

  const fetchOtherUsers = async (e) => {
    try {
      const response = await axios.post(`${API}/api/users/getusers/`, {
        id: SelectedUser._id,
      });
      setotherusers(response.data.data);
      console.log(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  const fetchOtherGroups = async (e) => {
    try {
      const res = await axios.get(
        `${API}/api/rooms/getrooms/${SelectedUser._id}`
      );
      console.log("Groups fetched Successfully");
      setGroups(res.data.groups);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    if (SelectedUser?._id) {
      fetchOtherUsers();
      fetchOtherGroups();
    }
  }, [SelectedUser]);
  return (
    <div className="flex flex-col justify-between h-full pr-4">
      <div>
        <h1 className=" text-2xl font-semibold">Chats</h1>
      </div>

      <div>
        <input
          type="text"
          placeholder="Search for a Chat "
          className="bg-[#4c4e4e] rounded-md px-3 h-8 my-3"
        />
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <div>
          {Groups.map((user) => (
            <div
              className="flex gap-6 items-center mb-4"
              onClick={() => {
                setSelectedRoom(user);
              }}
            >
              <div>
                <img
                  src="https://avatar.iran.liara.run/public/girl"
                  className="h-16 w-16"
                />
              </div>
              <div>{user.name}</div>
            </div>
          ))}
        </div>
        <div>
          {otherusers.map((user) => (
            <div
              className="flex gap-6 items-center mb-4"
              onClick={() => {
                setSelectedRoom(user);
              }}
            >
              <div>
                <img
                  src="https://avatar.iran.liara.run/public/boy"
                  className="h-16 w-16"
                />
              </div>
              <div>{user.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 margin-auto">
        <button
          onClick={logoutHandler}
          className=" text-red-600  rounded-lg bg-[#494a4a] px-3 py-2"
        >
          Logout
        </button>
        <button
          onClick={() => {
            setcreategroup((prev) => !prev);
          }}
        >
          Create Group
        </button>
      </div>
      {creategroup && (
        <CreateGroup
          currentUser={SelectedUser}
          setcreategroup={setcreategroup}
        />
      )}
    </div>
  );
};

export default Friends;
