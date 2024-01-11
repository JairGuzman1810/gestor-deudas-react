import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";

const DebtorModal = ({ debtor, isModalVisible, hideModal }) => {
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

          <TouchableOpacity onPress={hideModal} style={styles.button}>
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={hideModal} style={styles.deleteButton}>
            <Text style={styles.buttonText}>Eliminar</Text>
          </TouchableOpacity>
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
    borderRadius: 5,
    marginTop: 40,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#B11D1D",
    borderRadius: 5,
    marginHorizontal: 20,
    marginBottom: 25,
    padding: 15,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "Montserrat-Bold",
    color: "white",
    fontSize: 15,
  },
});

export default DebtorModal;
