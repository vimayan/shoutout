import React, { useContext, useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link, Outlet } from "react-router-dom";
// import axios from "axios";
import * as yup from "yup";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";
import UserContext from "../context/user/userContext";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function Login() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(true);

  const usercontext = useContext(UserContext);
  const { login, error, user } = usercontext;

  const [enter, setEnter] = useState(false);
  const [data,setData] = useState('')
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    token && username ? navigate(`/${username}`) : <></>;
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (token) navigate(`/${username}`);

    if (error.data) {
     
      if(error.data.details)
     {
      setData(error.data.details[0].message);
  
      setEnter(true)

    }
     else{setData(error.data);
   
      setEnter(true);
    }
  }

  
  }, [login, user]);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setEnter(false);
  };

  const loginformdata = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup.string().required("Email is required").email(),
      password: yup
        .string()
        .min(8, "enter minimum 8 char")
        .required("Password is required"),
    }),
    onSubmit: (userdata) => {
      login(userdata);
    },
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <Grid container component="main" sx={{ height: "100vh" }}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: "url(https://picsum.photos/1200/800)",
              backgroundRepeat: "no-repeat",
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={loginformdata.handleSubmit}
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={loginformdata.values.email}
                  onChange={loginformdata.handleChange}
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={loginformdata.values.password}
                  onChange={loginformdata.handleChange}
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={checked} onChange={handleChange} />
                  }
                  label="Remember me"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link to="/forgetpassword">Forgot password?</Link>
                  </Grid>
                  <Grid item>
                    <Link to="/register">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
                <Copyright sx={{ mt: 5 }} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
      {loginformdata.errors.email ? (
        <Alert
          severity="warning"
          sx={{
            float: "right",
            position: "absolute",
            top: "0px",
            right: "0px",
          }}
        >
          {loginformdata.errors.email}
        </Alert>
      ) : (
        <></>
      )}
      {loginformdata.errors.password ? (
        <Alert
          severity="warning"
          sx={{
            float: "right",
            position: "absolute",
            top: "50px",
            right: "0px",
          }}
        >
          {loginformdata.errors.password}
        </Alert>
      ) : (
        <></>
      )}
 <Snackbar open={enter} autoHideDuration={2000}  anchorOrigin={{ vertical:"top", horizontal:"right" }}  onClose={handleClose}>
        <Alert severity="warning" sx={{ width: "100%" }} >
          {data}
        </Alert>
      </Snackbar>


      <Outlet />
    </>
  );
}
