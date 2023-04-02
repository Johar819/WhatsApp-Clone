import { Avatar } from '@mui/material'
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import React, { useState, useEffect } from 'react'
import './SidebarChat.css';
import db, { storage } from './firebase';
import { Link } from 'react-router-dom';
import { useStateValue } from './StateProvider';
import { ref, uploadBytes } from 'firebase/storage';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DialogTitle from '@mui/material/DialogTitle';
import { getDownloadURL as getStorageDownloadURL } from 'firebase/storage';
import { v4 as uuid } from 'uuid';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
const SidebarChat = ({ id, name, imageURL, addNewChat }) => {
  const [{ user }, dispatch] = useStateValue();
  const [messages, setMessages] = useState([])
  const [open, setOpen] = useState(false);
  const [roomName, setRoomName] = useState(null);
  const [file, setFile] = useState(null);
  const [isrc,setIsrc] = useState("");
  const [warning, setWarning] = useState("");
  const [upload , setUpload] = useState(false);
  const [imgBucket, setImgBucket] = useState();

  useEffect(() => {
    if (id) {
      const roomMessageCollection = collection(db, "rooms", id, "messages");
      const roomMessageCollectionQuery = query(roomMessageCollection, orderBy('timestamp', 'desc'))
      onSnapshot(roomMessageCollectionQuery, async (snapshot) => (setMessages(snapshot.docs.map(doc => doc.data()))))
    }
  }, [id])

  const handleClickOpen = () => {
    // setWarning("");
    setOpen(true);
  };
  const handleOnlyClose = () => {
    setOpen(false);
    setWarning("");
    setUpload(false);
    setFile(null);
  }
  const handleClose = async () => {
    // if (roomName) {
    //   const BUCKET_URL = "gs://whatsapp-clone-e7c86.appspot.com";
    //   const unique_id = uuid();
    //   const bucket = `${BUCKET_URL}/${unique_id}.jpg`;
    //   const storageRef = ref(storage, bucket);
    //   await uploadBytes(storageRef, file);
    //   await getStorageDownloadURL(ref(storage, bucket)).then(downloadurl => {
    //     addDoc(collection(db, "rooms"), { name: roomName, createdBy: user.email,createdAt:serverTimestamp(), emailArray: [], imageURL: downloadurl });
    //   });
    // }
    addDoc(collection(db, "rooms"), { name: roomName, createdBy: user.email,createdAt:serverTimestamp(), emailArray: [], imageURL: isrc,lastSeen:serverTimestamp(),bucket:imgBucket });
    setOpen(false);
    setWarning("");
    setUpload(false);
    setFile(null);
  };
useEffect(() => {
  async function fetchData(){
    setWarning("Please Wait...")
    const BUCKET_URL = "gs://whatsapp-clone-e7c86.appspot.com";
    const unique_id = uuid();
    const bucket = `${BUCKET_URL}/${unique_id}.jpg`;
    const storageRef = ref(storage, bucket);
    await uploadBytes(storageRef, file);
    await getStorageDownloadURL(ref(storage, bucket)).then(downloadurl => {
      setIsrc(downloadurl);
      setUpload(true);
      setWarning("Uploaded");
      setImgBucket(`${BUCKET_URL}/${unique_id}.jpg`);
    });
  }
if(file){
  fetchData();
}
}, [file])


  return (!addNewChat ? (
    <Link to={`/rooms/${id}`}>
      <div className='sidebarChat'>
        <Avatar src={imageURL} />
        <div className="sidebarChat__info">
          <h2>{name}</h2>
          <p>{messages[0]?.message}</p>
        </div>
      </div>
    </Link>
  )
    : (
      <div className="SidebarChat__info">
        <Button id='create__chat' onClick={handleClickOpen}>
          Create Chat
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Create Chat</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Chat Name"
              type="text"
              fullWidth
              variant="standard"
              helperText={warning}
              onChange={e => setRoomName(e.target.value)}
              required
              />
              {
               file && !upload &&
               <CircularProgress/>
               }
               {
               file && upload &&
               <CheckCircleIcon style={{color:"green"}}/>
               }
            <label for='file'>
            {<CameraAltIcon />} <br /> Upload your Profile Pic
            </label>
            <input type="file"  id='file' onInput={e => setFile(e.target.files[0])} required/>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleOnlyClose} id='create__cancel'>Cancel</Button>
            <Button disabled={!upload || roomName.length===0} onClick={handleClose} id='create__submit'>Create</Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  )
}

export default SidebarChat