import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

// @ts-ignore
import { over } from "stompjs";
// @ts-ignore
import SockJS from "sockjs-client";

import "./ChatMenu.scss";
import Values from "../../Values";

let stompClient: any = null;

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: "100%",
    height: "80vh",
  },
  headBG: {
    backgroundColor: "#e0e0e0",
  },
  borderRight500: {
    borderRight: "1px solid #e0e0e0",
  },
  messageArea: {
    height: "70vh",
    overflowY: "auto",
  },
  senderName: {
    fontWeight: "bold",
    fontSize: "1.2rem",
    color: "#81e695",
  },
  senderBoxContent: {
    backgroundColor: "#0f7d4d",
    color: "#fff",
    padding: "0.5rem",
    borderRadius: "0.5rem",
    maxWidth: "70%",
    overflowWrap: "break-word",
  },
  receiverBox: {
    justifyContent: "flex-end",
  },
  receiverBoxContent: {
    backgroundColor: "#292e2a",
    color: "#fff",
    width: "fit-content",
    padding: "0.5rem",
    borderRadius: "0.5rem",
    maxWidth: "70%",
    overflowWrap: "break-word",
  },
});

const ChatMenu: React.FC = () => {
  const classes = useStyles();
  const [modalNicknameOpen, setModalNicknameOpen] = useState(true);
  const [publicChats, setPublicChats] = useState<any[]>([]);
  const [userData, setUserData] = useState({
    username: "",
    message: "",
    connected: false,
  });

  const handleUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUserData({ ...userData, username: value });
  };

  const registerUser = () => {
    const socket = new SockJS(Values.websocketUrl);
    stompClient = over(socket);
    stompClient.connect({withCredentials: false}, onConnected, onError);
  };

  const onConnected = () => {
    setUserData({ ...userData, connected: true });
    stompClient.subscribe("/chatroom/public", onMessageReceived);
    console.log("Connected");
  };

  const onMessageReceived = (payload: any) => {
    const message = JSON.parse(payload.body);
    setPublicChats((prevChats) => [...prevChats, message]);
  };

  const onError = (error: any) => {
    console.log(error);
  };

  
  const MessagesBox: React.FC = () => {

    const messagesRef = useRef<HTMLUListElement | null>(null);

    useEffect(() => {
      // Scroll to the bottom of the message box when a new message is received
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [publicChats]);

    return (
      <List className={classes.messageArea} ref={messagesRef}>
        {publicChats.map((chat, index) => {
          const isSelf = chat.senderName === userData.username;

          if (isSelf) {
            return (
              <ListItem key={index} className="senderBox">
                <Grid
                  container
                  width="fit-content"
                  className={classes.senderBoxContent}
                >
                  <Grid item xs={12}>
                    <ListItemText primary={chat.message} />
                  </Grid>
                </Grid>
              </ListItem>
            );
          } else {
            return (
              <ListItem key={index} className={classes.receiverBox}>
                <Grid
                  container
                  width="fit-content"
                  className={classes.receiverBoxContent}
                >
                  <Grid item xs={12}>
                    <ListItemText
                      primary={chat.senderName}
                      className={classes.senderName}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <ListItemText primary={chat.message} />
                  </Grid>
                </Grid>
              </ListItem>
            );
          }
        })}
      </List>
    );
  };

  const SendBox: React.FC = () => {
    const submit = (e: React.FormEvent) => {
      e.preventDefault();
      if (userData.message === "") {
        return;
      }
      if (stompClient) {
        const chatMessage = {
          senderName: userData.username,
          message: userData.message,
          status: "MESSAGE",
        };
        stompClient.send("/app/message", {withCredentials: false}, JSON.stringify(chatMessage));
        setUserData({ ...userData, message: "" });
      }
    };

    const handleMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setUserData({ ...userData, message: value });
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

  const setNickname = (e: React.FormEvent) => {
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
      {modalNicknameOpen ? (
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
            <Button type="submit">Set nickname</Button>
          </form>
        </div>
      ) : (
        <div className="chat-menu-content">
          <MessagesBox />
          <SendBox />
        </div>
      )}
    </div>
  );
};

export default ChatMenu;
