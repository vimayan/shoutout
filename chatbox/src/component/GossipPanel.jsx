import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AdbIcon from "@mui/icons-material/Adb";
import {
  styled,
  alpha,
  ThemeProvider,
  createTheme,
} from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Button from "./Button";
import { Avatar } from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import SettingsIcon from "@mui/icons-material/Settings";
import { Link, Outlet } from "react-router-dom";
import UserContext from "../context/user/UserContext";
import GossipContext from "../context/gossipers/GossipContext";
import { useNavigate } from "react-router-dom";
import ShoutContext from "../context/shouts/ShoutContext";

const drawerWidth = 310;

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2",
    },
  },
});

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "15ch",
    },
    [theme.breakpoints.up("md")]: {
      width: "25ch",
    },
  },
}));

function ResponsiveDrawer(props) {
  const navigate = useNavigate();
  
  const usercontext = React.useContext(UserContext);
  const {socket,user,getUser,setCircle,people_circle,
    getUserUpdate,
    handleOffer,
    handleRemoteAnswer,
    createPeerConnection,
    peerConnection, } = usercontext;


  const gossipContext = React.useContext(GossipContext);

  const {people,store_connects,store_reconnects,setChat,recieve_message} = gossipContext;

  const shoutcontext = React.useContext(ShoutContext);
  const { getShout,addLike } = shoutcontext;

  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  React.useEffect(() => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
   ( token && username)?getUser():navigate(`/${username}`);
   
  }, []);
  

  React.useEffect(() => {
    if(people?.length!=0){setChat(people[0].userid)}
  }, [socket]);

  React.useEffect(()=>{
    if(socket){

      socket.on('restore',(contact)=>{
        store_reconnects(contact)
      })

      socket.on('store',(contact)=>{
        store_connects(contact);
      });
   
      socket.on('gossips',(data,sender_id)=>{
        console.log('gossips');
        recieve_message(data,sender_id)
      })

      socket.on('new_connection', (newuser)=>{
        console.log(newuser);
        if(newuser.userid!=user._id){
          if(people_circle.length<30){
            setCircle(newuser);
            const user_data = {
              name: user["firstname"],
              userid: user["_id"],
              socket_id: socket.id,
            };
            socket.emit('give_connection',newuser.socket_id,user_data);
          }       
        }
      
      });
      socket.on('set_connection',(newuser)=>{
        console.log('set_connection',newuser);
        setCircle(newuser);
      });

      socket.on('getuser',()=>{
        console.log('getUserUpdate');
        getUserUpdate();
      })
      
    }
   
  },[socket])
  React.useEffect(()=>{
    if(socket){ 

      socket.on('add_like',(id)=>{
        console.log('add_like');
        addLike(id)
      })
      
    }
   
  },[socket])

  React.useEffect(() => {
    console.log('shoutlists');
    getShout();
  }, []);
 


  const drawer = (
    <div>
      <Toolbar sx={{ display: "flex", flexDirection: "row", gap: 4 }}>
        <Avatar
          alt="Remy Sharp"
          sx={{ bgcolor: deepOrange[500], width: 56, height: 56, my: 2 }}
        />{" "}
        <Typography display={"flex"} textAlign={"start"}>
         {user.firstname} {user.email}
        </Typography>
        <Link to={`/${user.firstname}/setting`} className="text-decoration-none text-light">
          <SettingsIcon sx={{ alignSelf: "bottom" }} />
        </Link>
      </Toolbar>
      <Divider />
      <List>
        {[
          { text: "Shouts", path: "" },
          { text: "Recent Shouts", path: "recentshouts" },
        ].map((Item, index) => (
          <ListItem key={Item.text} disablePadding>
            <Link
              to={`/${user.firstname}/${Item.path}`}
              className="text-decoration-none text-light"
            >
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={Item.text} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {[
          { text: "Connections", path: "connections" },
          { text: "Gossips", path: "gossipers" },
          { text: "Group Gossips", path: "groups" },
        ].map((Items, index) => (
          <ListItem key={Items.text} disablePadding>
            <Link
              to={`/${user['firstname']}/${Items.path}`}
              className="text-decoration-none text-light"
            >
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={Items.text} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <ThemeProvider theme={darkTheme}>
      <Box display="flex">
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { lg: `calc(100% - ${drawerWidth}px)` },
            mr: { lg: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            <AdbIcon sx={{ display: { xs: "flex" }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              // href=""
              sx={{
                mr: 2,
                display: { xs: "flex" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              SHOUTOUT
            </Typography>
            <Box display={"flex"} gap={2}>
              <Box display={{ xs: "none", whiteSpace: "nowrap", sm: "flex" }}>
                <button className="btn btn-success"  onClick={getShout} >New Shouts</button>
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ "aria-label": "search" }}
                  />
                </Search>
              </Box>

              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ display: { lg: "none" } }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
          <Box
            mx={1}
            display={{ xs: "flex", whiteSpace: "nowrap", sm: "none" }}
            gap={1}
          >
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
           <button className="btn btn-success"  onClick={getShout} >New Shouts</button>
          </Box>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          <Drawer
            container={container}
            anchor="right"
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", lg: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            anchor="right"
            sx={{
              display: { xs: "none", lg: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
      </Box>
      <Outlet />
    </ThemeProvider>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};


export default ResponsiveDrawer;
