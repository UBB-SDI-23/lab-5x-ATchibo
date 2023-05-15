import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";

import "./ChatMenu.scss";

const ChatMenu = () => {

    const [modalNicknameOpen, setModalNicknameOpen] = useState(true);
    const [nickname, setNickname] = useState("");

    const [message, setMessage] = useState("");

    const MessagesBox = () => {

        return (
            <div className="chat-menu-messages-box">
                <h1>Messaging</h1>
            </div>
        );
    }

    const SendBox = () => {

        const submit = (e: any) => {
            e.preventDefault();
            console.log("Message: " + message);
        }

        return (
            <form className="chat-menu-send-box" onSubmit={submit}>
                <TextField
                    autoFocus
                    id="message"
                    type="text"
                    fullWidth
                    maxRows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
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
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {setNickname(""); setModalNicknameOpen(false)}} autoFocus>Cancel</Button>
                    <Button onClick={() => setModalNicknameOpen(false)}>Proceed</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ChatMenu;