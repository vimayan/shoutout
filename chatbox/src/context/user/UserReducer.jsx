const UserReducer = (state, action) => {
  switch (action.type) {
    case "GET_USER":
      return {
        ...state,
        user: { ...action.payload.user },
        token:{ ...action.payload.token }
      };

    case "CREATE_PEER":
      return {
        ...state,
        peerConnection: { ...state.peerConnection, ...action.payload },
      };

    case "UPDATE_USER":
      return {
        ...state,
        user: { ...action.payload.user },
        token:{ ...action.payload.token }
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
