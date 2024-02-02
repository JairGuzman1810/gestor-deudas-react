/* eslint-disable prettier/prettier */
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { deleteUser, signInWithEmailAndPassword } from "firebase/auth";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
  ToastAndroid,
  Alert,
} from "react-native";

import { FIREBASE_AUTH } from "../../firebaseConfig";
import { decrypt } from "../utils/AESUtils";
import { deleteUserData } from "../utils/UserHelpers";

const UserModal = ({ userSelected, isModalVisible, hideModal, user }) => {
  const navigation = useNavigation();
  console.log(userSelected);

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

  const handleDeleteUser = async () => {
    // Comparar con los valores originales
    try {
      // Iniciar sesión con el usuario
      await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        userSelected.correo,
        decrypt(userSelected.contraseña)
      );

      //Borrar información al db.
      await deleteUserData(userSelected);

      //Actualizar información al auth.
      await deleteUser(FIREBASE_AUTH.currentUser);

      // Cerrar sesión
      await FIREBASE_AUTH.signOut();

      // Iniciar sesión con el usuario
      await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        user.correo,
        decrypt(user.contraseña)
      );

      // Mostrar mensaje de éxito
      showToast("Éxito", "Usuario eliminado correctamente.");

      //Volver
      navigation.reset({
        index: 0,
        routes: [{ name: "MyUsers" }],
      });
    } catch (error) {
      await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        user.correo,
        decrypt(user.contraseña)
      );
      Alert.alert("Error", error.message);
    }
    hideModal();
  };
  return (
    <Modal
      transparent
      animationType="fade"
      visible={isModalVisible}
      onRequestClose={hideModal}
      statusBarTranslucent
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Ionicons name="warning" size={50} color="red" />

          <Text style={styles.title}>Eliminar usuario</Text>
          <Text style={styles.subtitle}>
            {`¿Está seguro de que desea eliminar al usuario "${userSelected.nombre}" de forma permanente?`}
          </Text>

          <View style={{ flexDirection: "row" }}>
            <View style={styles.deleteButton}>
              <TouchableOpacity
                style={styles.touchableOpacity}
                onPress={handleDeleteUser}
              >
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.button}>
              <TouchableOpacity
                style={styles.touchableOpacity}
                onPress={hideModal}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
  },
  title: {
    fontFamily: "Montserrat-Bold",
    textAlign: "center",
    color: "black",
    fontSize: 22,
    marginTop: 10,
  },
  subtitle: {
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
    color: "black",
    fontSize: 16,
    marginTop: 10,
  },
  button: {
    backgroundColor: "#1A7A13",
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    flex: 1,

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
  deleteButton: {
    backgroundColor: "#B11D1D",
    marginTop: 20,
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 20,
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
    color: "white",
    fontSize: 15,
  },
  touchableOpacity: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
});

export default UserModal;
