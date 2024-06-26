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
    case "STORE_PEOPLE":
      return {
        ...state,
        people: state.people.find(
          (people) => people.userid == action.payload.userid
        )
          ? state.people.map((people) =>
              people.userid === action.payload.userid ? action.payload : people
            )
          : [...state.people, action.payload],
      };
    case "RESTORE_PEOPLE":
      return {
        ...state,
        people: state.people.find(
          (people) => people.userid == action.payload.userid
        )
          ? state.people.map((people) =>
              people.userid === action.payload.userid ? action.payload : people
            )
          : [...state.people, action.payload],
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
