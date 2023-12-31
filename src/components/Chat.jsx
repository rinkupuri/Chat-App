import React, { useContext, useEffect } from "react";
import videoImg from "../images/video.png";
import userImg from "../images/add-users.png";
import settingImg from "../images/settings.png";
import "../App.scss";
import Input from "./Input";
import Messages from "./Messages";
import { ChatContext } from "../context/ChatContext";
import lock from "../images/padlock.png";
import chatPng from "../images/chat.png";

const Chat = ({ userData }) => {
  const { data } = useContext(ChatContext);
  const checkUser = JSON.stringify(data.user) == "{}";
  console.log(data.user);

  return (
    <div className="chat">
      {!checkUser && (
        <>
          <div className="chatInfo">
            <div className="userdetails">
              <img height={38} width={38} src={data.user.photoURL} alt="" />
              <span>{data.user?.displayName}</span>
            </div>
            <div className="chatIcon">
              <img height={24} src={videoImg} alt="" />
              <img height={20} src={userImg} alt="" />
              <img height={24} src={settingImg} alt="" />
            </div>
          </div>
          <Messages />
          <Input />
        </>
      )}
      {checkUser && (
        <>
          <div className="blankChat">
            <div className="logodiv">
              <img height={170} width={170} src={chatPng} alt="" />
              <span>Click any chat to view it here</span>
            </div>
            <div className="secureMessage">
              <img height={15} width={15} src={lock} alt="" />
              <span>You are Messaging in safe enviroment fell free to use</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;
