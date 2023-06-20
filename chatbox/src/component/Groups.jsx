import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import { Divider } from "@mui/material";

export default function Groups(props) {
  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value, index) => (
        <>
          <ListItem
            key={index}
            onClick={props.onItemClick}
            sx={{
                alignItems:"flex-start",
                cursor:"context-menu"
            }}
          >
            <ListItemAvatar>
              <Avatar>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Photos" secondary="Jan 9, 2014" />
          </ListItem>
          <Divider variant="inset" component="li" />
        </>
      ))}
    </List>
  );
}
