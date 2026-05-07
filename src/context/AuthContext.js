import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/config";
import { syncUser } from "../api/authAPI";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const syncWithBackend = async (firebaseUser, role = "STUDENT") => {
    try {
      const response = await syncUser({
        firebaseUid: firebaseUser.uid,
        name:
          firebaseUser.displayName ||
          firebaseUser.email.split("@")[0],
        email: firebaseUser.email,
        profilePicture: firebaseUser.photoURL,
        role: role,
      });
      setUserProfile(response.data);
      return response.data;
    } catch (error) {
      console.error("Backend sync failed:", error);
      return null;
    }
  };

  const register = async (email, password, name, role = "STUDENT") => {
    const result = await createUserWithEmailAndPassword(
      auth, email, password
    );
    await updateProfile(result.user, { displayName: name });
    const profile = await syncWithBackend(
      { ...result.user, displayName: name },
      role
    );
    return { result, profile };
  };

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(
      auth, email, password
    );
    const profile = await syncWithBackend(result.user);
    return { result, profile };
  };

  const loginWithGoogle = async (role = "STUDENT") => {
    const result = await signInWithPopup(auth, googleProvider);
    const profile = await syncWithBackend(result.user, role);
    return { result, profile };
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserProfile(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await syncWithBackend(user);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};