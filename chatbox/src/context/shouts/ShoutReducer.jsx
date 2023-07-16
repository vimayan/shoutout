const ShoutReducer = (state, action) => {
    switch (action.type) {
      case "SEND_MESSAGE":
        return {
          ...state,
          message: [...state.message, ...action.payload]
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
  
  export default GossipReducer;
  