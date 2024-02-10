// components/DrawerContent.js
import Ionicons from "@expo/vector-icons/Ionicons";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useFonts } from "expo-font";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

import { FIREBASE_AUTH } from "../../firebaseConfig";
import { lightColors, darkColors } from "../colors";

const DrawerContentUser = (props) => {
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === "light" ? lightColors : darkColors;
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
    // Agrega aquí la lógica para cambiar la contraseña
    props.navigation.navigate("ChangePassword");
  };

  return (
    <DrawerContentScrollView
      style={[
        styles.drawerContent,
        { backgroundColor: themeColors.backgroundDrawer },
      ]}
      {...props}
    >
      <View style={styles.userInfoContainer}>
        <View>
          <Image
            style={styles.image}
            source={require("../images/logotwins.png")}
          />
        </View>
        <Text style={[styles.userinfo, { color: themeColors.text }]}>
          {user.nombre}
        </Text>
        <Text
          style={[
            styles.userinfo,
            { marginBottom: 10, color: themeColors.text },
          ]}
        >
          {user.correo}
        </Text>
      </View>
      {/* Container para Cambiar Contraseña y Cerrar Sesión */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.actionItem}
          onPress={handleChangePassword}
        >
          <Ionicons name="lock-open" size={24} color={themeColors.icon} />
          <Text style={[styles.actionText, { color: themeColors.text }]}>
            Cambiar Contraseña
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem} onPress={handleLogout}>
          <Ionicons name="log-out" size={24} color={themeColors.icon} />
          <Text style={[styles.actionText, { color: themeColors.text }]}>
            Cerrar Sesión
          </Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    borderColor: "#000",
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

export default DrawerContentUser;
