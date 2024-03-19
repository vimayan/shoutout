import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import GossipAction from "./context/gossipers/GossipAction";
import GroupAction from "./context/groups/GroupAction";
import UserAction from "./context/user/UserAction";
import ShoutAction from "./context/shouts/ShoutAction";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <UserAction>
    <ShoutAction>
      <GossipAction>
        <GroupAction>
          <App />
        </GroupAction>
      </GossipAction>
    </ShoutAction>
  </UserAction>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
