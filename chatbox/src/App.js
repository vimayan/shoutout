import "./App.css";
import "./component/Component.css";
// import Setting from "./pages/setting";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./page/Login";
import Register from "./page/Register";
import ForgetPassword from "./page/ForgetPassword";
import InvalidRoute from "./page/InvalidPage";
import GossipPannel from "./component/GossipPanel";
import Shouts from "./page/Shouts";
import Gossipers from "./page/Gossipers";
import Landing from "./page/Landing";
import GroupGossips from "./page/GroupGossips";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/register" element={<Register />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />

          <Route path="/:user/" element={<GossipPannel />}>
            <Route index element={<Shouts />} />
            <Route path="gossipers" element={<Gossipers />} />
            <Route path="groups" element={<GroupGossips />} />
            <Route path="settings" element={<Gossipers />} />
          </Route>

          <Route path="*" element={<InvalidRoute />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
