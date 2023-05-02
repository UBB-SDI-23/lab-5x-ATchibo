import { Typography, TextField, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Values from '../../Values';
import './RegisterMenu.scss';
import { useState } from 'react';
import UserInfo from '../../domain/User/UserInfo';
import RegisterRequests from '../../api/RegisterRequests';
import SignUpDto from '../../domain/User/SignUpDto';

const RegisterMenu = () => {

    const roles = ["Admin", "Employee", "Customer"];
    
    const menuItems = roles.map((role, index) => {
        return <MenuItem key={index} value={"ROLE_" + role.toUpperCase()}>{role}</MenuItem>
    });

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [secondName, setSecondName] = useState("");
    const [homecity, setHomecity] = useState("");
    const [role, setRole] = useState('');

    const handleRoleChange = (event: any) => {
        setRole(event.target.value as string);
    };


    const handleSubmit = async (event: any) => {
        event.preventDefault();

        if (!UserInfo.isUsernameValid(username) || !UserInfo.isPasswordValid(password) || !UserInfo.isEmailValid(email)) {
            alert("Invalid username or password or email");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        await RegisterRequests.register(
                new SignUpDto(
                    firstName,
                    secondName,
                    email,
                    username,
                    role,
                    homecity,
                    password
                )
            )
            .then((response) => {
                    alert("Registration successful! To activate your account, please access this link: " + 
                            Values.siteUrl + "/" + Values.activateAccountUrl + "/" + response.data.token);
                    navigate(Values.siteUrl + "/" + Values.activateAccountUrl + "/" + response.data.token);
                }
            )
            .catch((error) => {
                    alert("Registration failed: " + error.response.data.message);
                }
            );
    };


    return (
        <div id="main-div">
            <div id="form-div">
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <form className="form">
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
                    id="password"
                    label="Password"
                    name="password"
                    autoComplete="password"
                    autoFocus
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={UserInfo.isPasswordValid(password) ? false : true}
                    helperText={UserInfo.isPasswordValid(password) ? "" : "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number"}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="confirm-password"
                    label="Confirm password"
                    name="confirm-password"
                    autoComplete="confirm-password"
                    autoFocus
                    type='password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={password === confirmPassword ? false : true}
                    helperText={password === confirmPassword ? "" : "Passwords do not match"}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="E-mail"
                    name="email"
                    autoComplete="email"
                    type='email'
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={UserInfo.isEmailValid(email) ? false : true}
                    helperText={UserInfo.isEmailValid(email) ? "" : "Invalid email"}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="first-name"
                    label="First name"
                    name="first-name"
                    autoComplete="first-name"
                    autoFocus
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="last-name"
                    label="Last name"
                    name="last-name"
                    autoComplete="last-name"
                    autoFocus
                    value={secondName}
                    onChange={(e) => setSecondName(e.target.value)}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="homecity"
                    label="Home city"
                    name="homecity"
                    autoComplete="homecity"
                    autoFocus
                    value={homecity}
                    onChange={(e) => setHomecity(e.target.value)}
                />
                <FormControl 
                    fullWidth
                    margin='normal'
                >
                    <InputLabel id="select-label">Select role</InputLabel>
                    <Select
                        value={role}
                        onChange={handleRoleChange}
                        required
                        id="role"
                        label="select-label"
                        labelId="select-label"
                        name="role"
                        autoFocus
                    >
                        {menuItems}
                    </Select>
                </FormControl>
                <Button
                    type="submit"
                    fullWidth
                    className="submit"
                    onClick={handleSubmit}
                >
                    Sign Up
                </Button>
                </form>
            </div>
            <div id="link-div">
                <p>
                <Link to={Values.loginPageUrl}>
                    "Already have an account? Sign In"
                </Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterMenu;