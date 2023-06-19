import React from "react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
function ShoutFights(props) {
  const messages = [
    {
      user: "user",
      text: "Stop talking so much. only talk with people through the door",
    },
    {
      user: "sender",
      text: "Stop talking so much. Not just to strangers, but also to friends and family members as well.Don't answer your door. Only talk with people through the door",
    },
    {
      user: "user",
      text: "Stop talking so much. Not just to strangers, but also to friends and family members as well.Don't answer your door. Only talk with people through the door",
    },
    {
      user: "user",
      text: "Stop talking so much.Only talk with people through the door",
    },
    {
      user: "sender",
      text: "Stop talking so much. the door",
    },
    {
      user: "user",
      text: "Stop talking so much. Not just to strangers, but also to friends and family members as well.Don't answer your door. Only talk with people through the door",
    },
    {
      user: "user",
      text: "Stop talking so much.Only talk with people through the door",
    },
    {
      user: "sender",
      text: "Stop talking so much. the door",
    },
  ];
  return (
    <div className="container shadow-lg " id="shout_fights">
      <div className="row position-relative">
        <button
          className="d-block d-md-none mt-5 btn btn-sm text-light position-absolute top-0 start-0"
          onClick={props.onCloseClick}
        >
          <ExpandMoreIcon />
        </button>
        <div className="col-12 py-5 messages">
          <div className="container-fluid py-5 py-md-auto" id="chat_body">
            {messages.map((e, i) =>
              e.user === "user"?.toLowerCase() ? (
                <>
                  <div key={i} className="row mb-4 text-start">
                    <div className="col-8">
                      <div className="">
                        <p>{e.text}</p>
                        <time>{e.user}</time>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div key={i} className="row mb-4">
                    <div className="col-8 ms-auto text-end">
                      <div className="">
                        <p>{e.text}</p>
                        <time>{e.user}</time>
                      </div>
                    </div>
                  </div>
                </>
              )
            )}
          </div>
        </div>
        <div className="col px-0 mt-auto">
          <div className="chat-input input-group">
            <button className="btn btn-success">
              <AttachFileIcon />
            </button>
            <input
              type="text"
              className="form-control"
              placeholder="Type your message..."
            />
            <button className="btn btn-success">
              <SendIcon />
            </button>
            <button className="btn btn-success">
              <MicIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoutFights;
