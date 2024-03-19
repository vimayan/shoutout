const UserReducer = (state, action) => {
  switch (action.type) {
    case "GET_USER":
      return {
        ...state,
        user: { ...action.payload.user },
        token: { ...action.payload.token },
      };

    case "CREATE_PEER":
      // console.log(action.payload);
      return {
        ...state,
        peerConnection: { ...state.peerConnection, ...action.payload },
      };
    // case "UPDATE_PEER":
    //       const remoteDesc = new RTCSessionDescription(action.payload.answer);
    //       const peerConnection = state.peerConnection[action.payload.peerId];
    //       peerConnection.setRemoteDescription(remoteDesc);
    //  const sendChannel = peerConnection.createDataChannel("sendChannel");
    //   sendChannel.onmessage = (e) =>
    //     console.log("messsage received!!!" + e.data);
    //   sendChannel.onopen = (e) => console.log("open!!!!");
    //   sendChannel.onclose = (e) => console.log("closed!!!!!!");
    //   sendChannel.send('hello');

    //       console.log("connection completed",peerConnection);

    //       return {
    //         ...state,
    //         peerConnection: {
    //           ...state.peerConnection,
    //           [action.payload.peerId]: peerConnection
    //         }
    //       };

    case "UPDATE_PEER":
      const remoteDesc = new RTCSessionDescription(action.payload.answer);
      const updatedPeerConnection = state.peerConnection[action.payload.peerId];

      // Set the remote description
      updatedPeerConnection
        .setRemoteDescription(remoteDesc)
        .then(() => {
          console.log("Remote description set successfully.");

          // Create and configure data channel
          const sendChannel =
            updatedPeerConnection.createDataChannel("sendChannel");
          sendChannel.onopen = () => {
            console.log("Data channel opened.");
            // Send the message once the data channel is open
            sendChannel.send("hello");
          };
          sendChannel.onmessage = (e) =>
            console.log("Message received:", e.data);
          sendChannel.onclose = () => console.log("Data channel closed.");
        })
        .catch((error) => {
          console.error("Error setting remote description:", error);
          // Handle error
        });

      // Update the state with the updated peer connection
      return {
        ...state,
        peerConnection: {
          ...state.peerConnection,
          [action.payload.peerId]: updatedPeerConnection,
        },
      };

    case "UPDATE_USER":
      return {
        ...state,
        user: { ...action.payload.user },
        token: { ...action.payload.token },
      };

    case "SET_CIRCLE":
      return {
        ...state,
        people_circle: state.user["contacts"].find(
          (contact) => contact.userid == action.payload.id
        )
          ? [...state.people_circle]
          : (state.people_circle.find(
              (circle) => circle.userid == action.payload.id
            )
          ? state.people_circle.map((circle) =>
              circle.userid === action.payload.id
                ? action.payload["user"]
                : circle
            )
          : [...state.people_circle, action.payload["user"]]),
      };
    case "CREATE_SOCKET":
      return {
        ...state,
        ...action.payload,
      };
    case "USER_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default UserReducer;
