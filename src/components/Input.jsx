import React, { useContext, useState } from "react";
import Attach from "../images/attach.png";
import Image from "../images/gallery.png";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import {
  Timestamp,
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const { data } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);
  const combineId =
    data.user.uid > currentUser.uid
      ? data.user.uid + currentUser.uid
      : currentUser.uid + data.user.uid;
  const handelSend = async () => {
    if (!input) {
      return console.log("Bhosdike kuch likhle isme");
    }
    const chatRes1 = await getDoc(doc(db, "userChats", data.user.uid));
    if (!chatRes1.exists()) {
      await setDoc(doc(db, "userChats", data.user.uid), {});
    }

    if (image) {
      // Uploading Image on the server
      const storageRef = ref(storage, "images/" + uuid());

      const uploadTask = uploadBytesResumable(storageRef, image);
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
          // Handle unsuccessful uploads
        },
        async () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log("File available at", downloadURL);
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                input,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
            await updateDoc(doc(db, "userChats", data.user.uid), {
              [data.chatId + ".userInfo"]: {
                uid: currentUser.uid,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
                lastMessage: "ImageFile",
              },
              [data.chatId + ".date"]: serverTimestamp(),
            });
            await updateDoc(doc(db, "userChats", currentUser.uid), {
              [combineId + ".userInfo"]: {
                uid: data.user.uid,
                displayName: data.user.displayName,
                photoURL: data.user.photoURL,
                lastMessage: input,
              },
              [combineId + ".date"]: serverTimestamp(),
            });
            setImage(null);
            setInput("");
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          input,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
      await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatId + ".userInfo"]: {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          lastMessage: input,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [combineId + ".userInfo"]: {
          uid: data.user.uid,
          displayName: data.user.displayName,
          photoURL: data.user.photoURL,
          lastMessage: input,
        },
        [combineId + ".date"]: serverTimestamp(),
      });
      setImage(null);
      setInput("");
    }
  };

  return (
    <div className="input">
      <input
        type="text"
        value={input}
        placeholder="Type message"
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="send">
        <img height={25} width={25} src={Image} />
        <input
          type="file"
          style={{ display: "none" }}
          onChange={(e) => setImage(e.target.files[0])}
          id="messFile"
        />
        <label htmlFor="messFile">
          <img height={25} width={25} src={Attach} alt="" />
        </label>
        <button onClick={handelSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
