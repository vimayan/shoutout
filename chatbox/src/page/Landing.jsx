import React from "react";
import Group from "../data/Social-bro.svg";
import "./page.css";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="container-fluid" id="Landing">
      <div className="row">
        <div className="col pt-5 mt-5 d-none d-md-block">
          <p className="mt-5">Lets SHOUT TOGether!</p>
        </div>
        <img
          className="img-fluid col-10 col-md-6  col-lg-4 mx-auto ms-sm-auto"
          src={Group}
          alt="..."
        />
      </div>
      <div className="row mt-4">
        <div className="col-10 col-md-6 col-lg-4 ms-auto">
          <Link to={"/register"} className="btn btn-success">
            Register
          </Link>
          <Link to={"/login"} className="btn btn-warning">
            Login
          </Link>
        </div>
      </div>
      <div className="position-fixed bottom-0 end-0 ">
        <p className="d-flex flex-column gap-2 text-start text-white me-5">
          <span className="border rounded-3 py-1 px-1">newuser1@gmail.com</span>
          <span className="border rounded-3 py-1 px-1">newuser1</span>
        </p>
      </div>
    </div>
  );
}

export default Landing;
