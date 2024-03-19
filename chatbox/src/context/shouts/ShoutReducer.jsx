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

export default ShoutReducer;
