import "./App.css";
import "./component/Component.css";
// import Setting from "./pages/setting";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Welcome from "./page/Welcome";
// import Login from "./page/Login";
import Register from "./page/Register";
import ForgetPassword from "./page/ForgetPassword";
import InvalidRoute from "./page/InvalidPage";
import GossipPannel from "./component/GossipPanel";
import Shouts from "./page/Shouts";
import Gossipers from "./page/Gossipers";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Welcome />} /> */}


          <Route path="/" element={<GossipPannel />} >

            <Route index element={<Shouts/>}/>
            <Route path="user/gossipers" element={<Gossipers />} />

          </Route>


          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/register" element={<Register />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />

          <Route path="*" element={<InvalidRoute />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
