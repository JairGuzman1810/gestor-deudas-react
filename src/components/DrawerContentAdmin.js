import Ionicons from "@expo/vector-icons/Ionicons";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useFonts } from "expo-font";
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

import { FIREBASE_AUTH } from "../../firebaseConfig";

const DrawerContentAdmin = (props) => {
  const auth = FIREBASE_AUTH;
  const [fontsLoaded] = useFonts({
    "Montserrat-Bold": require("../fonts/montserratbold.ttf"),
    "Montserrat-Regular": require("../fonts/montserratregular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleLogout = () => {
    // Agrega aquí la lógica de cierre de sesión, como limpiar tokens de autenticación, etc.
    // También puedes reiniciar el estado del isAdmin aquí si es necesario.

    // Navegar de vuelta a la pantalla de inicio (Login)
    auth.signOut();
    props.navigation.navigate("Login");
  };

  const handleChangePassword = () => {
    // Agrega aquí la lógica para cambiar la contraseña
    props.navigation.navigate("ChangePassword");
  };

  return (
    <DrawerContentScrollView style={styles.drawerContent} {...props}>
      <View style={styles.userInfoContainer}>
        <View>
          <Image
            style={styles.image}
            source={require("../images/logotwins.png")}
          />
        </View>
        <Text style={styles.userinfo}>Usuario Prueba</Text>
        <Text style={[styles.userinfo, { marginBottom: 10 }]}>
          jairguzman@igrtec.com
        </Text>
      </View>
      {/* Container para Cambiar Contraseña y Cerrar Sesión */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionItem}>
          <Ionicons name="person" size={24} color="black" />
          <Text style={styles.actionText}>Mis usuarios</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem}>
          <Ionicons name="person-add" size={24} color="black" />
          <Text style={styles.actionText}>Crear usuarios</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionItem}
          onPress={handleChangePassword}
        >
          <Ionicons name="lock-closed-outline" size={24} color="black" />
          <Text style={styles.actionText}>Cambiar Contraseña</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="black" />
          <Text style={styles.actionText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    borderColor: "#000",
    backgroundColor: "#D3D2D2",
  },
  image: {
    height: 80,
    width: 80,
    marginTop: 10,
    borderRadius: 100,
    backgroundColor: "#fff",
    borderColor: "#000",
    borderWidth: 3,
  },
  userInfoContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#878585",
  },
  userinfo: {
    marginTop: 10,
    textAlign: "center",
    fontFamily: "Montserrat-Bold",
    fontSize: 15,
  },
  actionContainer: {
    flex: 1,
    marginTop: 10,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  actionText: {
    marginLeft: 15,
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
  },
});

export default DrawerContentAdmin;