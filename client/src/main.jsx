import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import userContext from "./components/userContext.jsx";

const Root = () => {
  const [SelectedUser, setSelectedUser] = useState(null);
  const [SelectedRoom, setSelectedRoom] = useState(null);
  const [socket, setSocket] = useState(null);

  return (
    <userContext.Provider
      value={{
        SelectedUser,
        setSelectedUser,
        SelectedRoom,
        setSelectedRoom,
        socket,
        setSocket,
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </userContext.Provider>
  );
};

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
