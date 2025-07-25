import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateGroup = ({ currentUser, setcreategroup }) => {
  const [groupName, setGroupName] = useState("");
  const [users, setUsers] = useState([]); // List of all users
  const [selectedUsers, setSelectedUsers] = useState([]);
  const API = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("fetching users in create group");
        const res = await axios.post(`${API}/api/users/getusers`, {
          id: currentUser._id,
        });
        setUsers(res.data.data);
        console.log("users fetched are ", res.data.data);
      } catch (err) {
        console.error("Failed to fetch users", err.message);
      }
    };
    fetchUsers();
  }, [currentUser]);

  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName || selectedUsers.length < 1) {
      alert("Enter group name and select at least 1 user");
      return;
    }

    try {
      const res = await axios.post(`${API}/api/rooms/createroom`, {
        name: groupName,
        userIds: [...selectedUsers, currentUser._id], // include self
      });

      alert("Group Created!");
      setcreategroup((prev) => !prev);
      setGroupName("");
      setSelectedUsers([]);
    } catch (err) {
      console.error("Group creation failed", err);
      alert("Error creating group");
    }
  };

  return (
    <div className="absolute top-5 left-5 border-2 border-black text-white bg-[#2E2F2F] p-3">
      <h2>Create New Group</h2>
      <h2>All users</h2>
      <input
        type="text"
        placeholder="Group Name"
        value={groupName}
        className="bg-slate-800 text-white px-2"
        onChange={(e) => setGroupName(e.target.value)}
      />

      <div>
        {users.map((user) => (
          <div key={user._id}>
            <label className="flex justify-between px-5 text-xl">
              <h1>{user.user_name}</h1>
              <input
                type="checkbox"
                checked={selectedUsers.includes(user._id)}
                onChange={() => handleCheckboxChange(user._id)}
              />
            </label>
          </div>
        ))}
      </div>

      <button
        onClick={handleCreateGroup}
        className="bg-green-500 text-white border px-3 py-1 rounded-md mt-2"
      >
        Create Group
      </button>
    </div>
  );
};

export default CreateGroup;
