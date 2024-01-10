/* eslint-disable prettier/prettier */
import { onAuthStateChanged } from "firebase/auth";
import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";

import { FIREBASE_DATABASE, FIREBASE_AUTH } from "./firebaseConfig";
import Routes from "./src/router/Routes";

export default function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Create subscription to auth state changes
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      try {
        if (user) {
          // Usuario autenticado
          setUserLoggedIn(true);
          //console.log("Usuario autenticado");

          // Fetch user data from database
          const db = FIREBASE_DATABASE;
          const userRef = ref(db, `Usuarios/${user.uid}`);
          const snapshot = await get(userRef);

          if (snapshot.exists()) {
            const userData = snapshot.val();
            //console.log("User data:", userData);
            // Check if user has admin privileges
            setIsAdmin(userData.privilegios === "admin");
          } else {
            console.log("User data not found"); //
          }
        } else {
          // Usuario no autenticado
          setUserLoggedIn(false);
          setIsAdmin(false);
          console.log("Usuario no autenticado");
        }
      } catch (error) {
        console.error("Error handling auth state change:", error);
      }
      return unsubscribe();
    });

    // Clean up the effect and stop listening
  }, []); // Empty array ensures listener is set up only once

  return (
    <SafeAreaView style={styles.container}>
      {/* Pasa la información relevante a través de las propiedades */}
      <Routes
        userLoggedIn={userLoggedIn}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
