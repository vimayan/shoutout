import React, { useContext, useEffect, useState } from "react";
import ContactList from "../component/ContactList";
import Gossips from "../component/Gossips";

function Gossipers() {

  const [isShoutFightOpen, setIsShoutFightOpen] = useState(false);

  const handleListClick = () => {
    setIsShoutFightOpen(!isShoutFightOpen);
  };


  return (
    <div className="container-fluid" id="shouts">
      <div className="row position-relative">
        <div className="d-none d-md-block col-md-7 col-xl-5 mt-auto message">
          <Gossips />
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
            <Gossips onCloseClick={handleListClick} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Gossipers;
