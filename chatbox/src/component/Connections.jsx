import React, { useContext, useEffect, useState } from "react";
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
import { Box, ListItemIcon } from "@mui/material";

export default function Connections(props) {
  const usercontext = useContext(UserContext);
  const {
    user,
    people_circle,
    addFriend,
    requestFriend,
    removeRequest,
    removePending,
    createPeerConnection,
    handleOffer,
    handleRemoteAnswer,
    socket,
  } = usercontext;

  const gossipContext = useContext(GossipContext);

  const { chatbox, setChat, people, chatId } = gossipContext;

  const [show, setShow] = useState(1);

  useEffect(() => {
    if (people.length != 0 && chatId == null) {
      setChat(people[0].userid);
    }
  }, [people]);
  // useEffect(() => {
  //   if (socket) {
  //     socket.on("offer", (offer, user_id, socket_id) => {
  //       // console.log("offer recieved", user_id);
  //       handleOffer({ offer: offer, peerId: user_id, socket_id: socket_id });
  //     });

  //     socket.on("answer", (answer, user_id) => {
  //       // console.log("answer", user_id,answer);
  //       handleRemoteAnswer(answer, user_id);
  //     });
  //   }
  // }, [socket]);
  return (
    <div className="container-fluid pt-5" id="connections">
      <div className="row mt-5 d-block d-md-none">
        <div className="d-md-block pt-2 col-md-7 col-xl-5 ">
          <div>
            <ul className="nav nav-tabs text-center" style={{cursor:'pointer'}}>
              <li className="nav-item text-black ">
                <span
                  className={
                    show==1 ? "nav-link text-black active " : "nav-link text-white"
                  }
                  onClick={() => setShow(1)}
                >
                  Add_Friend
                </span>
              </li>
              <li className="nav-item">
                <span
                  className={
                    show==2 ? "nav-link text-black active" : "nav-link text-white"
                  }
                  onClick={() => setShow(2)}
                >
                  recieved
                </span>
              </li>
              <li className="nav-item">
                <span
                  className={
                    show==3 ? "nav-link text-black active" : "nav-link text-white"
                  }
                  onClick={() => setShow(3)}
                >
                  sent
                </span>
              </li>
            </ul>
          </div>
          {show==1 &&<List sx={{ bgcolor: "background.paper" }}>
              {people_circle ? (
                people_circle.map((value, index) => (
                  <React.Fragment key={value.userid}>
                    <ListItem
                      sx={{
                        alignItems: "flex-start",
                        cursor: "pointer",
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          alt={`${value.name.toUpperCase()}`}
                          src="/static/images/avatar/1.jpg"
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${value.name}`}
                        secondary={<React.Fragment></React.Fragment>}
                      />

                      <ListItemIcon sx={{ display: "flex" }} onClick={()=>requestFriend(value)}>
                        <AddCircleIcon sx={{ color: green[500] }} />
                      </ListItemIcon>
                    </ListItem>

                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))
              ) : (
                <></>
              )}
            </List>}
           {show==2 && <List sx={{ bgcolor: "background.paper" }}>
              {user?.recieved_request && user.recieved_request.length != 0 ? (
                user.recieved_request.map((value, index) => (
                  <React.Fragment key={value._id}>
                    <ListItem
                      sx={{
                        alignItems: "flex-start",
                        cursor: "pointer",
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          alt={`${value.name.toUpperCase()}`}
                          src="/static/images/avatar/1.jpg"
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${value.name}`}
                        secondary={<React.Fragment></React.Fragment>}
                      />

                      <ListItemIcon>
                        <RemoveCircleIcon sx={{ color: green[500] }} onClick={()=>removeRequest(value)} />
                        <AddCircleIcon sx={{ color: green[500] }} onClick={()=>addFriend(value)}/>
                      </ListItemIcon>
                    </ListItem>

                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))
              ) : (
                <></>
              )}
            </List>}
            {show==3 && <List sx={{ bgcolor: "background.paper" }}>
              {user?.pending_request && user.pending_request.length != 0 ? (
                user.pending_request.map((value, index) => (
                  <React.Fragment key={value._id}>
                    <ListItem
                      sx={{
                        alignItems: "flex-start",
                        cursor: "pointer",
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          alt={`${value.name.toUpperCase()}`}
                          src="/static/images/avatar/1.jpg"
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${value.name}`}
                        secondary={<React.Fragment></React.Fragment>}
                      />

                      <ListItemIcon>
                        <RemoveCircleIcon sx={{ color: green[500] }} onClick={()=>removePending(value)} />
                      </ListItemIcon>
                    </ListItem>

                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))
              ) : (
                <></>
              )}
            </List>}
        </div>
      </div>

      <div className="row mt-5 ">
        <div className="col-md col-xl-3  d-none d-md-block">
          <h5>Add Friends</h5>
          <List sx={{ bgcolor: "background.paper" }}>
            {people_circle ? (
              people_circle.map((value, index) => (
                <React.Fragment key={value.userid}>
                  <ListItem
                    sx={{
                      alignItems: "flex-start",
                      cursor: "pointer",
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt={`${value.name.toUpperCase()}`}
                        src="/static/images/avatar/1.jpg"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${value.name}`}
                      secondary={<React.Fragment></React.Fragment>}
                    />

                    <ListItemIcon sx={{ display: "flex" }} onClick={()=>requestFriend(value)}>
                      <AddCircleIcon sx={{ color: green[500] }} />
                    </ListItemIcon>
                  </ListItem>

                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))
            ) : (
              <></>
            )}
          </List>
        </div>
        <div className="col-md col-xl-3  d-none d-md-block">
          <h5>recieved</h5>
          <List sx={{ bgcolor: "background.paper" }}>
            {user?.recieved_request ? (
              user.recieved_request.map((value, index) => (
                <React.Fragment key={value.userid}>
                  <ListItem
                    sx={{
                      alignItems: "flex-start",
                      cursor: "pointer",
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt={`${value.name.toUpperCase()}`}
                        src="/static/images/avatar/1.jpg"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${value.name}`}
                      secondary={<React.Fragment></React.Fragment>}
                    />

                    <ListItemIcon>
                      <RemoveCircleIcon sx={{ color: green[500] }} onClick={()=>removeRequest(value)}/>
                      <AddCircleIcon sx={{ color: green[500] }} onClick={()=>addFriend(value)}/>
                    </ListItemIcon>
                  </ListItem>

                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))
            ) : (
              <></>
            )}
          </List>
        </div>
        <div className="col-md col-xl-3 d-none d-md-block">
          <h5>sent</h5>
            <List sx={{ bgcolor: "background.paper" }}>
                {user?.pending_request && user.pending_request.length != 0 ? (
                  user.pending_request.map((value, index) => (
                    <React.Fragment key={value._id}>
                      <ListItem
                        sx={{
                          alignItems: "flex-start",
                          cursor: "pointer",
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            alt={`${value.name.toUpperCase()}`}
                            src="/static/images/avatar/1.jpg"
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${value.name}`}
                          secondary={<React.Fragment></React.Fragment>}
                        />

                        <ListItemIcon>
                          <RemoveCircleIcon sx={{ color: green[500] }} onClick={()=>removePending(value)} />
                        </ListItemIcon>
                      </ListItem>

                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))
                ) : (
                  <></>
                )}
            </List>
        </div>
      </div>
    </div>
  );
}
