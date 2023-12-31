import React, { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import avatar2 from "../images/user.png";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
const citiesRef = collection(db, "User");

const Search = () => {
  const [err, setErr] = useState(false);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const handelSearch = async (e) => {
    try {
      const q = query(citiesRef, where("displayName", "==", username));
      const querySnapshot = await getDocs(q);
      if (!JSON.stringify(querySnapshot).displayName) {
        setErr(true);
        setUser(null);
      }
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        setErr(false);
        setUser(doc.data());
      });
    } catch (errr) {
      setErr(true);
    }
  };
  const handelKey = (e) => {
    e.code === "Enter" && handelSearch();
  };
  const handelSelect = async (u) => {
    // check wewather the exist or not , if not create
    try {
      dispatch({ type: "CHANGE_USER", payload: user });
      const combineId =
        user.uid > currentUser.uid
          ? user.uid + currentUser.uid
          : currentUser.uid + user.uid;
      const res = await getDoc(doc(db, "chats", combineId));
      if (!res.exists()) {
        // create chat
        await setDoc(doc(db, "chats", combineId), { messages: [] });
        const chatRes1 = await getDoc(doc(db, "userChats", currentUser.uid));
        if (!chatRes1.exists()) {
          await setDoc(doc(db, "userChats", currentUser.uid), {});
        }

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combineId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
            lastMessage: "",
          },
          [combineId + ".date"]: serverTimestamp(),
        });
      }
    } catch (error) {
      console.log(error);
    }
    setUser(null);
    setUsername("");
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          onKeyDown={handelKey}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Find User"
          value={username}
        />
      </div>
      {err && (
        <>
          <div className="userChat">
            <span
              style={{
                width: "100%",
                textAlign: "center",
                marginBottom: "5px",
              }}
            >
              User Not Found
            </span>
          </div>
        </>
      )}
      {user && (
        <>
          <div className="userChat" onClick={handelSelect}>
            {user.photoURL && <img src={user.photoURL} alt="" />}
            {!user.photoURL && <img src={avatar2} alt="" />}
            <div className="userInfo">
              <span>{user.displayName}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Search;
