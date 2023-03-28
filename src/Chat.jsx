import { AttachFile, InsertEmoticon, Mic, MoreVert, SearchOutlined } from '@mui/icons-material';
import { Avatar, IconButton } from '@mui/material'
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import './Chat.css'
import db from './firebase';
import { useStateValue } from './StateProvider';

function Chat() {
    const [{user},dispatch] = useStateValue();
    const [seed, setSeed] = useState("");
    const [input, setInput] = useState("")
    const { roomId } = useParams();
    const [roomName, setRoomName] = useState("");
    const [messages, setMessages] = useState([])
    useEffect(() => {
        if (roomId) {
            const roomRef = doc(db, "rooms", roomId);
            onSnapshot(roomRef, (snaphot) => {
                setRoomName(snaphot.data().name)
            });
            const roomMessageCollection = collection(db, "rooms", roomId, "messages");
            const roomMessageCollectionQuery = query(roomMessageCollection,orderBy('timestamp','asc'))
            onSnapshot(roomMessageCollectionQuery, async (snapshot) => (setMessages(snapshot.docs.map(doc => doc.data()))))
        }
    }, [roomId])

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5));
    }, [roomId])
    const sendMessage = (e) => {
        e.preventDefault();
        console.log(input);
        addDoc(collection(db,'rooms',roomId,"messages"),{message:input,name:user.displayName,timestamp:serverTimestamp()})
        setInput("");
    }
    console.log(user);
    return (
        <div className='chat'>

            <div className="chat__header">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                <div className="chat__headerInfo">
                    <h3>{roomName}</h3>
                    <p>Last seen at {""}
                    {
                        new Date(messages[messages.length-1]?.timestamp?.toDate()).toUTCString()
                    }
                    </p>
                </div>
                <div className="chat__headerRight">
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>
            <div className="chat__body">
                {messages.map(message => (
                    <p className={`chat__message ${message.name===user.displayName && "chat__receiver"}`}>
                        <span className="chat__name">{message.name}</span>
                       { message.message}
                        <span className="chat__timestamp">
                            {
                                new Date(message.timestamp?.toDate()).toUTCString()
                            }
                        </span>
                    </p>
                ))
                }
            </div>
            <div className="chat__footer">
                <InsertEmoticon />
                <form >
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        type="text" placeholder='Type a meassage' />
                    <button type='submit' onClick={sendMessage}>Send a message</button>
                </form>
                <Mic />
            </div>
        </div>
    )
}

export default Chat