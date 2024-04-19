import React, { useReducer,useContext } from "react";
import axios from "axios";
import ShoutReducer from "./ShoutReducer";
import ShoutContext from "./ShoutContext";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import UserContext from "../user/UserContext";

function ShoutAction(props) {

const userContext  = useContext(UserContext);
const {user,socket} = userContext;
  const shouts = {
    shouts:[],
    chatbox: {},
    files: [],
    message: [],
    shoutId: null,
    time: new Date(),
    loading: false,
  };

  const [state, dispatch] = useReducer(ShoutReducer, shouts);

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const setLoading = () => {
    dispatch({ type: "SET_LOADING" });
  };

  const setTime = (time) => {
    dispatch({ type: "SET_TIME", payload: time });
  };

  const setShoutChat = (user_id) => {
    const message = state.chatbox[user_id] ? state.chatbox[user_id] : "";
    dispatch({ type: "SELECT_MESSAGE", payload: message });
    dispatch({ type: "SELECT_SHOUT_ID", payload: user_id });
  };

  const handleShoutAttachment = (e) => {
    const selectedFiles = Array.from(e.target.files);
    console.log(selectedFiles);
    selectedFiles.map((file)=>{

      var reader = new FileReader();
        
      reader.onload = (event) => {
        var type = file.type
        var fileData = event.target.result;
        console.log(type);
        dispatch({ type: "ADD_FILES", payload: {data:fileData,type:type} });
      };
  
      reader.readAsDataURL(file);
    })
    
  };

  const removeShoutFile = (index) => {
    const file = state.files.filter((_, i) => i !== index);
    dispatch({ type: "REMOVE_FILES", payload: file });
  };

  const sendShoutMessage = ({ chat_id, text = "", audio = null }) => {
    
    if (state.files.length !== 0 || text.length !== 0) {
        const fileMessages = state.files.map((file) => {
          const fileType = file.type.split("/")[0];

          if (fileType === "image") {
            return {
              user: user._id,
              html: (
                <img
                  src={file.data}
                  height={"100px"}
                  alt="img"
                />
              ),
              attachment: true,
            };
          } else if (fileType === "video") {
            return {
              user: user._id,
              html:<video>
                <source src={file.data} controls/>
              </video>,
              attachment: true,
            };
          } else if (fileType === "audio") {
            return {
              user: user._id,
              html: <audio src={file.data} controls />,
              attachment: true,
            };
          } else if (fileType === "application" && file.name.endsWith(".pdf")) {
            return {
              user: user._id,
              html: (
                <>
                  <div class="pdf-thumbnail">
                    <a
                      href={file.data}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <PictureAsPdfIcon />
                    </a>
                  </div>
                  <a
                    href={file.data}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {file.name}
                  </a>
                </>
              ),
              attachment: true,
            };
          } else {
            return {
              user: user._id,
              html: (
                <a
                  href={URL.createObjectURL(file)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {file.name}
                </a>
              ),
              attachment: true,
            };
          }
        });
      const messages = [...fileMessages, {user: user._id,text: text }];
      shareShoutMessage(messages,chat_id);
      console.log("sending msg");
      dispatch({ type: "SEND_MESSAGE", payload: messages });
      // Clear files
      dispatch({ type: "CLEAR_FILES" });

      //update chatbox
      dispatch({ type: "UPDATE_MESSAGE", payload: {message:[...messages],id:chat_id} });

    } else if (audio) {
      console.log(audio);
      var reader = new FileReader();
        
      reader.onload = (event) => {
        var fileData = event.target.result;
        const messages = {
          user: user._id,
          html: (
            <audio src={fileData} controls className="col-9" />
          ),
          attachment: true,
        };
        console.log(messages);
  
        dispatch({ type: "SEND_MESSAGE", payload: [messages] });
        shareShoutMessage([messages],chat_id);
        
        //update chatbox
        dispatch({ type: "UPDATE_MESSAGE", payload: {message:[messages],id:chat_id} });
       
      };
  
      reader.readAsDataURL(audio);

    
    }
  };

  const shareShoutMessage = (message, chat_id) => {
    socket.emit("shouts", message, chat_id,username);
  };

  const recieveShoutMessage = ( message,chat_id,sender_name )=>{
    let message_recieved = {...message[0]}
    message_recieved['username']= sender_name
    const messages = [message_recieved];
    console.log(messages);
    dispatch({ type: "SEND_MESSAGE", payload: messages });

    dispatch({ type: "UPDATE_MESSAGE", payload: {message:[...messages],id:chat_id} });
  }
 
  const createShout = async (new_shout) => {
    console.log(token,new_shout);
    const config = {
      headers: {
        token: token,
      },
    };
    try {
      const res = await axios.post(
        `https://shoutout-server.onrender.com/${username}/create_shout`,
        new_shout,
        config
      );
      dispatch({
        type: "ADD_SHOUT",
        payload: [res.data],
      });
    } catch (error) {
      dispatch({
        type: "USER_ERROR",
        payload: error.response,
      });
    }
  };
  const getShout = async () => {

    const config = {
      headers: {
        token: token,
      },
    };
    try {
      const res = await axios.get(
        `https://shoutout-server.onrender.com/${username}/get_shouts`,
        config
      );
      console.log(res.data)
      dispatch({
        type: "GET_SHOUT",
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: "USER_ERROR",
        payload: error.response,
      });
    }
  };
  const moreShout = async () => {
    let offset_id = state.shouts[state.shouts.length-1]['createdAt'];
    const config = {
      headers: {
        token: token,
      },
    };
    try {
      const res = await axios.post(
        `https://shoutout-server.onrender.com/${username}/more_shouts`,
        {offset_id},
        config
      );
      console.log(res.data)
      dispatch({
        type: "MORE_SHOUT",
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: "USER_ERROR",
        payload: error.response,
      });
    }
  };
  const likeShout = async (id)=>{
    const config = {
      headers: {
        token: token,
      },
    };
    try {
      const res = await axios.put(
        `https://shoutout-server.onrender.com/${username}/like_shout`,
        {id},
        config
      );
        console.log('like_shout',res);
      dispatch({
        type: "LIKE_SHOUT",
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: "USER_ERROR",
        payload: error.response,
      });
    }
  }
  const addLike = async (id)=>{
  console.log('addlike',id);
    dispatch({
      type: "ADD_LIKE",
      payload:id,
    });
 
    
  }
  return (
    <ShoutContext.Provider
      value={{
        shouts: state.shouts,
        chatbox: state.chatbox,
        message: state.message,
        files: state.files,
        loading: state.loading,
        time: state.time,
        handleShoutAttachment,
        removeShoutFile,
        sendShoutMessage,
        setShoutChat,
        shareShoutMessage,
        recieveShoutMessage,
        createShout,
        getShout,
        moreShout,
        likeShout,
        addLike
      }}
    >
      {props.children}
    </ShoutContext.Provider>
  );
}

export default ShoutAction;
