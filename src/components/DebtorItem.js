import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

import DebtorModal from "./DebtorModal";
import { lightColors, darkColors } from "../colors";

const DebtorItem = ({ debtor }) => {
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === "light" ? lightColors : darkColors;
  const navigation = useNavigation();
  const [isHeld, setIsHeld] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handlePress = () => {
    navigation.navigate("DetailDebtor", {
      debtor,
    });
  };

  const handleLongPress = () => {
    setIsHeld(true);
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
    setIsHeld(false);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isHeld
            ? themeColors.backgroundSelected
            : themeColors.backgroundThree,
        },
      ]}
    >
      <View
        style={[
          styles.indicator,
          {
            backgroundColor:
              debtor.deudaindividual === 0
                ? "#30BFBF"
                : debtor.deudaindividual > 0
                  ? "#1A7A13"
                  : "#B11D1D",
          },
        ]}
      />
      <TouchableOpacity
        style={styles.content}
        activeOpacity={0.5}
        onPress={handlePress}
        onLongPress={handleLongPress}
        delayLongPress={500} // Adjust the delay as needed
      >
        <View style={styles.leftcontainer}>
          <Text style={[styles.name, { color: themeColors.text }]}>
            {debtor.nombre}
          </Text>
        </View>
        <View style={styles.rightcontainer}>
          <View style={styles.rightcontent}>
            <Text
              style={[
                styles.amount,
                {
                  color:
                    debtor.deudaindividual === 0
                      ? "#30BFBF"
                      : debtor.deudaindividual > 0
                        ? "#1A7A13"
                        : "#B11D1D",
                },
              ]}
            >
              {parseFloat(debtor.deudaindividual).toLocaleString(undefined, {
                style: "currency",
                currency: "USD", // Puedes cambiarlo según tu moneda
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
            <Text style={styles.date}>
              {debtor.ultimomovimiento !== undefined &&
              debtor.ultimomovimiento !== 0
                ? new Date(debtor.ultimomovimiento).toLocaleString()
                : "--"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <DebtorModal
        debtor={debtor}
        isModalVisible={isModalVisible}
        hideModal={hideModal}
      />
    </View>
  );
};

export default DebtorItem;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 4,
    marginBottom: 5,
    borderRadius: 2,
    flexDirection: "row",
    borderTopStartRadius: 4,
    borderBottomStartRadius: 4,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  content: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  leftcontainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rightcontainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-end", // Align to the right edge
    justifyContent: "center", // Align to the bottom
  },
  rightcontent: {
    alignItems: "flex-end", // Align to the right within the column
    justifyContent: "center", // Align to the bottom
    // Added height property to take up full height
  },
  indicator: {
    width: 6,
    borderTopStartRadius: 4,
    borderBottomStartRadius: 4,
  },
  name: {
    fontFamily: "Montserrat-Bold",
    marginLeft: 10,
    fontSize: 16,
  },
  amount: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    marginBottom: 5, // Adjust as needed
    marginRight: 8,
  },
  date: {
    fontFamily: "Montserrat-Regular",
    marginRight: 8,
    color: "#878585",
    fontSize: 10,
    marginBottom: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
  },
  title: {
    fontFamily: "Montserrat-Bold",
    textAlign: "center",
    color: "black",
    fontSize: 20,
    marginTop: 25,
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
