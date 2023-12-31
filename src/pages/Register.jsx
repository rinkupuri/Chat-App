import React, { useContext, useState } from "react";
import avtar from "../images/add-user.png";
import "../App.scss";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const [err, setErr] = useState(false);
  const nevigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  if (currentUser) {
    return nevigate("/");
  }

  const handelSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];
    console.log(!!file);
    if (!displayName && !email && !password && !!file) {
      setErr(true);
      const timer = setInterval(() => {
        setErr(false);
        clearInterval(timer);
      }, 2000);
      return;
    }
    try {
      // creting new user with user entered details
      const userCreate = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Uploading Image on the server
      const storageRef = ref(storage, "images/" + userCreate.user.uid + ".png");

      const uploadTask = uploadBytesResumable(storageRef, file);

      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          setErr(true);
          // Handle unsuccessful uploads
        },
        async () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log("File available at", downloadURL);

            // updating user details for authention

            if (!!file) {
              updateProfile(auth.currentUser, {
                displayName: displayName,
                photoURL: downloadURL,
              });
              await setDoc(doc(db, "User", auth.currentUser.uid), {
                displayName,
                email,
                photoURL: downloadURL,
                uid: auth.currentUser.uid,
              });
            } else {
              updateProfile(auth.currentUser, {
                displayName: displayName,
              });
              await setDoc(doc(db, "User", auth.currentUser.uid), {
                displayName,
                email,
                uid: auth.currentUser.uid,
              });
            }
            nevigate("/");
          });
        }
      );
      // redirecting user to home page
    } catch (errr) {
      console.log(errr.message);
      setErr(true);
    }
  };
  return (
    <div className="container">
      <div className="wraper">
        <span className="logo">Logo</span>
        <span className="title">Register</span>
        <form onSubmit={handelSubmit}>
          <input type="name" placeholder="Enter Name" />
          <input type="email" placeholder="Enter Email" />
          <input type="password" placeholder="Enter Password" />
          <input style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <img height={50} src={avtar} alt="" />
            <span>Add an image</span>
          </label>
          <button>Register</button>
          {err && "Something Went Wrong"}
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
