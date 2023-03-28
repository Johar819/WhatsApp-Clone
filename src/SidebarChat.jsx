import { Avatar } from '@mui/material'
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import React, { useState, useEffect } from 'react'
import './SidebarChat.css';
import db from './firebase';
import { Link } from 'react-router-dom';

const SidebarChat = ({ id, name, addNewChat }) => {
  const [seed, setSeed] = useState("");
  const [messages, setMessages] = useState([])
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5));
  }, [])
  useEffect(() => {
    if(id){
      const roomMessageCollection = collection(db, "rooms", id, "messages");
            const roomMessageCollectionQuery = query(roomMessageCollection,orderBy('timestamp','desc'))
            onSnapshot(roomMessageCollectionQuery, async (snapshot) => (setMessages(snapshot.docs.map(doc => doc.data()))))
    }
  }, [id])
  
  const createChat = () => {
    const roomName = prompt("Please name for chat");
    if (roomName) {
      addDoc(collection(db, "rooms"), { name: roomName });
    }
  }
  return (!addNewChat ? (
    <Link to={`/rooms/${id}`}>
      <div className='sidebarChat'>
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="sidebarChat__info">
          <h2>{name}</h2>
          <p>{messages[0]?.message}</p>
        </div>
      </div>
    </Link>
  )
    : (
      <div onClick={createChat} className="SidebarChat__info">
        <h2>Add New Chat</h2>
      </div>
    )
  )
}

export default SidebarChat