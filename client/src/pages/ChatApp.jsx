import { React, useContext } from "react";
import Friends from "../components/Otherusers";
import ChatSection from "../components/ChatSection";
import userContext from "../components/userContext";

const ChatApp = () => {
  const { SelectedRoom, setSelectedRoom } = useContext(userContext);
  return (
    <>
      <div className="bg-[#2E2F2F] text-white h-screen md:hidden p-6">
        {/* Mobile layout (below md) */}
        <div className=" md:hidden h-full">
          {!SelectedRoom && <Friends />}
          {SelectedRoom && <ChatSection />}
        </div>
      </div>
      <div className="bg-[#2E2F2F] text-white h-screen p-6 hidden md:flex ">
        <div className="  w-full md:w-fit">
          <Friends />
        </div>
        <div className="hidden md:flex-1  md:block ">
          <ChatSection />
        </div>
      </div>
    </>
  );
};

export default ChatApp;
