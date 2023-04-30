import { LoginHeader } from "../components/headers/LoginHeader"
import LoginMenu from "../components/menus/LoginMenu"

const LoginPage = () => {

    return (
        <>
            <LoginHeader />
            <LoginMenu />
        </>
    )
}

export default LoginPage;

// import { Avatar, Box, Button, Checkbox, FormControlLabel, Grid, Link, TextField, Typography } from "@mui/material";
// import React, { useState } from "react";

// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';


// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = (event: any) => {
//     event.preventDefault();
//     // handle login logic here
//   };

//   return (
//     <Grid container>
//       <Grid item xs={12} sm={8} md={5}>
//         <Box m={4}>
//           <div className="paper">
//             <Avatar className="avatar">
//               <LockOutlinedIcon />
//             </Avatar>
//             <Typography component="h1" variant="h5">
//               Sign in
//             </Typography>
//             <form className="form" onSubmit={handleSubmit}>
//               <TextField
//                 variant="outlined"
//                 margin="normal"
//                 required
//                 fullWidth
//                 id="email"
//                 label="Email Address"
//                 name="email"
//                 autoComplete="email"
//                 autoFocus
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//               <TextField
//                 variant="outlined"
//                 margin="normal"
//                 required
//                 fullWidth
//                 name="password"
//                 label="Password"
//                 type="password"
//                 id="password"
//                 autoComplete="current-password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               <FormControlLabel
//                 control={<Checkbox value="remember" color="primary" />}
//                 label="Remember me"
//               />
//               <Button
//                 type="submit"
//                 fullWidth
//                 variant="contained"
//                 color="primary"
//                 className="submit"
//               >
//                 Sign In
//               </Button>
//               <Grid container>
//                 <Grid item xs>
//                   <Link href="#" variant="body2">
//                     Forgot password?
//                   </Link>
//                 </Grid>
//                 <Grid item>
//                   <Link href="#" variant="body2">
//                     {"Don't have an account? Sign Up"}
//                   </Link>
//                 </Grid>
//               </Grid>
//             </form>
//           </div>
//         </Box>
//       </Grid>
//     </Grid>
//   );
// }
