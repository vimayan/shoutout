import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Alert, Snackbar } from "@mui/material";
import { Link, Outlet } from "react-router-dom";
import axios from "axios";
import * as yup from "yup";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [register, setRegister] = useState(false);
  const [data, setData] = useState("");
  const [type, setType] = useState("success");
  const navigate = useNavigate();

  const registerformdata = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      firstname: yup.string().required("First_Name is required").min(3).max(16),
      lastname: yup.string().required("Last_Name is required").min(3).max(16),
      email: yup.string().required("Email is required").email(),
      password: yup
        .string()
        .min(8, "enter minimum 8 char")
        .required("Password is required"),
    }),
    onSubmit: (userdata) => {
      console.log(userdata);
      axios
        .post("https://shoutout-server.onrender.com/create-user", userdata)
        .then((response) => {
          setType("success");
          setRegister(true);
          setData(response.data);

          setTimeout(() => {
            navigate("/login");
          }, 4000);
        })
        .catch((err) => {
          setType("warning");
          setRegister(true);
          setData(`${err.response.data} login link sended to your mail`);
        });
    },
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setRegister(false);
  };

  return (
    <Box sx={{ height: "100vh", backgroundColor: "white" }}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            paddingTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            autoComplete="off"
            noValidate
            onSubmit={registerformdata.handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="firstname"
                  value={registerformdata.values.firstname}
                  onChange={registerformdata.handleChange}
                  required
                  fullWidth
                  id="firstname"
                  label="First Name"
                  autoFocus
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastname"
                  label="Last Name"
                  name="lastname"
                  value={registerformdata.values.lastname}
                  onChange={registerformdata.handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={registerformdata.values.email}
                  onChange={registerformdata.handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  value={registerformdata.values.password}
                  onChange={registerformdata.handleChange}
                  label="Password"
                  type="password"
                  id="password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/login">Already have an account? Sign in</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>

      {registerformdata.errors.firstname ? (
        <Alert
          sx={{
            float: "right",
            position: "absolute",
            top: "0px",
            right: "0px",
          }}
          severity="warning"
        >
          {registerformdata.errors.firstname}
        </Alert>
      ) : (
        <></>
      )}

      {registerformdata.errors.lastname ? (
        <Alert
          sx={{
            float: "right",
            position: "absolute",
            top: "50px",
            right: "0px",
          }}
          severity="warning"
        >
          {registerformdata.errors.lastname}
        </Alert>
      ) : (
        <></>
      )}

      {registerformdata.errors.email ? (
        <Alert
          sx={{
            float: "right",
            position: "absolute",
            top: "100px",
            right: "0px",
          }}
          severity="warning"
        >
          {registerformdata.errors.email}
        </Alert>
      ) : (
        <></>
      )}

      {registerformdata.errors.password ? (
        <Alert
          sx={{
            float: "right",
            position: "absolute",
            top: "150px",
            right: "0px",
          }}
          severity="warning"
        >
          {registerformdata.errors.password}
        </Alert>
      ) : (
        <></>
      )}

      <Snackbar
        open={register}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={handleClose}
      >
        <Alert severity={type} sx={{ width: "100%" }}>
          {data}
        </Alert>
      </Snackbar>

      <Outlet />
    </Box>
  );
}
