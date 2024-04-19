const ShoutReducer = (state, action) => {
  switch (action.type) {
    case "ADD_SHOUT":
      return {
        ...state,
        shouts: [...action.payload, ...state.shouts],
      };
    case "GET_SHOUT":
      return {
        ...state,
        shouts: [...action.payload],
      };
    case "MORE_SHOUT":
      return {
        ...state,
        shouts: [...state.shouts, ...action.payload],
      };
    case "LIKE_SHOUT":
      return {
        ...state,
        shouts: state.shouts.map((shout, index) =>
          shout["_id"] === action.payload["_id"] ? action.payload : shout
        ),
      };
    case "ADD_LIKE":
      return {
        ...state,
        shouts: state.shouts.map((shout, index) => {
          if (shout["_id"] === action.payload) {
            let new_shout = { ...shout };
            ++new_shout["like"] 
            return {...new_shout};
          } else {
            return shout;
          }
        }),
      };
      case "SELECT_MESSAGE":
      return {
        ...state,
        message: action.payload,
      };
    case "UPDATE_MESSAGE":
      return {
        ...state,
        chatbox:
          state.chatbox[action.payload["id"]]?.length > 0
            ? {
                ...state.chatbox,
                [action.payload["id"]]: [
                  ...state.chatbox[action.payload["id"]],
                  ...action.payload["message"],
                ],
              }
            : {
                ...state.chatbox,
                [action.payload["id"]]: action.payload["message"],
              },
      };

    case "SELECT_SHOUT_ID":
      return {
        ...state,
        shoutId: action.payload,
      };
    case "SEND_MESSAGE":
      return {
        ...state,
        message: [...state.message, ...action.payload],
      };
    case "ADD_FILES":
      return {
        ...state,
        files: [...state.files, { ...action.payload }],
      };

    case "REMOVE_FILES":
      return {
        ...state,
        files: action.payload,
      };
    case "CLEAR_FILES":
      return {
        ...state,
        files: [],
      };

    case "SET_LOADING":
      return {
        ...state,
        loading: true,
      };

    case "DAILY_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default ShoutReducer;
