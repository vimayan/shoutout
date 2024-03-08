import React, { useContext, useEffect, useRef, useState } from "react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ClearIcon from "@mui/icons-material/Clear";
import GossipContext from "../context/gossipers/GossipContext";
import UserContext from "../context/user/UserContext";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
function Gossips({ onCloseClick }) {

  const usercontext = useContext(UserContext);
  const {socket,user } = usercontext;

  const gossipContext = useContext(GossipContext);

  const { handleAttachment, removeFile, send, message,chatbox, files,chatId } = gossipContext;
  const [recording, setRecording] = useState(false);
  const audioRef = useRef(null);
  const [text, setText] = useState("");

  const handleMicHold = () => {
    // Start recording
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const mediaRecorder = new MediaRecorder(stream);
          const audioChunks = [];

          mediaRecorder.addEventListener("dataavailable", (event) => {
            audioChunks.push(event.data);
            console.log("pushed");
          });

          mediaRecorder.addEventListener("stop", () => {
            console.log("stopped");
            const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

            send({chat_id:chatId,audio:audioBlob});

            audioChunks.length = 0;
          });

          audioRef.current = mediaRecorder;

          mediaRecorder.start();
          setRecording(true);
          console.log("started");
        })
        .catch((error) => {
          console.log("Error accessing microphone:", error);
        });
    }
  };

  const handleMicRelease = () => {
    // Stop recording
    if (recording && audioRef.current) {
      console.log("released");
      audioRef.current.stop();
      setRecording(false);
    }

    const micButton = document.getElementById("mic-button");
    if (micButton) {
      micButton.blur();
    }
  };

  return (
    <div className="container shadow-lg " id="shout_fights">
      <div className="row position-relative">
        <button
          className="d-block d-md-none mt-5 btn btn-sm text-light position-absolute top-0 start-0"
          onClick={onCloseClick}
        >
          <ExpandMoreIcon />
        </button>
        <div className="col-12 py-5 messages">
          <div className="container-fluid py-5 py-md-auto" id="chat_body">
            {chatbox[chatId] &&
              chatbox[chatId].map((e, i) =>
                e.user === user?._id ? (
                  <div key={i} className="row mb-4 text-start">
                    <div className="col-8">
                      <div className="">
                          {e.html}
                        <p>{e.text}</p>
                        {/* <time>{e.user}</time> */}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={i} className="row mb-4">
                    <div className="col-8 ms-auto text-end">
                      <div className="">
                     
                        {e.html?.type=='img'?<img
                            src={e.html.props.src}
                            alt={e.html.props.alt}
                            height={e.html.props.height}
                          />:<></>}
                            {e.html?.type=='video'?
                            <video>
                              <source controls src={e.html.props.src}
                            alt={e.html.props.alt}
                            height={e.html.props.height}/>
                            </video>
                           :<></>}
                           {e.html?.type=='audio'?<img
                            src={e.html.props.src}
                            alt={e.html.props.alt}
                            height={e.html.props.height}
                          />:<></>}
                        <p>{e.text}</p>
                      </div>
                    </div>
                  </div>
                )
              )}
          </div>
        </div>
        <div className="col px-0 mt-auto">
          <div className="d-flex align-items-center overflow-auto">
            {files.map((file, index) => (
              <div key={index} className="">
                <div className="d-flex">
                  {file.type.split("/")[0]=='image'?<><img
                    src={file.data}
                    alt={"img"}
                    height={"50px"}
                    className="thumbnail"
                  />
                  <ClearIcon
                    className="remove-icon"
                    onClick={() => removeFile(index)}
                  /></>:<></>}
                   {file.type.split("/")[0]=='video'?<><video height={"50px"}  className="thumbnail">
                  <source src={file.data} type={file.type} />
                  Your browser does not support the video tag.
                </video>

                  <ClearIcon
                    className="remove-icon"
                    onClick={() => removeFile(index)}
                  /></>:<></>}
                </div>
              </div>
            ))}
          </div>
          <div className="chat-input input-group">
            <button className="btn btn-success">
              <input
                className="d-none"
                type="file"
                id="upload"
                hidden
                multiple
                onChange={(e) => handleAttachment(e)}
              />
              <label htmlFor="upload">
                {" "}
                <AttachFileIcon />
              </label>
            </button>
            <input
              type="text"
              className="form-control"
              placeholder="Type your message..."
              value={text || ""}
              onChange={(e) => {
                console.log(e.target.value);
                setText(e.target.value);
              }}
            />
            <button
              className="btn btn-success"
              onClick={() => {
                send({text:text,chat_id:chatId});
                setText("");
              }}
            >
              <SendIcon />
            </button>
            <div
              className="btn btn-success"
              id="mic-button"
              onMouseDown={handleMicHold}
              onMouseUp={handleMicRelease}
            >
              <MicIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gossips;
