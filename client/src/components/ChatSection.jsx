import React, { useState, useContext, useEffect } from "react";
import userContext from "./userContext";
import axios from "axios";
import img from "../assets/bg.png";

const ChatSection = () => {
  const API = import.meta.env.VITE_API_BASE_URL;
  const [input, setinput] = useState("");
  const [messages, setMessages] = useState([]);
  const { SelectedRoom, SelectedUser, socket } = useContext(userContext);

  const fetchchats = async () => {
    try {
      const isGroup = !("user_name" in SelectedRoom);
      console.log("chats is fetching for", SelectedRoom.name);
      const data = isGroup
        ? {
            roomid: SelectedRoom._id,
          }
        : {
            sender: SelectedUser._id,
            receiver: SelectedRoom._id,
          };
      const response = await axios.post(`${API}/api/messages/getchats`, data);
      setMessages(response.data.messages);
      console.log(response.data.messages);
    } catch (error) {
      console.log("Error in fetching chats");
    }
  };

  useEffect(() => {
    if (!socket || !SelectedRoom) return;

    const isGroup = !("user_name" in SelectedRoom);
    const roomId = isGroup
      ? SelectedRoom._id
      : [SelectedUser._id, SelectedRoom._id].sort().join("_");

    if (isGroup) {
      socket.emit("join_group", roomId);
    } else {
      socket.emit("join_private", roomId);
    }

    const handleMessage = (message) => {
      // Only update messages if this message belongs to current room
      if (
        (isGroup && message.roomId === roomId) ||
        (!isGroup && message.roomId === roomId)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("receive_message", handleMessage);

    return () => {
      socket.off("receive_message", handleMessage);
    };
  }, [socket, SelectedRoom]);

  const SendMessage = async () => {
    try {
      const isGroup = !("user_name" in SelectedRoom);
      const data = isGroup
        ? {
            content: input,
            sender: SelectedUser._id,
            roomid: SelectedRoom._id,
          }
        : {
            content: input,
            sender: SelectedUser._id,
            receiver: SelectedRoom._id,
          };
      if (input.trim()) {
        const response = await axios.post(`${API}/api/messages/send`, data);
        const roomId = [SelectedUser._id, SelectedRoom._id].sort().join("_");

        isGroup
          ? socket.emit("send_group_message", {
              roomId: SelectedRoom._id,
              message: {
                sender: SelectedUser._id,
                content: input,
                time: new Date(),
              },
            })
          : socket.emit("send_private_message", {
              roomId: roomId,
              message: {
                sender: SelectedUser._id,
                content: input,
                time: new Date(),
              },
            });

        if (response.data.success) {
          setinput("");
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    fetchchats();
  }, [SelectedRoom]);

  return SelectedRoom == null ? (
    <div className="flex justify-center items-center h-full">
      <div>
        <p>
          <strong>No Room Selected</strong>
        </p>
        <p>Select a group from the sidebar to start chatting!</p>
      </div>
    </div>
  ) : (
    <div className="flex flex-col justify-between h-full">
      <div className="flex px-5 gap-10 items-center py-3 pt-0">
        <div>
          <img
            src="https://avatar.iran.liara.run/public/boy "
            className="h-14 w-14"
          />
        </div>
        <div>{SelectedRoom.name}</div>
      </div>
      {!SelectedUser || !SelectedRoom || !socket ? (
        <div>
          Loading chat...
          {SelectedUser.name} ,{SelectedRoom.name} ,
        </div>
      ) : (
        <div
          className="flex-1 overflow-y-auto p-2"
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {messages.length == 0 ? (
            <h1>No Messages</h1>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`px-3 py-3 w-fit rounded-lg m-3
                ${
                  message.sender == SelectedUser._id
                    ? "text-right bg-green-700 ml-auto "
                    : "text-left text-white bg-black "
                }`}
              >
                {message.content}
              </div>
            ))
          )}
        </div>
      )}
      <div className=" flex px-6 w-full py-3">
        <input
          type="text"
          className="bg-[#2E2F2F] text-gray-500 w-full focus:outline-none"
          placeholder="Type a message"
          value={input}
          onChange={(e) => {
            setinput(e.target.value);
          }}
        />
        <button onClick={SendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatSection;
