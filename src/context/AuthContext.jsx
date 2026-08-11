import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "../services/firebase";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function saveUserProfile(firebaseUser, name) {
    await setDoc(
      doc(db, "users", firebaseUser.uid),
      {
        name: name || firebaseUser.displayName || "",
        email: firebaseUser.email,
        createdAt: serverTimestamp()
      },
      { merge: true }
    );
  }

  async function register(name, email, password) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });
    await saveUserProfile(credential.user, name);
    setUser({ ...credential.user, displayName: name });
    return credential.user;
  }

  async function login(email, password) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  }

  async function loginWithGoogle() {
    const credential = await signInWithPopup(auth, googleProvider);
    await saveUserProfile(credential.user);
    return credential.user;
  }

  function logout() {
    return signOut(auth);
  }

  const value = { user, loading, register, login, loginWithGoogle, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
