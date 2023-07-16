import React, { useContext, useEffect, useState } from "react";
import ShoutFights from "../component/ShoutFights";
import ContactList from "../component/ContactList";
import GossipContext from "../context/gossipers/GossipContext";

function Gossipers() {
  const gossipContext = useContext(GossipContext);

  const { setChat,contacts } = gossipContext;
  const [isShoutFightOpen, setIsShoutFightOpen] = useState(false);

  const handleListClick = () => {
    setIsShoutFightOpen(!isShoutFightOpen);
  };
  useEffect(() => {
    setChat(contacts[0].user_id)
  },[]);
  return (
    <div className="container-fluid" id="shouts">
      <div className="row position-relative">
        <div className="d-none d-md-block col-md-7 col-xl-5 mt-auto message">
          <ShoutFights/>
        </div>
        <div
          className={`col col-md-5 col-xl-4 pt-5 list ${
            isShoutFightOpen ? "d-none d-md-block" : ""
          }`}
        >
          <div className="pt-5 d-lg-none"></div>
          <ContactList onItemClick={handleListClick} />
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

export default Gossipers;
