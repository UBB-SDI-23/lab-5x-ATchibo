import { Typography, TextField, FormControlLabel, Checkbox, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";

import './LoginMenu.scss';
import UserInfo from "../../domain/User/UserInfo";
import LoginRequests from "../../api/LoginRequests";
import Values from "../../Values";

const LoginMenu = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [authToken, setAuthToken] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        if (!UserInfo.isEmailValid(email) || !UserInfo.isPasswordValid(password)) {
            alert("Invalid email or password");
            return;
        }

        await LoginRequests.login(email, password)
            .then((response) => {
                setAuthToken(response.data.token);
                navigate(Values.homePageUrl);
            })
            .catch((error) => {
                alert("Login failed: " + error.response.data.message);
            }
        );
    };

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
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                />
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
                <p>
                <Link to="#">
                    Forgot password?
                </Link>
                </p>
                <p>
                <Link to="#">
                    {"Don't have an account? Sign Up"}
                </Link>
                </p>
            </div>
        </div>
    )
}

export default LoginMenu;