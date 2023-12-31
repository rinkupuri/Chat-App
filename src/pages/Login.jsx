import React, { useState, useContext, useEffect } from "react";
import "../App.scss";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { currentUser } = useContext(AuthContext);
  const [errMessage, setErrMessage] = useState("");
  const [err, setErr] = useState(false);
  const nevigate = useNavigate();
  useEffect(() => {
    if (currentUser) {
      return nevigate("/");
    }
  }, []);

  const loginUser = async (e) => {
    e.preventDefault();

    // check all fields are not blank

    if (e.target[0].value === "" && e.target[1].value === "") {
      setErrMessage("All Field required");
      setErr(true);
      const timer = setTimeout(() => {
        setErr(false);
        clearInterval(timer);
      }, 2000);
      return;
    }

    // authenticating user with email and password
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      // login user with login details
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (auth.currentUser) {
        nevigate("/");
      }
    } catch (error) {
      setErr(true);
      setErrMessage("Invalid email and password");
      setInterval(() => {
        setErr(false);
      }, 3000);
    }
  };
  return (
    <div className="container">
      <div className="wraper">
        <span className="logo">Logo</span>
        <span className="title">Login</span>
        <form onSubmit={loginUser}>
          <input type="email" placeholder="Enter Email" />
          <input type="password" placeholder="Enter Password" />

          <button>Login</button>
          {err && <p>{errMessage}</p>}
        </form>
        <p>
          You Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
