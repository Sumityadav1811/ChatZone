import React from "react";
import Friends from "../components/Otherusers";
import ChatSection from "../components/ChatSection";

const ChatApp = () => {
  return (
    <div className="bg-[#2E2F2F] text-white min-h-screen max-h-screen flex">
      <div className=" p-6 ">
        <Friends />
      </div>
      <div className="flex-1 pt-6">
        <ChatSection />
      </div>
    </div>
  );
};

export default ChatApp;
