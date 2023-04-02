import React, { useEffect } from 'react'
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { storage } from './firebase';
import { deleteObject, getDownloadURL as getStorageDownloadURL, ref, uploadBytes } from 'firebase/storage';

import './Profile.css'
const Profile = () => {
    const { roomId } = useParams()
    const [isrc, setIsrc] = useState("https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png");
    const [edit, setEdit] = useState(false)
    const BUCKET_URL = 'gs://whatsapp-clone-e7c86.appspot.com'
    useEffect(() => {
        if(!edit){
            async function uploadImage() {
                const storageRef = ref(storage, `${BUCKET_URL}/${roomId}.jpg`)
                await uploadBytes(storageRef, isrc);
            }
        
         uploadImage();
         setEdit(true);
        }
    }, [])
    
    useEffect(() => {
         async function replaceImage() {
            await uploadBytes(ref(storage,`${BUCKET_URL}/${roomId}.jpg`),isrc)
        }
        replaceImage();
    }, [isrc])
    useEffect( ()=>{
        async function fetchData(){
            await getStorageDownloadURL(ref(storage,`${BUCKET_URL}/${roomId}.jpg`)).then(downloadurl=>setIsrc(downloadurl));
      }
      fetchData();
    }, [])
    
    console.log(getStorageDownloadURL(ref(storage,`${BUCKET_URL}/${roomId}.jpg`)))
    return (
        <div className='profile'>
            <div className='profile__img__container' ><img className="profile__img" src={""}/></div>
            <form>
                <label for="img">Select image:</label>
                <input type="file" id="img" hidden name="img" accept="image/*" onInput={e=>console.log(e.target.files[0])}/>
                {/* <button type="submit" /> */}
            </form>
        </div >
    )
}

export default Profile