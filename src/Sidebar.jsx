import { Chat, DonutLarge, MoreVert, SearchOutlined } from '@mui/icons-material'
import { Avatar, IconButton } from '@mui/material'
import React, { useState, useEffect } from 'react'
import db from './firebase'
import { collection, onSnapshot, query } from 'firebase/firestore'

import './Sidebar.css'
import SidebarChat from './SidebarChat'
import { useStateValue } from './StateProvider'
const Sidebar = () => {
    const [{user},dispatch]=useStateValue();
    const [rooms, setRooms] = useState([])
    useEffect(() => {
        const roomsQuery = query(collection(db,"rooms"));
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
                    <input placeholder='Search or start new chat' />
                </div>
            </div>
            <div className="sidebar__chats" type='text'>
                <SidebarChat addNewChat />
                {
                    rooms.map(room=>(<SidebarChat key={room.id} id={room.id} name={room.data.name} />))
                }
            </div>
        </div>
    )
}

export default Sidebar