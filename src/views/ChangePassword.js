/* eslint-disable prettier/prettier */
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ToastAndroid,
  Alert,
  useColorScheme,
} from "react-native";

import { FIREBASE_AUTH } from "../../firebaseConfig";
import { lightColors, darkColors } from "../colors";
import { updatePass } from "../utils/UserHelpers";

const ChangePassword = ({ user }) => {
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === "light" ? lightColors : darkColors;
  const navigation = useNavigation();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [hideNewPass, setHideNewPass] = useState(true);
  const [hideRepeatPass, setHideRepeatPass] = useState(true);
  const [hideOldPass, setHideOldPass] = useState(true);

  const handleChangePassword = async () => {
    try {
      // Check if new and repeated passwords match
      if (newPassword !== repeatPassword) {
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

      const credential = EmailAuthProvider.credential(user.correo, oldPassword);

      await reauthenticateWithCredential(FIREBASE_AUTH.currentUser, credential);
      // Change the password
      await updatePassword(FIREBASE_AUTH.currentUser, newPassword);

      await updatePass(newPassword);

      // Password changed successfully
      if (Platform.OS === "android") {
        ToastAndroid.show(
          "Contraseña cambiada exitosamente.",
          ToastAndroid.SHORT
        );
      } else if (Platform.OS === "ios") {
        Alert.alert("Éxito", "Contraseña cambiada exitosamente.");
      }

      // Navigate or perform other actions after successful password change
      goBack();
    } catch (error) {
      // Handle any authentication or password change errors
      Alert.alert("Error", error.message);
    }
  };

  const goBack = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
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
          <Text style={styles.title}>Cambiar contraseña</Text>
        </View>
      </View>
      {/* Old Password */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: themeColors.text }]}>
          Contraseña Antigua
        </Text>
        <View style={styles.separator} />
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
            value={oldPassword}
            onChangeText={(text) => setOldPassword(text)}
            secureTextEntry={!!hideOldPass}
            placeholder="Contraseña Antigua"
            placeholderTextColor="#808080"
          />
          <Ionicons
            size={20}
            name={hideOldPass ? "eye" : "eye-off-sharp"}
            onPress={() => setHideOldPass(!hideOldPass)}
            color={themeColors.icon}
          />
        </View>
      </View>

      {/* New Password */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: themeColors.text }]}>
          Nueva Contraseña
        </Text>
        <View style={styles.separator} />
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
            color={themeColors.text}
          />
          <TextInput
            style={[styles.textinput, { color: themeColors.text }]}
            value={newPassword}
            onChangeText={(text) => setNewPassword(text)}
            secureTextEntry={!!hideNewPass}
            placeholder="Nueva Contraseña"
            placeholderTextColor="#808080"
          />
          <Ionicons
            size={20}
            name={hideNewPass ? "eye" : "eye-off-sharp"}
            onPress={() => setHideNewPass(!hideNewPass)}
            color={themeColors.text}
          />
        </View>
      </View>

      {/* Repeat Password */}
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
          oldPassword === "" || newPassword === "" || repeatPassword === ""
            ? styles.buttonDisable
            : styles.button
        }
      >
        <TouchableOpacity
          disabled={
            oldPassword === "" || newPassword === "" || repeatPassword === ""
          }
          onPress={handleChangePassword}
          style={styles.touchableOpacity}
        >
          <Text
            style={
              oldPassword === "" || newPassword === "" || repeatPassword === ""
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    margin: 10,
  },
  label: {
    fontFamily: "Montserrat-Bold",
    fontSize: 17,
  },
  separator: {
    height: 1,
    marginBottom: 20,
    backgroundColor: "#878585",
    marginVertical: 5,
  },
  textinput: {
    flex: 1,
    fontFamily: "Montserrat-Regular",
    fontSize: 18,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    marginHorizontal: 10,
    fontSize: 18,
    flexDirection: "row",
    fontFamily: "Montserrat-Regular",
    alignItems: "center",
    justifyContent: "space-between",
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
  header: {
    width: "100%",
    height: 50,
    backgroundColor: "#808080",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
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
    textAlign: "center",
    color: "#fff",
  },
  titlecontainer: {
    flex: 1,
  },
  iconinput: {
    marginRight: 5,
  },
  touchableOpacity: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
});

export default ChangePassword;
