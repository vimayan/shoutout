import React, { useContext, useReducer } from "react";
import GossipReducer from "./GossipReducer";
import GossipContext from "./GossipContext";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import UserContext from "../user/UserContext";

function GossipAction(props) {
  const usercontext = useContext(UserContext);

  const { socket, user } = usercontext;

  const Gossip = {
    people: [],
    chatbox: {},
    files: [],
    message: [],
    chatId: null,
    time: new Date(),
    loading: false,
    socketID: null,
  };

  const [state, dispatch] = useReducer(GossipReducer, Gossip);
 

  const setLoading = () => {
    dispatch({ type: "SET_LOADING" });
  };

  const setTime = (time) => {
    dispatch({ type: "SET_TIME", payload: time });
  };

  const setChat = (user_id) => {
    const message = state.chatbox[user_id] ? state.chatbox[user_id] : "";
    dispatch({ type: "SELECT_MESSAGE", payload: message });
    dispatch({ type: "SELECT_CHAT_ID", payload: user_id });
  };



  const handleAttachment = (e) => {
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

  const removeFile = (index) => {
    const file = state.files.filter((_, i) => i !== index);
    dispatch({ type: "REMOVE_FILES", payload: file });
  };

  const send = ({ chat_id, text = "", audio = null }) => {
    
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
      sendSocketMSg(messages,chat_id);
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
        sendSocketMSg([messages],chat_id);
        
        //update chatbox
        dispatch({ type: "UPDATE_MESSAGE", payload: {message:[messages],id:chat_id} });
       
      };
  
      reader.readAsDataURL(audio);

    
    }
  };

  const store_connects = async (people_details) => {
    try {
      dispatch({
        type: "STORE_PEOPLE",
        payload: {
          name: people_details["name"],
          userid: people_details["userid"],
          socket_id: people_details.socket_id,
        }
      });

      const socket_id = people_details.socket_id;
      const load_contact = {
        name: user["firstname"],
        userid: user["_id"],
        socket_id: socket.id,
      };
      socket.emit("reconnect", socket_id, load_contact);
    } catch (error) {
      console.error("An error occurred in store_connects:", error);
    }
  };
  const store_reconnects = async (people_details) => {
    try {
      dispatch({
        type: "RESTORE_PEOPLE",
        payload: {
          name: people_details["name"],
          userid: people_details["userid"],
          socket_id: people_details.socket_id,
        },
      });
    } catch (error) {
      console.error("An error occurred in store_connects:", error);
    }
  };
  const sendSocketMSg = (message, chat_id) => {
    socket.emit("message", message, chat_id,user._id);
  };

  const recieve_message = ( message,chat_id )=>{
    const messages = [...message];
    console.log(messages);
    dispatch({ type: "SEND_MESSAGE", payload: messages });

    dispatch({ type: "UPDATE_MESSAGE", payload: {message:[...messages],id:chat_id} });
  }

  return (
    <GossipContext.Provider
      value={{
        people: state.people,
        chatbox: state.chatbox,
        message: state.message,
        files: state.files,
        loading: state.loading,
        time: state.time,
        chatId: state.chatId,
        handleAttachment,
        removeFile,
        send,
        setChat,
        store_connects,
        store_reconnects,
        recieve_message
      }}
    >
      {props.children}
    </GossipContext.Provider>
  );
}

export default GossipAction;
