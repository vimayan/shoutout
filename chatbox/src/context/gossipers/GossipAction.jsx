import React, { useReducer } from "react";
import axios from "axios";
import GossipReducer from "./GossipReducer";
import GossipContext from "./GossipContext";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

function GossipAction(props) {
  const chat = [
    {
      name: "contact1",
      lastChat: [
        { user: "me", text: "hello here i am" },
        { user: "me", text: "whats new" },
        { user: "me", text: "tell me something" },
      ],
    },
    {
      name: "contact2",
      lastChat: [
        { user: "me", text: "hello here i am" },
        { user: "me", text: "whats new" },
        { user: "me", text: "tell me something" },
      ],
    },
    {
      name: "contact3",
      lastChat: [
        { user: "me", text: "hello here i am" },
        { user: "me", text: "whats new" },
        { user: "me", text: "tell me something" },
      ],
    },
    {
      name: "contact4",
      lastChat: [
        { user: "me", text: "hello here i am" },
        { user: "me", text: "whats new" },
        { user: "me", text: "tell me something" },
      ],
    },
    {
      name: "contact5",
      lastChat: [
        { user: "me", text: "hello here i am" },
        { user: "me", text: "whats new" },
        { user: "me", text: "tell me something" },
      ],
    },
    {
      name: "contact6",
      lastChat: [
        { user: "me", text: "hello here i am" },
        { user: "me", text: "whats new" },
        { user: "me", text: "tell me something" },
      ],
    },
    {
      name: "contact7",
      lastChat: [
        { user: "me", text: "hello here i am" },
        { user: "me", text: "whats new" },
        { user: "me", text: "tell me something" },
      ],
    },
    {
      name: "contact8",
      lastChat: [
        { user: "me", text: "hello here i am" },
        { user: "me", text: "whats new" },
        { user: "me", text: "tell me something" },
      ],
    },
  ];

  const chats = [
    {
      contact1: [
        { user: "me", text: "hello here i am" },
        { user: "contact1", text: "hi superb" },
        { user: "me", text: "whats new" },
        { user: "contact1", text: "nothing special" },
        { user: "me", text: "tell me something" },
      ],
    },
    {
      contact2: [
        { user: "me", text: "hello here i am" },
        { user: "contact2", text: "hi superb" },
        { user: "me", text: "whats new" },
        { user: "contact2", text: "nothing special" },
        { user: "me", text: "tell me something" },
      ],
    },
    {
      contact3: [
        { user: "me", text: "hello here i am" },
        { user: "contact2", text: "hi superb" },
        { user: "me", text: "whats new" },
        { user: "contact2", text: "nothing special" },
        { user: "me", text: "tell me something" },
      ],
    },
    {
      contact4: [
        { user: "me", text: "hello here i am" },
        { user: "contact2", text: "hi superb" },
        { user: "me", text: "whats new" },
        { user: "contact2", text: "nothing special" },
        { user: "me", text: "tell me something" },
      ],
    },
  ];
  const Gossip = {
    contacts: [...chat],
    chatbox: [...chats],
    files: [],
    message: [],
    time: new Date(),
    loading: false,
  };

  const [state, dispatch] = useReducer(GossipReducer, Gossip);

  const setLoading = () => {
    dispatch({ type: "SET_LOADING" });
  };

  const setTime = (time) => {
    dispatch({ type: "SET_TIME", payload: time });
  };
  const setChat=()=>{

    
  }

  const handleAttachment = (e) => {
    const selectedFiles = Array.from(e.target.files);
    dispatch({ type: "ADD_FILES", payload: selectedFiles });
  };

  const removeFile = (index) => {
    const file = state.files.filter((_, i) => i !== index);
    dispatch({ type: "REMOVE_FILES", payload: file });
  };

  const send = (text, audio) => {
    // console.log(state.files);
    // console.log(text);
    if (state.files.length !== 0 || text.length !== 0) {
      const fileMessages = state.files.map((file) => {
        const fileType = file.type.split("/")[0];
        if (fileType === "image") {
          return {
            user: "sender",
            html: (
              <img
                src={URL.createObjectURL(file)}
                height={"100px"}
                alt={file.name}
              />
            ),
            attachment: true,
          };
        } else if (fileType === "video") {
          return {
            user: "sender",
            html: <video src={URL.createObjectURL(file)} />,
            attachment: true,
          };
        } else if (fileType === "audio") {
          return {
            user: "sender",
            html: <audio src={URL.createObjectURL(file)} controls />,
            attachment: true,
          };
        } else if (fileType === "application" && file.name.endsWith(".pdf")) {
          return {
            user: "sender",
            html: (
              <>
                <div class="pdf-thumbnail">
                  <a
                    href={URL.createObjectURL(file)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <PictureAsPdfIcon />
                  </a>
                </div>
                <a
                  href={URL.createObjectURL(file)}
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
            user: "sender",
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
      const messages = [...fileMessages, { text: text }];

      dispatch({ type: "SEND_MESSAGE", payload: messages });
      // Clear files
      dispatch({ type: "CLEAR_FILES" });
    } else if (audio) {
      const messages = {
        user: "sender",
        html: (
          <audio src={URL.createObjectURL(audio)} controls className="col-12" />
        ),
        attachment: true,
      };

      dispatch({ type: "SEND_MESSAGE", payload: [messages] });
    }
  };

  return (
    <GossipContext.Provider
      value={{
        contacts: state.contacts,
        chatbox: state.chatbox,
        message: state.message,
        files: state.files,
        loading: state.loading,
        time: state.time,
        handleAttachment,
        removeFile,
        send,
      }}
    >
      {props.children}
    </GossipContext.Provider>
  );
}

export default GossipAction;
