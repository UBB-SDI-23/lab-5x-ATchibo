import React, { useState, useEffect, useRef } from "react";
import {
  Alert,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

import SockJsClient from 'react-stomp';

import "./ChatMenu.scss";
import Values from "../../Values";


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
  senderBox: {
    justifyContent: "flex-start",
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

const ChatMenu = () => {
  const classes = useStyles();
  const [modalNicknameOpen, setModalNicknameOpen] = useState(true);
  const [publicChats, setPublicChats] = useState([]);
  const [userName, setUserName] = useState("");
  const [userData, setUserData] = useState({
    username: "",
    message: "",
    connected: false,
  });

  const [clientRef, setClientRef] = useState(null);
  // let clientRef = null;

  const handleUserName = (e) => {
    const { value } = e.target;
    setUserName(value);
    // setUserData({ ...userData, username: value });
  };

  const handleMessageReceived = (payload) => {
    setPublicChats((prevChats) => [...prevChats, payload]);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (userName === "") {
      return;
    }

    setUserData({ ...userData, username: userName, connected: true });

    // clientRef.sendMessage("/app/chat.addUser",
        // JSON.stringify({sender: userName, type: 'JOIN'}));

    setModalNicknameOpen(false);
  };

  const MessagesBox = () => {

    const messagesRef = useRef(null);

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
          const isSelf = (chat.senderName === userData.username || chat.senderName === userName);

          if (isSelf) {
            return (
              <ListItem key={index} className={classes.senderBox}>
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

  const SendBox = () => {
    
    const submit = (e) => {

      e.preventDefault();
      if (userData.message === "") {
        return;
      }

      if (clientRef && userData.username) {
        const chatMessage = {
          senderName: userData.username === "" ? userName : userData.username,
          message: userData.message,
          type: "CHAT",
        };

        clientRef.sendMessage("/app/chat.sendMessage",
                JSON.stringify(chatMessage));
        
        setUserData({ ...userData, message: "" });
      }
    };

    const handleMessage = (e) => {
      const { value } = e.target;
      setUserData({ ...userData, message: value });
    };

    return (
      <form className="chat-menu-send-box" onSubmit={submit}>
        <TextField
          disabled={!userData.connected}
          autoFocus
          id="message"
          fullWidth
          maxRows={4}
          value={userData.message}
          onChange={handleMessage}
          variant="outlined"
          size="small"
          placeholder="Type a message..."
          className="send-box-input"
        />
        <Button disabled={!userData.connected} type="submit" className="send-box-button">
          Send
        </Button>
      </form>
    );
  };

  return (
    <div className="chat-menu">
      
      <SockJsClient url={Values.websocketUrl} topics={['/topic/public']}
        onMessage={(msg) => handleMessageReceived(msg)}
        ref={(client) => {
            setClientRef(client);
        }}
      />

      <div className="chat-menu-title">
        <h1>Chat</h1>
      </div>
      {modalNicknameOpen ? (
        <div className="nickname-div">
          <h2>Enter your nickname</h2>
          <p>You will use this nickname to chat with other users.</p>
          <form onSubmit={handleLogin}>
            <TextField
              autoFocus
              id="nickname"
              label="Nickname"
              type="text"
              fullWidth
              value={userName}
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

      <Snackbar open={!modalNicknameOpen && userData.connected === false}>
          <Alert severity="info">
              Connecting...
          </Alert>   
      </Snackbar>
    </div>
  );
};

export default ChatMenu;
