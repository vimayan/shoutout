import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Shout from "./Shout";

export default function ShoutList(props) {
  return (
    <List sx={{ bgcolor: "background.paper" }}>
      {[1, 2, 3, 4, 5, 6].map((value, index) => (
        <ListItem key={index} onClick={props.onItemClick}>
          <Shout />
        </ListItem>
      ))}
    </List>
  );
}
