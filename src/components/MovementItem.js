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

import { lightColors, darkColors } from "../colors";

const MovementItem = ({ movement, debtor }) => {
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === "light" ? lightColors : darkColors;
  const navigation = useNavigation();
  const [isHeld, setIsHeld] = useState(false);

  const handleLongPress = async () => {
    setIsHeld(true);
    const timeout = setTimeout(() => {
      setIsHeld(false);
      navigation.navigate("EditMovement", {
        debtor,
        movement,
        isPayment: parseFloat(movement.importe) > 0,
      });
    }, 300);

    return () => clearTimeout(timeout);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onLongPress={handleLongPress}
      delayLongPress={500} // Adjust the delay as needed
      style={[
        styles.cardContainer,
        {
          backgroundColor: isHeld
            ? themeColors.backgroundSelected
            : themeColors.backgroundThree,
        },
      ]}
    >
      <View style={styles.cardView}>
        <View style={styles.innerContainer}>
          <Text
            style={[
              styles.text,
              {
                color:
                  movement.importe === 0
                    ? "#30BFBF" // Color para deudaindividual igual a 0
                    : movement.importe > 0
                      ? "#1A7A13" // Color para deudaindividual mayor a 0
                      : "#B11D1D", // Color para deudaindividual menor a 0
              },
            ]}
          >
            {movement.importe.toLocaleString(undefined, {
              style: "currency",
              currency: "USD", // Puedes cambiarlo según tu moneda
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
          <Text
            style={[
              styles.text,
              { flex: 3, textAlign: "justify", color: "#878585" },
            ]}
          >
            {movement.descripcion}
          </Text>
          <Text
            style={[
              styles.text,
              styles.rightAlignedText,
              { color: themeColors.text },
            ]}
          >
            {movement.fecha !== undefined && movement.fecha !== 0
              ? new Date(movement.fecha).toLocaleDateString()
              : "--"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 4,
    marginBottom: 6,
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
  cardView: {
    width: "100%",
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    paddingHorizontal: 8,
    fontSize: 13.1,
    fontFamily: "Montserrat-Regular",
    textAlignVertical: "center",
  },
  rightAlignedText: {
    textAlign: "right",
  },
});

export default MovementItem;
