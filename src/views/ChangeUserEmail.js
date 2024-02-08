/* eslint-disable prettier/prettier */
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword, updateEmail } from "firebase/auth";
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
} from "react-native";

import { FIREBASE_AUTH } from "../../firebaseConfig";
import { decrypt } from "../utils/AESUtils";
import { updateUserEmail } from "../utils/UserHelpers";

const ChangeUserEmail = ({ route }) => {
  const auth = FIREBASE_AUTH;
  const [email, setEmail] = useState("");
  const { userSelected, user } = route.params;
  console.log(user);

  const navigation = useNavigation();

  const goBack = () => {
    setEmail("");
    navigation.navigate("Action", {
      userSelected,
    });
  };

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

  const handleChangeEmail = async () => {
    try {
      // Iniciar sesión con el usuario
      await signInWithEmailAndPassword(
        auth,
        userSelected.correo,
        decrypt(userSelected.contraseña)
      );

      //Actualizar información al auth.
      await updateEmail(auth.currentUser, email);

      //Actualizar información al db.
      await updateUserEmail(userSelected, email);

      // Cerrar sesión
      await auth.signOut();

      // Iniciar sesión con el usuario
      await signInWithEmailAndPassword(
        auth,
        user.correo,
        decrypt(user.contraseña)
      );

      // Mostrar mensaje de éxito
      showToast("Éxito", "Correo actualizado correctamente.");

      //Volver
      navigation.reset({
        index: 0,
        routes: [{ name: "MyUsers" }],
      });
    } catch (error) {
      await signInWithEmailAndPassword(
        auth,
        user.correo,
        decrypt(user.contraseña)
      );
      Alert.alert("Error", error.message);
    }
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
          <Text style={styles.title}>Editar correo</Text>
        </View>
      </View>
      {/* Antiguo Correo */}
      <View style={styles.contentcontainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="mail" size={18} color="black" />
          <Text style={[styles.contenttitle, { marginLeft: 2 }]}>
            Antiguo correo
          </Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.emailcontainer}>
          <Text style={styles.email}>{userSelected.correo}</Text>
        </View>
      </View>
      {/* Nuevo Correo */}
      <View style={styles.contentcontainer}>
        <Text style={styles.contenttitle}>Nuevo Correo</Text>
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
      {/* Change Email button */}
      <View style={email === "" ? styles.buttonDisable : styles.button}>
        <TouchableOpacity
          disabled={email === ""}
          style={styles.touchableOpacity}
          onPress={handleChangeEmail}
        >
          <Text
            style={email === "" ? styles.buttonTextDisable : styles.buttonText}
          >
            ACTUALIZAR
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChangeUserEmail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
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
    color: "#000",
  },
  separator: {
    height: 1,
    backgroundColor: "#878585",
    marginTop: 5,
    marginBottom: 10,
  },
  emailcontainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: "center",
  },
  email: {
    fontFamily: "Montserrat-Regular",
    fontSize: 20,
    color: "#000",
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
