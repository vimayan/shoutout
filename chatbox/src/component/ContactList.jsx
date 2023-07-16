import React, { useContext } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import GossipContext from "../context/gossipers/GossipContext";

export default function ContactList(props) {

  const gossipContext = useContext(GossipContext);

  const { contacts, chatbox, message, files } = gossipContext;

  return (
    <List sx={{ bgcolor: "background.paper" }}>
      {contacts.map((value, index) => (
        <React.Fragment key={value}>
          <ListItem
            key={index}
            onClick={props.onItemClick}
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
                  {/* <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                   {value.lastChat[0].text||''}
                  </Typography> */}
                  {value.lastChat.slice(-1)[0].text||''}
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
