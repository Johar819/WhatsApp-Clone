// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyB2oPP2EUtRoRPdt-K1D4BCZHxywnQ9J3o",
  authDomain: "whatsapp-clone-e7c86.firebaseapp.com",
  projectId: "whatsapp-clone-e7c86",
  storageBucket: "whatsapp-clone-e7c86.appspot.com",
  messagingSenderId: "1069584467183",
  appId: "1:1069584467183:web:6a2f55f3ca38979475071a",
  measurementId: "G-VBC25Y3WG9"
};
export const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const provider  = new GoogleAuthProvider();
export {auth , provider};
export default db;