import React, { useContext, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Shout from "./Shout";
import { Box } from "@mui/material";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import ShoutContext from "../context/shouts/ShoutContext";
import UserContext from "../context/user/UserContext";

export default function ShoutList(props) {
  const usercontext = useContext(UserContext);
  const { socket, user } = usercontext;

  const shoutcontext = useContext(ShoutContext);
  const { shouts,moreShout,likeShout } = shoutcontext;
  const add_like = (id)=>{
    likeShout(id);
    socket.emit('like_shout',id);
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        mt: 5,
        mb:3,
        position: "relative",
        width:'100%'
      }}
    >
      <List sx={{ bgcolor: "background.paper",width:'100%'}}>
        {shouts?.length != 0 &&
          shouts.map((value, index) => (
            <ListItem key={value['_id']}>
              <Box onClick={props.onItemClick} sx={{ cursor: "pointer" ,width:'100%'}}>
                <Shout {...value} add_like={add_like}/>
              </Box>
            </ListItem>
          ))}
      </List>
      <Stack direction="row" sx={{justifyContent:'flex-end'}} >
    
      <Button variant="contained" onClick={moreShout}  endIcon={<ArrowDropDownIcon/>}>
        More
      </Button>
    </Stack>
    </Box>
  );
}
