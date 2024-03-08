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

  const updateUser = async (userdata, username, token) => {
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

      // Set onicecandidate handler before creating the offer
      peerConnection.onicecandidate = (e) => {
        console.log("NEW ice candidate!! on local connection, reprinting SDP");
        console.log(JSON.stringify(peerConnection.localDescription));
        const user_id = state.user._id;
        state.socket.emit("webrtcOffer", offer, user_id, function (res) {
          console.log("Webrtc_offer", res);
        });
        // if (e.candidate) {
        //   console.log("NEW ice candidate!! on local connection, reprinting SDP");
        //   console.log(JSON.stringify(peerConnection.localDescription));
        //   const offer = JSON.stringify(peerConnection.localDescription);
        //   const user_id = state.user._id;
        //   // console.log('from peer connection',state.user._id);
        //   state.socket.emit("webrtcOffer", offer, user_id, function (res) {
        //     console.log("Webrtc_offer", res);
        //   });
        // } else {
        //   console.log("ICE gathering complete.");
        // }
      };

      // Create offer and set local description
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      // Use the peerId as the index to store the peer connection
      const payload = {};
      payload[peerId] = peerConnection;

      dispatch({ type: "CREATE_PEER", payload: payload });
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
  //   console.log("handleOffer", peerId);
  //   try {
  //     const peerConnection = state.peerConnection[peerId];
  //     console.log("this is all peerConnections",state.peerConnection)
  //     await peerConnection.setRemoteDescription(
  //       new RTCSessionDescription(offer)
  //     );
  //     const answer = await peerConnection.createAnswer();
  //     await peerConnection.setLocalDescription(answer);
  //     state.socket.emit(
  //       "webrtcAnswer",
  //       answer,
  //       socket_id,
  //       peerId,
  //       function (res) {
  //         console.log("creating answer:", res);
  //       }
  //     );
  //   } catch (error) {
  //     console.error("Error creating answer:", error);
  //   }
  // };

  const handleOffer = async ({ offer, peerId, socket_id }) => {
    console.log("handleOffer", offer);
    try {
      const peerConnection = state.peerConnection[peerId];
      if (!peerConnection) {
        console.error(`PeerConnection for peerId ${peerId} not found.`);
        return;
      }

      if (peerConnection.signalingState !== "have-remote-offer") {
        console.error(
          `Invalid signaling state: ${peerConnection.signalingState}`
        );
        return;
      }

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      state.socket.emit(
        "webrtcAnswer",
        answer,
        socket_id,
        peerId,
        function (res) {
          console.log("creating answer:", res);
        }
      );
    } catch (error) {
      console.error("Error creating answer:", error);
    }
  };
  const handleRemoteAnswer = async (answer, peerId) => {
    console.log("handleRemoteAnswer", answer);
    // try {
    //   const remoteDesc = new RTCSessionDescription(answer);
    //   // const peerConnection = state.peerConnections[peerId];
    //   // await peerConnection.setRemoteDescription(remoteDesc);
    //   // console.log("remote answer", peerConnection);
    // } catch (error) {
    //   console.error("Error setting remote description:", error);
    // }
  };

  const socketConnection = async (user) => {
    let socket = await io(url); //this is connection creation to the server

    dispatch({
      type: "CREATE_SOCKET",
      payload: { socket: socket},
    });


    // this is triggering the event in the server by the socket;
    socket.emit("connectPeers", user);
  };

  return (
    <UserContext.Provider
      value={{
        user: state.user,
        webRtc: state.webRtc,
        socket: state.socket,
        user_socket_id: state.user_socket_id,
        error: state.error,
        login,
        updateUser,
        getUser,
        createPeerConnection,
        handleOffer,
        handleRemoteAnswer,
        socketConnection,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}

export default UserAction;
