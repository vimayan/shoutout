import React,{useContext, useEffect, useState} from "react";
import ShoutFights from "../component/chatbox/ShoutFights";
import Groups from '../component/Groups';
import GroupContext from "../context/groups/GroupContext";
import GroupGossips from "../component/GroupGossips";

function GossipGroups() {
    const [isShoutFightOpen, setIsShoutFightOpen] = useState(false);

    const handleListClick = () => {
      setIsShoutFightOpen(!isShoutFightOpen);
    };

    const groupContext = useContext(GroupContext);

    const { groups,setChat } = groupContext;

    useEffect(() => {
      setChat(groups[0].group_id)
    },[]);
    return (  <div className="container-fluid" id="shouts">
    <div className="row position-relative">
      <div className="d-none d-md-block col-md-7 col-xl-5 mt-auto message">
        <GroupGossips />
      </div>
   <div
        className={`col col-md-5 col-xl-4 pt-5 list ${
          isShoutFightOpen ? "d-none d-md-block" : ""
        }`}
      >
        <div className="pt-5 d-lg-none"></div>
        <Groups onItemClick={handleListClick} />
      </div>

    </div>

    <div className="d-md-none position-absolute top-50 start-50 translate-middle bg-dark  col-12">
    {isShoutFightOpen && (
        <div className="mt-5">
          <GroupGossips onCloseClick={handleListClick}/>
        </div>
      )}
     
      </div>
  </div> );

}

export default GossipGroups;