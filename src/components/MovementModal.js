/* eslint-disable prettier/prettier */
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
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

import { deleteMovement } from "../utils/MovementsHelper";
const MovementModal = ({ movement, debtor, isModalVisible, hideModal }) => {
  const navigation = useNavigation();

  const handleDeleteMovement = async () => {
    // Comparar con los valores originales
    try {
      const result = await deleteMovement(debtor, movement);

      if (result) {
        console.log("Delete successful");

        if (Platform.OS === "android") {
          ToastAndroid.show(
            "Movimiento eliminado con exíto.",
            ToastAndroid.SHORT
          );
        } else {
          Alert.alert("Movimiento eliminado con exíto.");
        }

        navigation.reset({
          index: 0,
          routes: [{ name: "DetailDebtor", params: { debtor } }],
        });
        hideModal();
      } else {
        console.log("Delete failed");

        // Display error message for failure
        if (Platform.OS === "android") {
          ToastAndroid.show(
            "Error al borrar el movimiento. Inténtelo de nuevo.",
            ToastAndroid.LONG
          );
        } else {
          Alert.alert(
            "Error",
            "No se pudo borrar el movimiento. Por favor, inténtelo de nuevo."
          );
        }
      }
    } catch (error) {
      console.error("Error deleting movement:", error);

      // Handle errors with Toast or Alert
      if (Platform.OS === "android") {
        ToastAndroid.show(
          "Error al borrar el movimiento. Inténtelo de nuevo.",
          ToastAndroid.LONG
        );
      } else {
        Alert.alert(
          "Error",
          "No se pudo borrar el movimiento. Por favor, inténtelo de nuevo."
        );
      }
    }
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

          <Text style={styles.title}>Eliminar movimiento</Text>
          <Text style={styles.subtitle}>
            ¿Está seguro de que desea eliminar este archivo de forma permanente?
          </Text>

          <View style={{ flexDirection: "row" }}>
            <View style={styles.deleteButton}>
              <TouchableOpacity
                onPress={handleDeleteMovement}
                style={styles.touchableOpacity}
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

export default MovementModal;
