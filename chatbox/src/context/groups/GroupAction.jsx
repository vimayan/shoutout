import React, { useReducer } from "react";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import GroupReducer from "../gossipers/GossipReducer";
import GroupContext from "./GroupContext";
function GroupAction(props) {
  const group = [
    {
      name: "Group1",
      group_id: 1,
      users: [],
    },
    {
      name: "Group2",
      group_id: 2,
      users: [],
    },
    {
      name: "Group3",
      group_id: 3,
      users: [],
    },
    {
      name: "Group4",
      group_id: 4,
      users: [],
    },
    {
      name: "Group5",
      group_id: 5,
      users: [],
    },
    {
      name: "contact6",
      group_id: 6,
      users: [],
    },
    {
      name: "Group7",
      group_id: 7,
      users: [],
    },
    {
      name: "Group8",
      group_id: 8,
      users: [],
    },
  ];

  // const chats = {
  //   1: [
  //     { user: "user", text: "hello here i am 1" },
  //     { user: "contact1", text: "hi superb" },
  //     { user: "user", text: "whats new" },
  //     { user: "contact1", text: "nothing special" },
  //     { user: "user", text: "tell me something" },
  //   ],

  //   2: [
  //     { user: "user", text: "hello here i am 2" },
  //     { user: "contact2", text: "hi superb" },
  //     { user: "user", text: "whats new" },
  //     { user: "contact2", text: "nothing special" },
  //     { user: "user", text: "tell me something" },
  //   ],

  //   3: [
  //     { user: "user", text: "hello here i am 3" },
  //     { user: "contact3", text: "hi superb" },
  //     { user: "user", text: "whats new" },
  //     { user: "contact3", text: "nothing special" },
  //     { user: "user", text: "tell me something" },
  //   ],

  //   4: [
  //     { user: "user", text: "hello here i am 4" },
  //     { user: "contact4", text: "hi superb" },
  //     { user: "user", text: "whats new" },
  //     { user: "contact4", text: "nothing special" },
  //     { user: "user", text: "tell me something" },
  //   ],
  // };

  const Gossip = {
    groups: [...group],
    chatbox: {},
    files: [],
    message: [],
    chatId: null,
    time: new Date(),
    loading: false,
  };

  const [state, dispatch] = useReducer(GroupReducer, Gossip);

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
    dispatch({ type: "ADD_FILES", payload: selectedFiles });
  };

  const removeFile = (index) => {
    const file = state.files.filter((_, i) => i !== index);
    dispatch({ type: "REMOVE_FILES", payload: file });
  };

  const send = ({ chat_id, text = "", audio = null }) => {
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
      //update chatbox
      console.log(chat_id);
      const chatBox = { ...state.chatbox };
      const updatedChat = {};
      updatedChat[chat_id] = chatBox[chat_id]
        ? [...chatBox[chat_id], ...messages]
        : [...messages];
      console.log(updatedChat);
      dispatch({ type: "UPDATE_MESSAGE", payload: updatedChat });
    } else if (audio) {
      console.log(audio);
      const messages = {
        user: "sender",
        html: (
          <audio src={URL.createObjectURL(audio)} controls className="col-12" />
        ),
        attachment: true,
      };
      console.log(messages);

      dispatch({ type: "SEND_MESSAGE", payload: [messages] });

      //update chatbox
      const chatBox = { ...state.chatbox };
      const updatedChat = {};
      updatedChat[chat_id] = [...chatBox[chat_id], { ...messages }];
      console.log(updatedChat);
      dispatch({ type: "UPDATE_MESSAGE", payload: updatedChat });
    }
  };

  return (
    <GroupContext.Provider
      value={{
        groups: state.groups,
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
      }}
    >
      {props.children}
    </GroupContext.Provider>
  );
}

export default GroupAction;
