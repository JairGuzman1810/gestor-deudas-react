import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";

const ChangePassword = () => {
  const navigation = useNavigation();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [hideNewPass, setHideNewPass] = useState(true);
  const [hideRepeatPass, setHideRepeatPass] = useState(true);
  const [hideOldPass, setHideOldPass] = useState(true);

  const handleChangePassword = () => {
    // Add your logic to handle password change here
    // You can use the values in oldPassword, newPassword, and repeatPassword
    navigation.navigate("Home");
  };

  const goBack = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
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
        <Text style={styles.label}>Contraseña Antigua</Text>
        <View style={styles.separator} />
        <View style={styles.input}>
          <Ionicons
            style={styles.iconinput}
            size={20}
            name="lock-closed"
            color="black"
          />
          <TextInput
            style={styles.textinput}
            value={oldPassword}
            onChangeText={(text) => setOldPassword(text)}
            secureTextEntry={!!hideOldPass}
            placeholder="Contraseña Antigua"
          />
          <Ionicons
            size={20}
            name={hideOldPass ? "eye" : "eye-off-sharp"}
            onPress={() => setHideOldPass(!hideOldPass)}
            color="black"
          />
        </View>
      </View>

      {/* New Password */}
      <View style={styles.section}>
        <Text style={styles.label}>Nueva Contraseña</Text>
        <View style={[styles.separator]} />
        <View style={styles.input}>
          <Ionicons
            style={styles.iconinput}
            size={20}
            name="lock-closed"
            color="black"
          />
          <TextInput
            style={styles.textinput}
            value={newPassword}
            onChangeText={(text) => setNewPassword(text)}
            secureTextEntry={!!hideNewPass}
            placeholder="Nueva Contraseña"
          />
          <Ionicons
            size={20}
            name={hideNewPass ? "eye" : "eye-off-sharp"}
            onPress={() => setHideNewPass(!hideNewPass)}
            color="black"
          />
        </View>
      </View>

      {/* Repeat Password */}
      <View style={styles.section}>
        <View style={styles.input}>
          <Ionicons
            style={styles.iconinput}
            size={20}
            name="lock-closed"
            color="black"
          />
          <TextInput
            style={styles.textinput}
            value={repeatPassword}
            onChangeText={(text) => setRepeatPassword(text)}
            secureTextEntry={!!hideRepeatPass}
            placeholder="Repetir Contraseña"
          />
          <Ionicons
            size={20}
            name={hideRepeatPass ? "eye" : "eye-off-sharp"}
            onPress={() => setHideRepeatPass(!hideRepeatPass)}
            color="black"
          />
        </View>
      </View>

      {/* Change Password button */}
      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Cambiar Contraseña</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === "android" ? 30 : 0, // Apply marginTop only on Android
    flex: 1,
    backgroundColor: "#F0F0F0",
  },
  section: {
    margin: 10,
  },
  label: {
    fontFamily: "Montserrat-Bold",
    fontSize: 19,
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
    padding: 15,
    borderRadius: 15,
    alignSelf: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "white",
    fontFamily: "Montserrat-Bold",
    fontSize: 15,
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
    color: "white",
    textAlign: "center",
  },
  titlecontainer: {
    flex: 1,
  },
  iconinput: {
    marginRight: 5,
  },
});

export default ChangePassword;
