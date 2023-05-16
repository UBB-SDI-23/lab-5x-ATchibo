import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";

import "./ChatMenu.scss";

let stompClient = null;

const ChatMenu = () => {
  const [modalNicknameOpen, setModalNicknameOpen] = useState(true);
  const [publicChats, setPublicChats] = useState([]);
  const [userData, setUserData] = useState({
    username: "",
    message: "",
    connected: false
  });

  const handleUserName = (e) => {
    const { value } = e.target;
    setUserData({ ...userData, "username": value });
  };

  const registerUser = () => {
    const socket = new SockJS("http://localhost:8080/ws");
    stompClient = over(socket);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    setUserData({ ...userData, "connected": true });
    stompClient.subscribe("/chatroom/public", onMessageReceived);
    console.log("Connected");
  };

  const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);
    setPublicChats((prevChats) => [...prevChats, message]);
  };

  const onError = (error) => {
    console.log(error);
  };

  const MessagesBox = () => {
    return (
      <div className="chat-menu-messages-box">
        <ul>
          {publicChats.map((chat, index) => {
            const isSelf = chat.senderName === userData.username;
            const messageClass = isSelf ? "message self" : "message";
            const avatar = isSelf ? null : <div className="avatar">{chat.senderName}</div>;

            return (
              <li className={messageClass} key={index}>
                {avatar}
                <div className="message-data">{chat.message}</div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const SendBox = () => {
    const submit = (e) => {
      e.preventDefault();
      if (userData.message === "") {
        return;
      }

      if (stompClient) {
        const chatMessage = {
          senderName: userData.username,
          message: userData.message,
          status: "MESSAGE"
        };
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
        setUserData({ ...userData, "message": "" });
      }
    };

    const handleMessage = (e) => {
      const { value } = e.target;
      setUserData({ ...userData, "message": value });
    };

    return (
      <form className="chat-menu-send-box" onSubmit={submit}>
        <TextField
          autoFocus
          id="message"
          type="text"
          fullWidth
          maxRows={4}
          value={userData.message}
          onChange={handleMessage}
          variant="outlined"
          size="small"
          placeholder="Type a message..."
          className="send-box-input"
        />
        <Button type="submit" className="send-box-button">
          	Send
        </Button>
      </form>
    );
  };

  const setNickname = (e) => {
    e.preventDefault();

    if (userData.username === "") {
      return;
    }

    registerUser();
    setModalNicknameOpen(false);
  };

	return (
    	<div className="chat-menu">
			<div className="chat-menu-title">
				<h1>Chat</h1>
			</div>
			{
				modalNicknameOpen ? 
				(
					<div className="nickname-div">
					<h2>Enter your nickname</h2>
					<p>You will use this nickname to chat with other users.</p>
					<form onSubmit={setNickname}>
						<TextField
						autoFocus
						id="nickname"
						label="Nickname"
						type="text"
						fullWidth
						value={userData.username}
						onChange={handleUserName}
						variant="outlined"
						size="small"
						className="nickname-input"
						/>
						<br />
						<br />
						<Button type="submit">
							Set nickname
						</Button>
					</form>
					</div>
				) 
				: 
				(
					<div className="chat-menu-content">
						<MessagesBox />
						<SendBox />
					</div>
				)
			}
		</div>
	);
};

export default ChatMenu;