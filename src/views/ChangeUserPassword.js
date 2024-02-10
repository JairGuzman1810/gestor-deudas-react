/* eslint-disable prettier/prettier */
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  TextInput,
  ToastAndroid,
  Alert,
  useColorScheme,
} from "react-native";

import { FIREBASE_AUTH } from "../../firebaseConfig";
import { lightColors, darkColors } from "../colors";
import { decrypt } from "../utils/AESUtils";
import { updateUserPassword } from "../utils/UserHelpers";

const ChangeUserPassword = ({ route }) => {
  const colorScheme = useColorScheme();

  const themeColors = colorScheme === "light" ? lightColors : darkColors;

  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [hidePass, setHidePass] = useState(true);
  const [hideOldPass, setHideOldPass] = useState(true);
  const [hideRepeatPass, setHideRepeatPass] = useState(true);
  const { userSelected, user } = route.params;

  const navigation = useNavigation();

  const goBack = () => {
    setHideOldPass(true);
    setHidePass(true);
    setHideRepeatPass(true);
    setPassword("");
    setRepeatPassword("");
    navigation.navigate("Action", {
      userSelected,
    });
  };

  const handleChangeUserPassword = async () => {
    try {
      // Check if new and repeated passwords match
      if (password !== repeatPassword) {
        if (Platform.OS === "android") {
          ToastAndroid.show(
            "Las contraseñas no coinciden.",
            ToastAndroid.SHORT
          );
        } else if (Platform.OS === "ios") {
          Alert.alert("Error", "Las contraseñas no coinciden.");
        }
        return;
      }

      // Reauthenticate the user with their current password

      // Iniciar sesión con el usuario
      await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        userSelected.correo,
        decrypt(userSelected.contraseña)
      );

      // Change the password.
      await updatePassword(FIREBASE_AUTH.currentUser, password);

      //Change db in the password.
      await updateUserPassword(userSelected, password);

      // Cerrar sesión
      await FIREBASE_AUTH.signOut();

      // Iniciar sesión con el usuario
      await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        user.correo,
        decrypt(user.contraseña)
      );

      navigation.reset({
        index: 0,
        routes: [{ name: "MyUsers" }],
      });

      // Password changed successfully
      if (Platform.OS === "android") {
        ToastAndroid.show(
          "Contraseña cambiada exitosamente.",
          ToastAndroid.SHORT
        );
      } else if (Platform.OS === "ios") {
        Alert.alert("Éxito", "Contraseña actualizada exitosamente.");
      }

      // Navigate or perform other actions after successful password change
    } catch (error) {
      // Handle any authentication or password change errors
      Alert.alert("Error", error.message);
      await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        user.correo,
        decrypt(user.contraseña)
      );
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.backgroundTwo }]}
    >
      <View style={styles.header}>
        <View style={styles.toolbarContainer}>
          <TouchableOpacity style={styles.toolbarButton} onPress={goBack}>
            <Ionicons name="arrow-back" size={30} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.titlecontainer}>
          <Text style={styles.title}>Editar contraseña</Text>
        </View>
      </View>
      {/* Antiguo Contraseña */}
      <View style={styles.contentcontainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="lock-closed" size={18} color={themeColors.icon} />
          <Text
            style={[
              styles.contenttitle,
              { marginLeft: 2, color: themeColors.text },
            ]}
          >
            Antigua contraseña
          </Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.passwordcontainer}>
          <Text style={[styles.password, { color: themeColors.text }]}>
            {hideOldPass
              ? decrypt(userSelected.contraseña).replace(/./g, "*")
              : decrypt(userSelected.contraseña)}
          </Text>
          <Ionicons
            style={{ marginHorizontal: 10 }}
            size={20}
            name={hideOldPass ? "eye" : "eye-off-sharp"}
            onPress={() => setHideOldPass(!hideOldPass)}
            color={themeColors.icon}
          />
        </View>
      </View>
      {/* Password */}
      <View style={[styles.section, { marginHorizontal: 8 }]}>
        <Text style={[styles.contenttitle, { color: themeColors.text }]}>
          Nueva contraseña
        </Text>
        <View style={[styles.separator]} />
      </View>
      <View style={styles.section}>
        <View
          style={[
            styles.input,
            { backgroundColor: themeColors.backgroundFirst },
          ]}
        >
          <Ionicons
            style={styles.iconinput}
            size={20}
            name="lock-closed"
            color={themeColors.icon}
          />
          <TextInput
            style={[styles.textinput, { color: themeColors.text }]}
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={!!hidePass}
            placeholder="Nueva Contraseña"
            placeholderTextColor="#808080"
          />
          <Ionicons
            size={20}
            name={hidePass ? "eye" : "eye-off-sharp"}
            onPress={() => setHidePass(!hidePass)}
            color={themeColors.icon}
          />
        </View>
      </View>
      <View style={styles.section}>
        <View
          style={[
            styles.input,
            { backgroundColor: themeColors.backgroundFirst },
          ]}
        >
          <Ionicons
            style={styles.iconinput}
            size={20}
            name="lock-closed"
            color={themeColors.icon}
          />
          <TextInput
            style={[styles.textinput, { color: themeColors.text }]}
            value={repeatPassword}
            onChangeText={(text) => setRepeatPassword(text)}
            secureTextEntry={!!hideRepeatPass}
            placeholder="Repetir Contraseña"
            placeholderTextColor="#808080"
          />
          <Ionicons
            size={20}
            name={hideRepeatPass ? "eye" : "eye-off-sharp"}
            onPress={() => setHideRepeatPass(!hideRepeatPass)}
            color={themeColors.icon}
          />
        </View>
      </View>
      {/* Change Password button */}
      <View
        style={
          password === "" || repeatPassword === ""
            ? styles.buttonDisable
            : styles.button
        }
      >
        <TouchableOpacity
          disabled={password === "" || repeatPassword === ""}
          style={styles.touchableOpacity}
          onPress={handleChangeUserPassword}
        >
          <Text
            style={
              password === "" || repeatPassword === ""
                ? styles.buttonTextDisable
                : styles.buttonText
            }
          >
            ACTUALIZAR
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChangeUserPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: "100%",
    height: 50,
    paddingHorizontal: 10,
    backgroundColor: "#808080",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  toolbarContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  toolbarButton: {
    marginRight: 10,
  },
  title: {
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
    color: "white",
    textAlign: "center",
    marginLeft: -20,
  },
  titlecontainer: {
    flex: 1,
  },
  contentcontainer: {
    padding: 8,
    justifyContent: "space-between",
  },
  contenttitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 17,
  },
  separator: {
    height: 1,
    backgroundColor: "#878585",
    marginTop: 5,
    marginBottom: 10,
  },
  passwordcontainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  password: {
    fontFamily: "Montserrat-Regular",
    fontSize: 20,
    marginHorizontal: 10,
  },
  section: {
    marginHorizontal: 8,
    marginBottom: 10,
  },
  input: {
    borderRadius: 20,
    padding: 15,
    marginHorizontal: 10,
    fontSize: 18,
    flexDirection: "row",
    fontFamily: "Montserrat-Regular",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconinput: {
    marginRight: 5,
  },
  textinput: {
    flex: 1,
    fontFamily: "Montserrat-Regular",
    fontSize: 18,
    height: "100%",
  },
  button: {
    backgroundColor: "#1A7A13",
    borderRadius: 5,
    marginTop: 20,
    marginHorizontal: 50,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 4 }, // Adjust the offset if needed
        shadowOpacity: 0.5, // Increase the opacity for a more visible shadow
        shadowRadius: 6, // Adjust the radius if needed
      },
      android: {
        elevation: 8, // Increase the elevation for a more visible shadow
      },
    }),
  },
  buttonText: {
    fontFamily: "Montserrat-Bold",
    fontSize: 16,
    color: "#fff",
  },
  buttonDisable: {
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginTop: 20,
    marginHorizontal: 50,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 4 }, // Adjust the offset if needed
        shadowOpacity: 0.5, // Increase the opacity for a more visible shadow
        shadowRadius: 6, // Adjust the radius if needed
      },
      android: {
        elevation: 4, // Increase the elevation for a more visible shadow
      },
    }),
  },
  buttonTextDisable: {
    fontFamily: "Montserrat-Bold",
    fontSize: 16,
    color: "#808080",
  },
  touchableOpacity: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
});
