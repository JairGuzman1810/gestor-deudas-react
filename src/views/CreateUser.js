/* eslint-disable prettier/prettier */
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

import { FIREBASE_AUTH } from "../../firebaseConfig";
import { addUser } from "../utils/UserHelpers";

const CreateUser = ({ user }) => {
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [hidePass, setHidePass] = useState(true);
  const [hideRepeatPass, setHideRepeatPass] = useState(true);

  const showToast = (title, message) => {
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravityAndOffset(
        message,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } else {
      Alert.alert(title, message);
    }
  };

  const createAccount = async () => {
    if (password !== repeatPassword) {
      showToast("Error", "Las contraseñas no coinciden");
      return;
    }

    try {
      // Crear cuenta en Firebase Auth
      await createUserWithEmailAndPassword(auth, email, password);

      //Agregar información a la bd.
      await addUser(name, email, password);

      // Cerrar sesión
      await auth.signOut();

      // Iniciar sesión con el admin usuario
      await signInWithEmailAndPassword(auth, user.correo, user.contraseña);

      // Mostrar mensaje de éxito
      showToast("Éxito", "Usuario creado correctamente");
    } catch (error) {
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
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.toolbarContainer}>
          <TouchableOpacity style={styles.toolbarButton} onPress={goBack}>
            <Ionicons name="arrow-back" size={30} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.titlecontainer}>
          <Text style={styles.title}>Nuevo usuario</Text>
        </View>
      </View>

      {/* Nombre */}
      <View style={styles.contentcontainer}>
        <Text style={styles.contenttitle}>Nombre</Text>
        <View style={styles.separator} />
      </View>
      <View style={styles.section}>
        <View style={styles.input}>
          <Ionicons
            style={styles.iconinput}
            size={20}
            name="person"
            color="black"
          />
          <TextInput
            value={name}
            onChangeText={(text) => setName(text)}
            style={styles.textinput}
            placeholder="Nombre"
          />
        </View>
      </View>

      {/* Correo */}
      <View style={styles.contentcontainer}>
        <Text style={styles.contenttitle}>Correo</Text>
        <View style={styles.separator} />
      </View>

      <View style={styles.section}>
        <View style={styles.input}>
          <Ionicons
            style={styles.iconinput}
            size={20}
            name="mail"
            color="black"
          />
          <TextInput
            value={email}
            inputMode="email"
            onChangeText={(text) => setEmail(text)}
            style={styles.textinput}
            placeholder="Correo"
          />
        </View>
      </View>
      {/* New Password */}
      <View style={styles.section}>
        <Text style={styles.contenttitle}>Contraseña</Text>
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
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={!!hidePass}
            placeholder="Nueva Contraseña"
          />
          <Ionicons
            size={20}
            name={hidePass ? "eye" : "eye-off-sharp"}
            onPress={() => setHidePass(!hidePass)}
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
      <View
        style={
          name === "" ||
          email === "" ||
          password === "" ||
          repeatPassword === ""
            ? styles.buttonDisable
            : styles.button
        }
      >
        <TouchableOpacity
          onPress={createAccount}
          disabled={
            name === "" ||
            email === "" ||
            password === "" ||
            repeatPassword === ""
          }
          style={styles.touchableOpacity}
        >
          <Text
            style={
              name === "" ||
              email === "" ||
              password === "" ||
              repeatPassword === ""
                ? styles.buttonTextDisable
                : styles.buttonText
            }
          >
            GUARDAR
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateUser;

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === "android" ? 30 : 0, // Apply marginTop only on Android
    flex: 1,
    backgroundColor: "#F0F0F0",
  },
  header: {
    width: "100%",
    height: 50,
    backgroundColor: "#808080",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
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
    marginLeft: -10,
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
    color: "#000",
  },
  separator: {
    height: 1,
    backgroundColor: "#878585",
    marginTop: 5,
    marginBottom: 10,
  },
  section: {
    marginHorizontal: 15,
    marginBottom: 10,
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
    backgroundColor: "#4e9316",
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
