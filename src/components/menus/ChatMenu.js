import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { useEffect, useState } from "react";
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

    useEffect(() => {
        console.log("User data: ");
        console.log(userData);
    }, [userData]);

    useEffect(() => {
        console.log("Public chats: ");
        console.log(publicChats);
    }, [publicChats]);

    const handleUserName = (e) => {
        const { value } = e.target;
        setUserData({...userData, "username": value});
    }

    const registerUser = () => {
        const socket = new SockJS("http://localhost:8080/ws");
        stompClient = over(socket);
        stompClient.connect({}, onConnected, onError);
    }

    const onConnected = () => {
        setUserData({...userData, "connected": true});
        stompClient.subscribe("/chatroom/public", onMessageReceived);
        console.log("Connected");
    }

    const onMessageReceived = (payload) => {

        console.log("Payload received: " + payload);

        const message = JSON.parse(payload.body);
        publicChats.push(message);
        setPublicChats([...publicChats]);

        console.log(publicChats);
    }

    const onError = (error) => {
        console.log(error);
    }

    const MessagesBox = () => {

        return (
            <div className="chat-menu-messages-box">
                <ul>
                {
                    publicChats.map((chat, index) => {
                        return (
                            <li className="message" key={index}>
                                {
                                    chat.sender === userData.username && 
                                    <div className="avatar self">
                                        {chat.senderName}
                                    </div>
                                }
                                <div className="message-data">
                                    {chat.message}
                                </div>
                                {
                                    chat.sender !== userData.username && 
                                    <div className="avatar">
                                        {chat.senderName}
                                    </div>
                                }
                            </li>
                        );
                    })
                }
                </ul>
            </div>
        );
    }

    const SendBox = () => {

        const submit = (e) => {
            e.preventDefault();

            if (stompClient) {
                const chatMessage = {
                    senderName: userData.username,
                    message: userData.message,
                    status: "MESSAGE"
                };
                stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
                setUserData({...userData, "message": ""});
            }
        }

        const handleMessage = (e) => {
            const { value } = e.target;
            setUserData({...userData, "message": value});
        }

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
                />
                <Button type="submit">Send</Button>
            </form>
        );
    }

    return (
        <div className="chat-menu">
            <div className="chat-menu-title">
                <h1>Chat</h1>
            </div>

            <div className="chat-menu-content">
                <MessagesBox />
                <SendBox />
            </div>

            <Dialog
                open={modalNicknameOpen}
                onClose={() => setModalNicknameOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Enter your nickname
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    You will use this nickname to chat with other users.
                    <br />
                    <TextField
                        autoFocus
                        id="nickname"
                        label="Nickname"
                        type="text"
                        fullWidth
                        value={userData.username}
                        onChange={handleUserName}
                    />
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {window.location.href="/"; setModalNicknameOpen(false)}} autoFocus>Cancel</Button>
                    <Button onClick={() => {registerUser(); setModalNicknameOpen(false);}}>Proceed</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ChatMenu;