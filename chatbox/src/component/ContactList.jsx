import React, { useContext } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
// import Typography from "@mui/material/Typography";
import GossipContext from "../context/gossipers/GossipContext";

export default function ContactList(props) {
  const gossipContext = useContext(GossipContext);

  const { contacts,chatbox,setChat } = gossipContext;

  return (
    <List sx={{ bgcolor: "background.paper" }}>
      {contacts.map((value, index) => (
        <React.Fragment key={value.user_id}>
          <ListItem
            onClick={()=>{props.onItemClick();setChat(value.user_id)}}
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
                  {(chatbox[value.user_id] &&
                    chatbox[value.user_id].slice(-1)[0].text) ||
                    ""}
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </React.Fragment>
      ))}
    </List>
  );
}
