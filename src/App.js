
import './App.css';
import Sidebar from './Sidebar';
import Chat from './Chat'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Login  from './Login';
import { useStateValue } from './StateProvider';
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
                <Route path="/rooms/:roomId" element={<Chat />} />
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
