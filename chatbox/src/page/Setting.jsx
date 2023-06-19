import {
  // Skeleton,
  Box,
  Grid,
  Card,
  // CardContent,
  // Typography,
  CardMedia,
  Button,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import NavBar from "../components/navbar";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";
import Profile from "../data/profile.webp";
import UserContext from "../context/user/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios"

function Setting() {
  const usercontext = useContext(UserContext);
  const { user, getUser, updateUser } = usercontext;
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const [requestPssword, setRequestPssword] = useState(false);
  const [data,setData] = useState('')
  const [type,setType] = useState('success')

  
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setRequestPssword(false);
  };

  useEffect(() => {
    token && username ? <></> : navigate("/login");
  }, [token,username,navigate]);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLasttname] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [reload,setReload]=useState(false)

  useEffect(() => {
    if (!user._id) {
      getUser();
    }
    setFirstname(user.firstname);
    setLasttname(user.lastname);
    setPassword(user.password);
    setEmail(user.email);
  }, [getUser,user]);

  const handleUpdate = () => {
    const userdata = {
      firstname: firstname,
      lastname: lastname,
    };
    updateUser(userdata, username, token);
    setReload(true)
    
  };
useEffect(()=>{
 
  if(reload){
    const username = localStorage.getItem("username");
    navigate(`/${username}/settings`);
  }
  setReload(false)

},[updateUser,reload])
  const requestLink=()=>{
    axios.post("https://fitness-logger.onrender.com/request-password", {email:email})
               .then((response)=>{
                setType("success")
                setData(response.data)
                setRequestPssword(true)
              })
               .catch((error) => {
                console.log(error);
            if (error.response.data.details) {
              setType("warning")
              setData(error.response.data.details[0].message);
              setRequestPssword(true)}
        else if (error.response){ 
          setType("warning");
          setData(error.response.data);
          setRequestPssword(true)
        }
      });
  }

  return (
    <>
      <div className="container py-3">
        <div className="row text-white fs-4 mb-3">
          <div className="col">
            <NavBar panel={"SETTING"} />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <Card sx={{ display: "flex" }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Box
                  component="form"
                  autoComplete="off"
                  noValidate
                  sx={{ m: 3 }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="firstname"
                        required
                        fullWidth
                        id="firstname"
                        label="First Name"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        id="lastname"
                        label="Last Name"
                        name="lastname"
                        value={lastname}
                        onChange={(e) => setLasttname(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        InputProps={{
                          readOnly: true,
                        }}
                        value={email}
                      />
                    </Grid>
                    <Grid item xs={12} display="flex" >
                      <Stack direction="row" spacing={2} my={1}>
                        <TextField
                          required
                          fullWidth
                          name="password"
                          label="Password"
                          type="password"
                          id="password"
                          value={password}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                        <Button variant="contained" endIcon={<SendIcon />} onClick={requestLink}>
                          link
                        </Button>
                      </Stack>
                    </Grid>
                    <Button
                  
                      variant="contained"
                      color="success"
                      onClick={handleUpdate}
                      sx={{mx:2}}
                    
                    >
                      save changes
                    </Button>
                  </Grid>
                </Box>
              </Box>
              <CardMedia
                component="img"
                sx={{ height: "70vh" }}
                image={Profile}
                alt="Live from space album cover"
              />
            </Card>
          </div>
 
        </div>
      </div>
      <Snackbar open={requestPssword} autoHideDuration={4000}  anchorOrigin={{ vertical:"top", horizontal:"right" }}  onClose={handleClose}>
        <Alert severity={type} sx={{ width: "100%" }} >
          {data}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Setting;
