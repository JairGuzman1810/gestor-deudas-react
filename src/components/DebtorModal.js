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

import { deleteDebtor } from "../utils/DebtorHelper";

const DebtorModal = ({ debtor, isModalVisible, hideModal }) => {
  const navigation = useNavigation();

  const showMessageWarning = () => {
    const message = "Mantén presionado el botón para confirmar la eliminación.";

    if (Platform.OS === "android") {
      ToastAndroid.showWithGravityAndOffset(
        message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } else {
      Alert.alert("Advertencia", message);
    }
  };

  const handleUpdateDebtor = async () => {
    // Comparar con los valores originales
    try {
      const result = await deleteDebtor(debtor.uid);

      if (result) {
        console.log("Delete successful");

        if (Platform.OS === "android") {
          ToastAndroid.show("Deudor eliminado con exíto.", ToastAndroid.SHORT);
        } else {
          Alert.alert("Deudor eliminado con exíto.");
        }

        hideModal();
      } else {
        console.log("Delete failed");

        // Display error message for failure
        if (Platform.OS === "android") {
          ToastAndroid.show(
            "Error al borrar al deudor. Inténtelo de nuevo.",
            ToastAndroid.LONG
          );
        } else {
          Alert.alert(
            "Error",
            "No se pudo borrar del deudor. Por favor, inténtelo de nuevo."
          );
        }
      }
    } catch (error) {
      console.error("Error deleting debtor:", error);

      // Handle errors with Toast or Alert
      if (Platform.OS === "android") {
        ToastAndroid.show(
          "Error al borrar al deudor. Inténtelo de nuevo.",
          ToastAndroid.LONG
        );
      } else {
        Alert.alert(
          "Error",
          "No se pudo borrar al deudor. Por favor, inténtelo de nuevo."
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
          <TouchableOpacity onPress={hideModal}>
            <Ionicons name="close" size={30} color="red" />
          </TouchableOpacity>

          <Text style={styles.title}>
            {`Deudor "${debtor.nombre}" seleccionado.`}
          </Text>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("EditDebtor", { debtor, isHome: true });
                hideModal();
              }}
              style={styles.touchableOpacity}
            >
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.deleteButton}>
            <TouchableOpacity
              style={styles.touchableOpacity}
              onLongPress={handleUpdateDebtor}
              onPress={showMessageWarning}
            >
              <Text style={styles.buttonText}>Eliminar</Text>
            </TouchableOpacity>
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
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
  },
  title: {
    fontFamily: "Montserrat-Bold",
    textAlign: "center",
    color: "black",
    fontSize: 20,
    marginTop: 10,
  },
  button: {
    backgroundColor: "#1A7A13",
    marginTop: 20,
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
  deleteButton: {
    backgroundColor: "#B11D1D",
    marginHorizontal: 20,
    marginBottom: 25,
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

export default DebtorModal;
