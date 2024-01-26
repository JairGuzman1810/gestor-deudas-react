import Ionicons from "@expo/vector-icons/Ionicons";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useFonts } from "expo-font";
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

import { FIREBASE_AUTH } from "../../firebaseConfig";

const DrawerContentAdmin = (props) => {
  const { user } = props; // Obtén el objeto de usuario de las propiedades
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
    props.navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const handleChangePassword = () => {
    props.navigation.navigate("ChangePassword");
  };

  const handleCreateUser = () => {
    props.navigation.navigate("CreateUser");
  };

  const handleMyUsers = () => {
    props.navigation.navigate("MyUsers");
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
        <Text style={styles.userinfo}>{user.nombre}</Text>
        <Text style={[styles.userinfo, { marginBottom: 10 }]}>
          {user.correo}
        </Text>
      </View>
      {/* Container para Cambiar Contraseña y Cerrar Sesión */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionItem} onPress={handleMyUsers}>
          <Ionicons name="person" size={24} color="black" />
          <Text style={styles.actionText}>Mis Usuarios</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem} onPress={handleCreateUser}>
          <Ionicons name="person-add" size={24} color="black" />
          <Text style={styles.actionText}>Crear Usuarios</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionItem}
          onPress={handleChangePassword}
        >
          <Ionicons name="lock-open" size={24} color="black" />
          <Text style={styles.actionText}>Cambiar Contraseña</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem} onPress={handleLogout}>
          <Ionicons name="log-out" size={24} color="black" />
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
