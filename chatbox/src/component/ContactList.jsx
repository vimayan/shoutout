import React, { useContext, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
// import Typography from "@mui/material/Typography";
import GossipContext from "../context/gossipers/GossipContext";
import UserContext from "../context/user/UserContext";
import { Box } from "@mui/material";


export default function ContactList(props) {

  const usercontext = useContext(UserContext);
  const { user } = usercontext;

  const gossipContext = useContext(GossipContext);

  const {chatbox, setChat,people } = gossipContext;

  return (
    <Box>
    <List sx={{ bgcolor: "background.paper" }}>
      {(user?.contacts)?user.contacts.map((value, index) => (
        <React.Fragment key={value._id}>
          <ListItem
            sx={{
              alignItems: "flex-start",
              cursor: "pointer",
            }}
          >
            <ListItemAvatar>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary={`${value.name}`}
              secondary={
                <React.Fragment>
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </React.Fragment>
      )):<></>}
    </List>
    <br />
    <Box>
      LIVE
    </Box>
    <List sx={{ bgcolor: "background.paper" }}>
    {people.length!=0?people.map((value, index) => (
      <React.Fragment key={value.userid}>
        <ListItem
          onClick={() => {
            props.onItemClick();
            setChat(value.userid);
          }}
          sx={{
            alignItems: "flex-start",
            cursor: "pointer",
          }}
        >
          <ListItemAvatar>
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </ListItemAvatar>
          <ListItemText
            primary={`${value.name}`}
            secondary={
              <React.Fragment>
                {(chatbox[value.userid] &&
                  (chatbox[value.userid].slice(-1)[0].html
                    ? "audio/video"
                    : chatbox[value.userid].slice(-1)[0].text)) ||
                  ""}
              </React.Fragment>
            }
          />
        </ListItem>
        <Divider variant="inset" component="li" />
      </React.Fragment>
    )):<></>}
  </List>
    </Box>
   
  );
}
