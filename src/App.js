
import './App.css';
import Sidebar from './Sidebar';
import Chat from './Chat'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Login  from './Login';
import { useStateValue } from './StateProvider';
import Profile from './Profile';
import './front.css'
const frontPageURL="https://firebasestorage.googleapis.com/v0/b/whatsapp-clone-e7c86.appspot.com/o/FrontPage.jpg?alt=media&token=37b4f666-0f0f-4fbb-80c9-adfe92202c15"
function App() {
  const [{user},dispatch]=useStateValue();
  return (
    <div className="App">
      {
        !user ? (<Login />) : (
          <div className='app__body'>
            <BrowserRouter>
              <Sidebar />
              <Routes>
                <Route path="/" element={<div className='front'><img src={frontPageURL}/></div>}/>
                <Route path="/rooms/:roomId" element={<Chat />} />
                <Route path="/rooms/profile/:roomId" element={<Profile />} />
              </Routes>
            </BrowserRouter>
          </div>

        )
      }
      {/* <h1> Let's build whatsapp-Clone</h1> */}
    </div>
  );
}

export default App;
