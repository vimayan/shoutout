import React, { useReducer } from "react";
import UserReducer from "./UserReducer";
import UserContext from "./UserContext";
import axios from "axios";
import io from "socket.io-client";

function UserAction(props) {
  const userInitial = {
    user: {},
    token: {},
    peerConnection: {},
    socket: null,
    people_circle:[],
    error: {},
  };
  const url = "http://localhost:4500";
  const [state, dispatch] = useReducer(UserReducer, userInitial);

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const login = async (userdata) => {
    try {
      const res = await axios.post(`${url}/login`, userdata);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.user["firstname"]);

      dispatch({
        type: "GET_USER",
        payload: res.data,
      });
      socketConnection(res.data.user);
    } catch (error) {
      if (error.response?.status === 500) {
        dispatch({
          type: "USER_ERROR",
          payload: { data: error.response.statusText },
        });
      } else {
        dispatch({
          type: "USER_ERROR",
          payload: error.response,
        });
      }
    }
  };

  const getUser = async () => {
    const config = {
      headers: {
        token: token,
      },
    };
    try {
      const res = await axios.get(
        `http://localhost:4500/${username}/getuser`,
        config
      );
      console.log(res.data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.user["firstname"]);
      socketConnection(res.data.user);
      dispatch({
        type: "GET_USER",
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: "USER_ERROR",
        payload: error.response,
      });
    }
  };
  const getUserUpdate = async () => {
    const config = {
      headers: {
        token: token,
      },
    };
    try {
      const res = await axios.get(
        `http://localhost:4500/${username}/getuser`,
        config
      );
      dispatch({
        type: "GET_USER",
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: "USER_ERROR",
        payload: error.response,
      });
    }
  };

  const updateUser = async (userdata) => {
    const config = {
      headers: {
        token: token,
      },
    };
    try {
      const res = await axios.put(
        `${url}/${username}/update`,
        userdata,
        config
      );
      dispatch({
        type: "GET_USER",
        payload: { ...res.data },
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.user["firstname"]);
    } catch (error) {
      dispatch({
        type: "USER_ERROR",
        payload: error.response,
      });
    }
  };

  const createPeerConnection = async (peerId) => {
    try {
      // peerId is a user_id of contacts
      const peerConnection = new RTCPeerConnection();

      const sendChannel = peerConnection.createDataChannel("sendChannel");
      sendChannel.onmessage = (e) =>
        console.log("messsage received!!!" + e.data);
      sendChannel.onopen = (e) => console.log("open!!!!");
      sendChannel.onclose = (e) => console.log("closed!!!!!!");

      peerConnection.onicecandidate = (e) => {
        console.log("NEW ice candidate!! on local connection, reprinting SDP");
        console.log(JSON.stringify(peerConnection.localDescription));
      };

      // Create offer and set local description
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      const user_id = state.user._id;
      state.socket.emit("webrtcOffer", offer, peerId, user_id, function (res) {
        console.log("Webrtc_offer", res);
      });
      console.log("this is from create connection", peerConnection);
      dispatch({ type: "CREATE_PEER", payload: { [peerId]: peerConnection } });

      return peerConnection;
    } catch (error) {
      // Handle any errors that might occur during peer connection creation
      console.error("Error creating peer connection:", error);
    }
  };

  // const createPeerConnection = (peerId) => {
  //   //peerId is a user_id of contacts
  //   console.log("cr1");
  //   const peerConnection = new RTCPeerConnection();

  //   peerConnection
  //     .createOffer()
  //     .then((o) => peerConnection.setLocalDescription(o));

  //   const sendChannel = peerConnection.createDataChannel("sendChannel");
  //   sendChannel.onmessage = (e) => console.log("messsage received!!!" + e.data);
  //   sendChannel.onopen = (e) => console.log("open!!!!");
  //   sendChannel.onclose = (e) => console.log("closed!!!!!!");
  //   console.log("cr2");
  //   peerConnection.onicecandidate = (e) => {
  //     console.log("NEW ice candidate!! on local connection, reprinting SDP");
  //     console.log(JSON.stringify(peerConnection.localDescription));
  //     const offer = JSON.stringify(peerConnection.localDescription);
  //     const user_id = state.user._id;
  //     state.socket.emit("webrtcOffer", offer, user_id, function (res) {
  //       console.log("Webrtc_offer", res);
  //     });
  //   };
  //   console.log("cr3");
  //   // Use the peerId as the index to store the peer connection
  //   const payload = {};
  //   payload[peerId] = peerConnection;

  //   dispatch({ type: "CREATE_PEER", payload: payload });
  // };

  // const handleOffer = async (offer) => {
  //   try {
  //     await state.peerConnection.setRemoteDescription(
  //       new RTCSessionDescription(offer)
  //     );
  //     const answer = await state.peerConnection.createAnswer();
  //     await peerConnection.setLocalDescription(answer);
  //     state.socket.emit(
  //       "Webrtc_answer",
  //       (answer,
  //       state.socketId,
  //       function (res) {
  //         console.log(res);
  //       })
  //     );
  //   } catch (error) {
  //     console.error("Error creating answer:", error);
  //   }
  // };

  // const handleOffer = async ({ offer, peerId, socket_id }) => {
  //   console.log("handleOffer", offer);
  //   try {
  //     const peerConnection = state.peerConnection[peerId];
  //     if (!peerConnection) {
  //       const remoteConnection = new RTCPeerConnection();

  //       remoteConnection.ondatachannel = (e) => {
  //         console.log("datachannel", e);
  //         remoteConnection.channel = e.channel;
  //         remoteConnection.channel.onmessage = (e) =>
  //           console.log("messsage received!!!" + e.data);
  //         remoteConnection.channel.onopen = (e) => console.log("open!!!!");
  //         remoteConnection.channel.onclose = (e) => console.log("closed!!!!!!");
  //       };

  //       remoteConnection.onicecandidate = (e) => {
  //         console.log(
  //           " NEW ice candidnat!! on localconnection reprinting SDP "
  //         );
  //         console.log(JSON.stringify(remoteConnection.localDescription));
  //       };

  //       await remoteConnection
  //         .setRemoteDescription(offer)
  //         .then((a) => console.log("done"));

  //       await remoteConnection
  //         .createAnswer()
  //         .then((a) => remoteConnection.setLocalDescription(a))
  //         .then((a) => {
  //           console.log(JSON.stringify(remoteConnection.localDescription));
  //           const answer = remoteConnection.localDescription;
  //           const user_id = state.user._id;
  //           state.socket.emit(
  //             "webrtcAnswer",
  //             answer,
  //             socket_id,
  //             user_id,
  //             function (res) {
  //               // console.log("creating answer:", res);
  //             }
  //           );
  //         });
  //       console.log("onlocal", remoteConnection);

  //       // Use the peerId as the index to store the peer connection
  //       dispatch({
  //         type: "CREATE_PEER",
  //         payload: { [peerId]: remoteConnection },
  //       });
  //     } else {
  //       if (peerConnection.signalingState !== "have-remote-offer") {
  //         console.error(
  //           `Invalid signaling state: ${peerConnection.signalingState}`
  //         );
  //         return;
  //       }

  //       await peerConnection.setRemoteDescription(
  //         new RTCSessionDescription(offer)
  //       );
  //       const answer = await peerConnection.createAnswer();
  //       await peerConnection.setLocalDescription(answer);
  //       state.socket.emit(
  //         "webrtcAnswer",
  //         answer,
  //         socket_id,
  //         peerId,
  //         function (res) {
  //           console.log("creating answer:", res);
  //         }
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error creating answer:", error);
  //   }
  // };

  // const handleOffer = async ({ offer, peerId, socket_id }) => {
  //   console.log("handleOffer", offer);
  //   try {
  //     const peerConnection = state.peerConnection[peerId];
  //     if (!peerConnection) {
  //       const remoteConnection = new RTCPeerConnection();

  //       remoteConnection.onicecandidate = (e) => {
  //         console.log(" NEW ice candidnat!! on localconnection reprinting SDP ");
  //         console.log(JSON.stringify(remoteConnection.localDescription));
  //       };

  //       // Wait until signaling state is "stable"
  //       while (remoteConnection.signalingState !== "stable") {
  //         await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for 100ms
  //       }

  //       // Set remote description
  //       await remoteConnection.setRemoteDescription(offer);
  //       console.log("Remote description set successfully.");

  //       // Create answer
  //       const answer = await remoteConnection.createAnswer();
  //       await remoteConnection.setLocalDescription(answer);

  //       // Emit the answer
  //       const user_id = state.user._id;
  //       state.socket.emit("webrtcAnswer", answer, socket_id, user_id, (res) => {
  //         console.log("Creating answer:", res);
  //       });

  //       // Set up data channel
  //       remoteConnection.ondatachannel = (e) => {
  //         const receiveChannel = e.channel;
  //         receiveChannel.onmessage = (e) => console.log("Message received: " + e.data);
  //         receiveChannel.onopen = (e) => console.log("Data channel open.");
  //         receiveChannel.onclose = (e) => console.log("Data channel closed.");
  //         remoteConnection.channel = receiveChannel;
  //       };

  //       // Store the peer connection in state
  //       dispatch({ type: "CREATE_PEER", payload: { [peerId]: remoteConnection } });
  //     } else {
  //       // Handle existing peer connection
  //       if (peerConnection.signalingState !== "have-remote-offer") {
  //         console.error(`Invalid signaling state: ${peerConnection.signalingState}`);
  //         return;
  //       }

  //       // Set remote description
  //       await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  //       console.log("Remote description set successfully.");

  //       // Create answer
  //       const answer = await peerConnection.createAnswer();
  //       await peerConnection.setLocalDescription(answer);

  //       // Emit the answer
  //       state.socket.emit("webrtcAnswer", answer, socket_id, peerId, (res) => {
  //         console.log("Creating answer:", res);
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error creating answer:", error);
  //   }
  // };

  // const handleRemoteAnswer = async (answer, peerId) => {
  //   console.log("handleRemoteAnswer", answer);
  //   dispatch({
  //     type: "UPDATE_PEER",
  //     payload: { peerId: peerId, answer: answer },
  //   });
  //   // try {
  //   //   const remoteDesc = new RTCSessionDescription(answer);
  //   //   // const peerConnection = state.peerConnections[peerId];
  //   //   console.log(state);
  //   //   return;
  //   //   // await peerConnection.setRemoteDescription(remoteDesc);
  //   //   // console.log("remote answer", peerConnection);
  //   // } catch (error) {
  //   //   console.error("Error setting remote description:", error);
  //   // }
  // };

  const socketConnection = async (user) => {
    let socket = io(url); //this is connection creation to the server

    dispatch({
      type: "CREATE_SOCKET",
      payload: { socket: socket },
    });

    // this is triggering the event in the server by the socket;
    socket.emit("connectPeers", user);
  };

  const setCircle = async (newuser) => {
    dispatch({
      type: "SET_CIRCLE",
      payload: { user: newuser, id: newuser["userid"] },
    });
  };
  const addFriend = async (newuser)=>{
    console.log('addFriend',newuser);
    const user_data = {
      name:newuser['name'],
      userid:newuser['userid'],
    }
    const config = {
      headers: {
        token: token,
      },
    };
    try {
      const res = await axios.post(
        `http://localhost:4500/${username}/addfriend`,
        user_data,
        config
      );
      await state.socket.emit('change_user',newuser.userid);
      dispatch({
        type: "GET_USER",
        payload: res.data,
      });
      socketConnection(res.data.user);
    } catch (error) {
      dispatch({
        type: "USER_ERROR",
        payload: error.response,
      });
    }
  };
  const requestFriend = async(newuser)=>{
    console.log('requestFriend',newuser);
    const user_data = {
      name:newuser['name'],
      userid:newuser['userid'],
    }
    let check_pending = state.user.pending_request.find((user)=>user.userid===user_data.userid);
    let check_received = state.user.recieved_request.find((user)=>user.userid===user_data.userid);

    if(!check_pending && !check_received){
      const config = {
        headers: {
          token: token,
        },
      };
      try {
        const res = await axios.post(
          `http://localhost:4500/${username}/add_request`,
          user_data,
          config
        );
        console.log('requestFriend',res);
        dispatch({
          type: "GET_USER",
          payload: res.data,
        });

        state.socket.emit('change_user',newuser.socket_id);

      } catch (error) {
        dispatch({
          type: "USER_ERROR",
          payload: error.response,
        });
      }
    }
  
  };
  const removeRequest = async(newuser)=>{
    console.log('removeRequest',newuser);
    const user_data = {
      name:newuser['name'],
      userid:newuser['userid'],
    }
    const config = {
      headers: {
        token: token,
      },
    };
    try {
      const res = await axios.post(
        `http://localhost:4500/${username}/remove_request`,
        user_data,
        config
      );
      dispatch({
        type: "GET_USER",
        payload: res.data,
      });
      state.socket.emit('change_user',newuser.userid);
    } catch (error) {
      dispatch({
        type: "USER_ERROR",
        payload: error.response,
      });
    }

  };
  const removePending = async(newuser)=>{
    console.log('removePending',newuser);
    const user_data = {
      name:newuser['name'],
      userid:newuser['userid'],
    }
    const config = {
      headers: {
        token: token,
      },
    };
    try {
      const res = await axios.post(
        `http://localhost:4500/${username}/remove_pending`,
        user_data,
        config
      );
      dispatch({
        type: "GET_USER",
        payload: res.data,
      });
      state.socket.emit('change_user',newuser.userid);
    } catch (error) {
      dispatch({
        type: "USER_ERROR",
        payload: error.response,
      });
    }

  };
  return (
    <UserContext.Provider
      value={{
        user: state.user,
        webRtc: state.webRtc,
        people_circle:state.people_circle,
        socket: state.socket,
        user_socket_id: state.user_socket_id,
        error: state.error,
        login,
        updateUser,
        getUser,
        createPeerConnection,
        // handleOffer,
        // handleRemoteAnswer,
        socketConnection,
        setCircle,
        addFriend,
        requestFriend,
        removeRequest,
        removePending,
        getUserUpdate
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}

export default UserAction;
