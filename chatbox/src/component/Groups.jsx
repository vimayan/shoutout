import React, { useContext } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import { Divider } from "@mui/material";
import GroupContext from "../context/groups/GroupContext";

export default function Groups(props) {
  const groupContext = useContext(GroupContext);

  const { groups, chatbox, setChat } = groupContext;

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {groups?.map((value, index) => (
        <>
          <ListItem
            key={index}
            onClick={() => {
              props.onItemClick();
              setChat(value.group_id);
            }}
            sx={{
              alignItems: "flex-start",
              cursor: "pointer",
            }}
          >
            <ListItemAvatar>
              <Avatar>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={`${value.name}`}
              secondary={
                (chatbox[value.user_id] &&
                  (chatbox[value.user_id].slice(-1)[0].html
                    ? "audio/video"
                    : chatbox[value.user_id].slice(-1)[0].text)) ||
                ""
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </>
      ))}
    </List>
  );
}
