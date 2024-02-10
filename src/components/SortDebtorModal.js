/* eslint-disable prettier/prettier */
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  useColorScheme,
} from "react-native";

import { lightColors, darkColors } from "../colors";

const SortDebtorModal = ({
  isModalVisible,
  hideModal,
  sortingOrder,
  setSortingOrder,
  selectedOption,
  setSelectedOption,
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

    setSelectedOption(option);

    // Update sortingOrder with the new value
    const newSortingOrder = sortingOrder === "Asc" ? "Desc" : "Asc";
    setSortingOrder(newSortingOrder);

    // Guardar selectedOption y sortingOrder en un nuevo objeto
    const sortingValuesObject = {
      selectedOption: option,
      sortingOrder: newSortingOrder,
    };

    // Actualizar el estado con el nuevo objeto
    console.log(sortingValuesObject);
    setSortingValues(sortingValuesObject);

    // Guardar el objeto en AsyncStorage
    try {
      await AsyncStorage.setItem(
        "sortingValues",
        JSON.stringify(sortingValuesObject)
      );
    } catch (error) {
      console.error("Error saving data to AsyncStorage:", error);
    }

    // Resto de tu lógica...
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
              Ordenar ({sortingOrder}):
            </Text>

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
                        color: themeColors.text,
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

export default SortDebtorModal;
