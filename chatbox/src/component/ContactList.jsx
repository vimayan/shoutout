import React, { useContext, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemButton from "@mui/material/ListItemButton";

import IconButton from "@mui/material/IconButton";
import AddAlarmIcon from "@mui/icons-material/AddAlarm";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import CommentIcon from "@mui/icons-material/Comment";
import { green } from "@mui/material/colors";
import Icon from "@mui/material/Icon";
// import Typography from "@mui/material/Typography";
import GossipContext from "../context/gossipers/GossipContext";
import UserContext from "../context/user/UserContext";
import { Box } from "@mui/material";

export default function ContactList(props) {
  const gossipContext = useContext(GossipContext);

  const { chatbox, setChat, people, chatId } = gossipContext;

  useEffect(() => {
    if (people.length != 0 && chatId == null) {
      setChat(people[0].userid);
    }
  }, [people]);
  return (
    <Box>
      <List sx={{ bgcolor: "background.paper",marginTop:3 }}>
        {people.length != 0 ? (
          people.map((value, index) => (
            <React.Fragment key={value.userid}>
              <ListItem
                onClick={() => {
                  props.onItemClick();
                  setChat(value.userid);
                }}
                sx={
                  chatId == value.userid
                    ? {
                        alignItems: "flex-start",
                        backgroundColor: "blue",
                        color: "black",
                        cursor: "pointer",
                        borderRadius: "5px",
                      }
                    : {
                        alignItems: "flex-start",
                        cursor: "pointer",
                      }
                }
              >
                <ListItemAvatar>
                  <Avatar
                    alt={`${value.name.toUpperCase()}`}
                    src="/static/images/avatar/1.jpg"
                  />
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

                {/* <ListItemIcon
                  onClick={(event) => { event.stopPropagation(); createPeerConnection(value.userid)}}
                >
                  <AddCircleIcon sx={{ color: green[500] }} />
                </ListItemIcon> */}
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))
        ) : (
          <></>
        )}
      </List>
    </Box>
  );
}
