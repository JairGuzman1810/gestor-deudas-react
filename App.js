/* eslint-disable prettier/prettier */
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";

import { FIREBASE_AUTH } from "./firebaseConfig";
import Routes from "./src/router/Routes";
import { fetchUser } from "./src/utils/UserHelpers";

export default function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Create subscription to auth state changes
    const unsubscribe = onAuthStateChanged(
      FIREBASE_AUTH,
      async (currentUser) => {
        try {
          if (currentUser) {
            // Usuario autenticado
            setUserLoggedIn(true);

            // Consigue la información del usuario y valida si es
            const userData = await fetchUser(currentUser);
            setUser(userData);
          } else {
            // Usuario no autenticado
            setUserLoggedIn(false);
            setUser(null);
          }
        } catch (error) {
          console.error("Error handling auth state change:", error);
        }
        return unsubscribe();
      }
    );

    // Clean up the effect and stop listening
  }, []); // Empty array ensures listener is set up only once

  return (
    <SafeAreaView style={styles.container}>
      {/* Pasa la información relevante a través de las propiedades */}
      <Routes
        userLoggedIn={userLoggedIn}
        user={user}
        setUser={setUser}
        setUserLoggedIn={setUserLoggedIn}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
