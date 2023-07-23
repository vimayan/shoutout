import React, { useReducer } from "react";
import UserReducer from "./UserReducer";
import UserContext from "./UserContext";
import axios from "axios";
import io from "socket.io-client";

function UserAction(props) {
  const userInitial = {
    user: {},
    peerConnection: {},
    socket: null,
    socketId: null,
    error: {},
  };
  const [state, dispatch] = useReducer(UserReducer, userInitial);

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const login = async (userdata) => {
    try {
      const res = await axios.post("http://localhost:5000/login", userdata);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.user["firstname"]);

      dispatch({
        type: "GET_USER",
        payload: res.data.user,
      });
    } catch (error) {
      dispatch({
        type: "USER_ERROR",
        payload: error.response,
      });
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
        `http://localhost:5000/${username}/update`,
        userdata,
        config
      );
      dispatch({
        type: "GET_USER",
        payload: { ...res.data },
      });

      localStorage.setItem("username", res.data["firstname"]);
    } catch (error) {
      dispatch({
        type: "USER_ERROR",
        payload: error.response,
      });
    }
  };

  // const createPeerConnection = async () => {
  //   const peerConnection = new RTCPeerConnection();

  //   peerConnection
  //     .createOffer()
  //     .then((o) => localConnection.setLocalDescription(o));

  //   peerConnection.onicecandidate = (e) => {
  //     console.log(" NEW ice candidate!! on localconnection reprinting SDP ");
  //     console.log(JSON.stringify(localConnection.localDescription));
  //     const offer = JSON.stringify(localConnection.localDescription);
  //     const user_id = state.user._id;
  //     state.socket.emit(
  //       "Webrtc_offer",
  //       (offer,
  //       user_id,
  //       function (res) {
  //         console.log(res);
  //       })
  //     );
  //   };
  //   dispatch({ type: "CREATE_PEER", payload: peerConnection });
  // };

  const createPeerConnection = async (peerId) => {
    //peerId is a user_id of contacts
    const peerConnection = new RTCPeerConnection();

    peerConnection
      .createOffer()
      .then((o) => peerConnection.setLocalDescription(o));

    peerConnection.onicecandidate = (e) => {
      console.log("NEW ice candidate!! on local connection, reprinting SDP");
      console.log(JSON.stringify(peerConnection.localDescription));
      const offer = JSON.stringify(peerConnection.localDescription);
      const user_id = state.user._id;
      state.socket.emit("Webrtc_offer", offer, user_id, function (res) {
        console.log(res);
      });
    };

    // Use the peerId as the index to store the peer connection
    // const updatedConnections = [...state.peerConnections];
    // updatedConnections[peerId] = peerConnection;
    const payload = {};
    payload[peerId] = peerConnection;

    dispatch({ type: "CREATE_PEER", payload: payload });
  };

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

  const handleOffer = async (offer, peerId) => {
    try {
      const peerConnection = state.peerConnection[peerId];
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      state.socket.emit(
        "Webrtc_answer",
        answer,
        state.socketId,
        function (res) {
          console.log(res);
        }
      );
    } catch (error) {
      console.error("Error creating answer:", error);
    }
  };

  // const handleRemoteAnswer = async (answer) => {
  //   // here u need to use socket to get the answer by using useEffect
  //   try {
  //     const remoteDesc = new RTCSessionDescription(answer);
  //     await state.peerConnection.setRemoteDescription(remoteDesc);
  //   } catch (error) {
  //     console.error("Error setting remote description:", error);
  //   }
  // };

  const handleRemoteAnswer = async (answer, peerId) => {
    try {
      const remoteDesc = new RTCSessionDescription(answer);
      const peerConnection = state.peerConnections[peerId];
      await peerConnection.setRemoteDescription(remoteDesc);
    } catch (error) {
      console.error("Error setting remote description:", error);
    }
  };

  const socketConnection = async () => {
    let socket = io("socketUrl");

    dispatch({ type: "CREATE_SOCKET", payload: socket });
  };
  return (
    <UserContext.Provider
      value={{
        user: state.user,
        webRtc: state.webRtc,
        socket: state.user,
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
