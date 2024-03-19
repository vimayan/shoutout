import React, { useContext, useEffect, useState } from "react";
import ShoutFights from "../component/chatbox/ShoutFights";
import ShoutList from "../component/ShoutLists";
import UserContext from "../context/user/UserContext";
import ShoutContext from "../context/shouts/ShoutContext";

function Shouts() {
  const [isShoutFightOpen, setIsShoutFightOpen] = useState(false);

  const usercontext = useContext(UserContext);
  const {socket,user } = usercontext;
  const shoutcontext = useContext(ShoutContext); 
 
  const {createShout } = shoutcontext;
  const [text,setText] = useState('')

  const handleListClick = () => {
    setIsShoutFightOpen(!isShoutFightOpen);
  };

  // useEffect(() => {
  //   socket.on("offer", (offer, socket_id, user_id) => {
  //     handleOffer({ offer, user_id, socket_id });
  //   });
  //   socket.on("answer", (answer, user_id)=>{
  //     handleRemoteAnswer(answer, user_id)
  //   });

  //   return () => {
  //     // Clean up the event listeners when the component unmounts
  //     socket.off("offer");
  //     socket.off("answer");
  //   };
  // }, []);

  return (
    <div className="container-fluid" id="shouts">
      <div className="row position-relative">
        <div className="d-none d-md-block col-md-6 col-lg-5 col-xl-4 mt-auto message">
          <ShoutFights />
        </div>
        <div
          className={`col col-md-6 col-lg col-xl-5 pt-5 list ${
            isShoutFightOpen ? "d-none d-md-block" : ""
          }`}
        >
          
          <div className="pt-4 col-11 col-md-5 col-lg-5  d-flex align-items-end justify-content-center gap-1 position-absolute z-1">
            <textarea className="col-8" name="" id="" rows="3" value={text} onChange={(e)=>setText(e.target.value)}></textarea>
            <button className="btn btn-danger" onClick={()=>createShout({text:text,username:user['firstname']})}>ShoutOut</button>
          </div>
          <div className="pt-5 d-lg-none"></div>
          <div className="pt-5"></div>
          <ShoutList onItemClick={handleListClick} />
        </div>
      </div>

      <div className="d-md-none position-absolute top-50 start-50 translate-middle bg-dark  col-12">
        {isShoutFightOpen && (
          <div className="mt-5">
            <ShoutFights onCloseClick={handleListClick} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Shouts;
