/* eslint-disable prettier/prettier */
//import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";

import { darkColors, lightColors } from "../colors";

const SortMovementModal = ({
  isModalVisible,
  hideModal,
  sortingValues,
  setSortingValues,
}) => {
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === "light" ? lightColors : darkColors;
  const handlePressOutside = () => {
    // Close the modal when clicking outside
    hideModal();
  };

  const handleSortOptionPress = async (option) => {
    // Toggle sorting order when an option is pressed
    hideModal();

    // Update sortingOrder with the new value
    const newSortingOrder =
      sortingValues.sortingOrder === "Asc" ? "Desc" : "Asc";

    // Guardar selectedOption y sortingOrder en un nuevo objeto
    const sortingValuesObject = {
      selectedOption: option,
      sortingOrder: newSortingOrder,
    };

    setSortingValues(sortingValuesObject);
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
          <View
            style={[
              styles.modalContent,
              { backgroundColor: themeColors.backgroundThree },
            ]}
          >
            <Text style={[styles.title, { color: themeColors.text }]}>
              Ordenar ({sortingValues.sortingOrder}):
            </Text>

            {/* Options */}
            {["Fecha del movimiento", "Fecha de creación", "Deuda"].map(
              (option, index) => (
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
                            option === sortingValues.selectedOption
                              ? "Montserrat-Bold"
                              : "Montserrat-Regular",
                          color: themeColors.text,
                        },
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                </React.Fragment>
              )
            )}
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
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 20,
  },
  title: {
    fontFamily: "Montserrat-Bold",
    textAlign: "center",
    color: "#000",
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

export default SortMovementModal;
