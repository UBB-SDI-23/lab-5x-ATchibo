import { Typography, TextField, FormControlLabel, Checkbox, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import { useContext, useEffect, useState } from "react";

import './LoginMenu.scss';
import UserInfo from "../../domain/User/UserInfo";
import LoginRequests from "../../api/LoginRequests";
import Values from "../../Values";
import LocalStorageManager from "../../helpers/LocalStorageManager";
import { UserContext } from "../../helpers/UserContext";
import UserDTO from "../../domain/User/UserDTO";

const LoginMenu = () => {

    const { setUser } = useContext(UserContext);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        if (!UserInfo.isUsernameValid(username) || !UserInfo.isPasswordValid(password)) {
            alert("Invalid username or password");
            return;
        }

        await LoginRequests.login(username, password)
            .then((response) => {
                setUser(new UserDTO(response.data));
                LocalStorageManager.setAuthToken(response.data.token);
                navigate(Values.homePageUrl);
            })
            .catch((err: any) => {
                if (err.response) {
                    alert("Login failed: " + err.response.data.message + " " + err.response.status);
                } else {
                    alert("Error: " + err.message);
                }
            }
        );
    };

    useEffect(() => {
        LocalStorageManager.removeAuthToken();
    }, []);

    return (
        <div id="main-div">
            <div id="form-div">
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form className="form" onSubmit={handleSubmit}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {/* <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                /> */}
                <Button
                    type="submit"
                    fullWidth
                    className="submit"
                >
                    Sign In
                </Button>
                </form>
            </div>
            <div id="link-div">
                <p>OR</p>
                <Button
                    fullWidth
                >
                    Sign in as Guest
                </Button>
                <p>
                <Link to="#">
                    Forgot password?
                </Link>
                </p>
                <p>
                <Link to={Values.registerPageUrl}>
                    "Don't have an account? Sign Up"
                </Link>
                </p>
            </div>
        </div>
    )
}

export default LoginMenu;