import { AttachFile, InsertEmoticon, Mic, MoreVert, SearchOutlined } from '@mui/icons-material';
import { Avatar, IconButton } from '@mui/material'
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc,getDoc, deleteDoc } from 'firebase/firestore';
import React, { useState, useEffect, useRef } from 'react'
import { Navigate, useParams } from 'react-router-dom';
import './Chat.css'
import db, { storage } from './firebase';
import { useStateValue } from './StateProvider';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { deleteObject, ref } from 'firebase/storage';
function Chat() {
    const [{ user }, dispatch] = useStateValue();
    const [input, setInput] = useState("")
    const { roomId } = useParams();
    const [roomName, setRoomName] = useState("");
    const [messages, setMessages] = useState([])
    const [newUser, setNewUser] = useState([]);
    const [addNewUser, setAddNewUser] = useState("")
    const [open, setOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [url, setUrl] = useState("")
    const [time, setTime] = useState(null)
    const [createdBy, setCreatedBy] = useState("");
    const [imgBucket ,setImgBucket] = useState("");
    const scrollDiv=useRef(null);
    const navigate = useNavigate();
    useEffect(() => {
        if (roomId) {
            const roomRef = doc(db, "rooms", roomId);
            onSnapshot(roomRef, (snapshot) => {
                // if(snapshot.data().name){
                setRoomName(snapshot.data()?.name)
                // }
                setNewUser(snapshot.data()?.emailArray);
            });
            const roomMessageCollection = collection(db, "rooms", roomId, "messages");
            const roomMessageCollectionQuery = query(roomMessageCollection, orderBy('timestamp', 'asc'))
            onSnapshot(roomMessageCollectionQuery, async (snapshot) => (setMessages(snapshot.docs.map(doc => doc.data()))))
        }
    }, [roomId])

    async function lastSeenTime() {
        const roomRef = doc(db, "rooms", roomId);
        await updateDoc(roomRef, {
            lastSeen: serverTimestamp(),
        });
    }
    const sendMessage = (e) => {
        e.preventDefault();
        // console.log(input);
        addDoc(collection(db, 'rooms', roomId, "messages"), { message: input, name: user.displayName, timestamp: serverTimestamp() })
        lastSeenTime();
        setInput("");
    }
    if(scrollDiv)
    {scrollDiv.current?.scrollIntoView({behavior:"smooth"});}
    const handleDeleteOpen = ()=>{
        setDeleteOpen(true);
    }
    const handleDeleteClose = async()=>{
        const roomRef = doc(db, "rooms", roomId);
        // const roomSnap  = await getDoc(roomRef)
        // if(roomSnap.exists()){
        //     setImgBucket(roomSnap.data().bucket);
        // }
        await deleteDoc(roomRef);
        setDeleteOpen(false);
        navigate('/');
        // const deleteImgRef = ref(storage,imgBucket);
        // console.log(imgBucket)
        // deleteObject(deleteImgRef).then(()=>console.log("file deleted"));    
    }

    
    const handleClickOpen = () => {

        setOpen(true);
    };
    useEffect(() => {
        
        async function fetchData() {
            const roomRef = doc(db, "rooms", roomId);
            await updateDoc(roomRef, {
                emailArray: newUser,
            });
        }
        if(newUser?.length){
            fetchData();
        }
    }, [newUser]);
    const handleClose = () => {
        if (newUser.includes(addNewUser) === false && addNewUser !== "") {
            setNewUser([...newUser, addNewUser]);
        }
        setOpen(false)
        setAddNewUser("");
    };
    useEffect(() => {
        async function fetchData(){
            if (roomId) {
                const roomRef = doc(db, "rooms", roomId);
                const roomSnap  = await getDoc(roomRef);
                if(roomSnap.exists()){
                    setUrl(roomSnap.data().imageURL);
                    setTime(roomSnap.data().createdAt);
                    setCreatedBy(roomSnap.data().createdBy);
                    // console.log(roomSnap.data().imageURL)

                }
                
            }
        }
        fetchData();
    }, [roomId])
    
    return (
        <div className='chat'>
            <div className="chat__header">
                <Avatar src={url} />
                <div className="chat__headerInfo">
                    <h3>{roomName}</h3>
                    <p>Last seen at{" "}
                        {
                            !time? (<LinearProgress color="inherit" style={{width:"80px",height:"10px"}}/>):
                            (

                                messages.length===0? new Date(time?.toDate()).toLocaleString() :
                                new Date(messages[messages.length - 1]?.timestamp?.toDate()).toLocaleString()
                            )
                        }
                    </p>
                </div>
                <div className="chat__headerRight">
                    <IconButton title="Join New Person">
                            <PersonAddAlt1Icon  onClick={handleClickOpen} />
                    </IconButton>
                        <Dialog open={open} onClose={handleClose}>
                            <DialogTitle>Add</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Enter the email address of the person you want to add.
                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="Email Address"
                                    type="email"
                                    fullWidth
                                    variant="standard"
                                    value={addNewUser}
                                    onChange={(e) => { setAddNewUser(e.target.value) }}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose}>Add</Button>
                            </DialogActions>
                        </Dialog>
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    {
                        user.email===createdBy &&
                    <IconButton>
                        <DeleteIcon onClick={handleDeleteOpen}/>
                    </IconButton>
                    }
                        <Dialog open={deleteOpen} >
                            <DialogContent id='delete__chat'>
                                <DialogContentText>Are you sure to delete this Chat</DialogContentText>
                            </DialogContent>
                        <DialogActions>
                            <Button onClick={()=>setDeleteOpen(false)}>No</Button>
                            <Button onClick={handleDeleteClose}>Yes</Button>
                        </DialogActions>
                        </Dialog>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>
            <div className="chat__body">
                {messages.map(message => (
                    <p className={`chat__message ${message.name === user.displayName && "chat__receiver"}`}>
                        <span className="chat__name">{message.name}</span>
                        {message.message}
                        <span className="chat__timestamp">
                            {
                                new Date(message.timestamp?.toDate()).toLocaleString()
                            }
                        </span>
                    </p>
                ))
                }
                <div ref={scrollDiv}></div>
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