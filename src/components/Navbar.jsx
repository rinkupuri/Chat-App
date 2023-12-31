import React, { useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { signOut, getAuth } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import avatar2 from "../images/user.png";
import { ChatContext } from "../context/ChatContext";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const { data, dispatch } = useContext(ChatContext);
  useEffect(() => {
    if (currentUser.photoURL) {
      setImage(currentUser.photoURL);
    } else {
      setImage(avatar2);
    }
  }, [currentUser]);

  const auth = getAuth();
  const nevigate = useNavigate();
  const logoutClick = async () => {
    try {
      dispatch({ type: "CHANGE_USER", payload: {} });
      await signOut(auth);
      nevigate("/login");
    } catch (e) {}
  };
  return (
    <div className="navbar">
      <span className="logo">Logo</span>
      <div className="user">
        <img height={38} width={38} src={image} alt="" />
        <span>{currentUser.displayName}</span>
        <button onClick={logoutClick}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
