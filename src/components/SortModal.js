/* eslint-disable prettier/prettier */
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";

const SortModal = ({
  isModalVisible,
  hideModal,
  setDebtors,
  debtors,
  sortingOrder,
  setSortingOrder,
  selectedOption,
  setSelectedOption,
}) => {
  const handlePressOutside = () => {
    // Close the modal when clicking outside
    hideModal();
  };

  const handleSortOptionPress = (option) => {
    // Toggle sorting order when an option is pressed
    setSelectedOption(option);
    setSortingOrder((prevOrder) => (prevOrder === "Asc" ? "Desc" : "Asc"));
    // Actualiza la opción seleccionada

    //hideModal();
  };

  return (
    <Modal
      transparent
      animationType="slide"
      visible={isModalVisible}
      onRequestClose={hideModal}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={handlePressOutside}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Ordenar ({sortingOrder}):</Text>

            {/* Options */}
            {[
              "Alfabeticamente",
              "Fecha del movimiento",
              "Fecha de creación",
              "Deuda",
            ].map((option, index) => (
              <React.Fragment key={index}>
                {index > 0 && <View style={styles.separator} />}
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSortOptionPress(option)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        fontFamily:
                          option === selectedOption
                            ? "Montserrat-Bold"
                            : "Montserrat-Regular",
                      },
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 20,
  },
  title: {
    fontFamily: "Montserrat-Bold",
    textAlign: "center",
    color: "black",
    fontSize: 20,
    marginBottom: 15,
  },
  option: {
    paddingVertical: 15,
  },
  optionText: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: "#C0C0C0",
    marginVertical: 10,
  },
});

export default SortModal;
