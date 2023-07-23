const GroupReducer = (state, action) => {
  switch (action.type) {
    case "SELECT_MESSAGE":
      return {
        ...state,
        message: action.payload,
      };
    case "UPDATE_MESSAGE":
      return {
        ...state,
        chatbox: {...state.chatbox,...action.payload},
      };
      case "SELECT_CHAT_ID":
        return {
          ...state,
          chatId: action.payload,
        };
    case "SEND_MESSAGE":
      return {
        ...state,
        message: [...state.message, ...action.payload],
      };
    case "ADD_FILES":
      return {
        ...state,
        files: [...state.files, ...action.payload],
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

export default GroupReducer;
