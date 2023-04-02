import { Chat, DonutLarge, MoreVert, SearchOutlined } from '@mui/icons-material'
import { Avatar, IconButton } from '@mui/material'
import React, { useState, useEffect } from 'react'
import db from './firebase'
import { collection, onSnapshot, query,orderBy } from 'firebase/firestore'

import './Sidebar.css'
import SidebarChat from './SidebarChat'
import { useStateValue } from './StateProvider'
const Sidebar = () => {
    const [{user},dispatch]=useStateValue();
    const [rooms, setRooms] = useState([]);
    const [searchEl, setSearchEl] = useState("");
    useEffect(() => {
        const roomsQuery = query(collection(db,"rooms"),orderBy('lastSeen','desc'));
        const unsubscribe = onSnapshot(roomsQuery,  (snapshot) => {
            setRooms(
                snapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data(),
                }))
            )
        })
        return () => unsubscribe();
    }, [])
    console.log(user)
    return (
        <div className='sidebar'>
            <div className="sidebar__header">
                <IconButton>
                    <Avatar src={user?.photoURL}/>
                </IconButton>
                <div className="sidebar__headerRight">
                    <IconButton>
                        <DonutLarge />
                    </IconButton>
                    <IconButton>
                        <Chat />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>
            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <SearchOutlined />
                    <input placeholder='Search or start new chat' value={searchEl} onChange={e=>setSearchEl(e.target.value)}/>
                </div>
            </div>
            <div className="sidebar__chats" type='text'>
                <SidebarChat addNewChat />
                {
                    rooms.map(room=>{
                        if((room.data.emailArray.includes(user.email) || room.data.createdBy===user.email) && (room.data.name?.toLowerCase())?.includes(searchEl.toLowerCase()))
                            {
                                return <SidebarChat key={room.id} id={room.id} name={room.data.name} imageURL={room.data.imageURL}/>
                            }
                        }
                    )
                }
            </div>
        </div>
    )
}

export default Sidebar