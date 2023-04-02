import { Button } from '@mui/material'
import { signInWithPopup } from 'firebase/auth'
import React from 'react'
import { auth, provider } from './firebase'
import './Login.css'
import { actionTypes } from './reducer'
import { useStateValue } from './StateProvider'
const Login = () => {
    const [{user},dispatch]=useStateValue();
    const signIn=()=>{
        signInWithPopup(auth,provider).then(result=>{
            
            dispatch({type:actionTypes.SET_USER,user:result.user});
            sessionStorage.setItem('user',JSON.stringify(result.user));
        }).catch(e=>console.log(e.message))
    }
  return (
    <div className='login'>
        <div className="login__container">
            <img src='https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg' alt="" / >
            <div className="login__text">
                <h1>Sign in to WhatsApp</h1>
            </div>

            <Button onClick={signIn}>
                Sign In With Google
            </Button>
        </div>
    </div>
  )
}

export default Login