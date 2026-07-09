import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBGn36agS0YeI8KUTIzgWKSy-TEBhq71Cs",
  authDomain: "team-workspace-crm.firebaseapp.com",
  projectId: "team-workspace-crm",
  storageBucket: "team-workspace-crm.firebasestorage.app",
  messagingSenderId: "370576887024",
  appId: "1:370576887024:web:3cc25c61c01eaee7a0c635",
  measurementId: "G-WXTTQQ61JL"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
