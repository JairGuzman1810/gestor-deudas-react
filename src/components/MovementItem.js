import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";

const MovementItem = ({ movement }) => {
  return (
    <View style={styles.cardContainer}>
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
            ${movement.importe.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}
          </Text>
          <Text
            style={[styles.text, { textAlign: "center", color: "#878585" }]}
          >
            {movement.descripcion}
          </Text>
          <Text style={[styles.text, styles.rightAlignedText]}>
            {movement.fecha !== undefined && movement.fecha !== 0
              ? new Date(movement.fecha).toLocaleDateString()
              : "--"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    margin: 2,
  },
  cardView: {
    width: "100%",
    backgroundColor: "white",
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
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    flex: 1,
    color: "black",
    paddingHorizontal: 8,
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
  },
  rightAlignedText: {
    textAlign: "right",
  },
});

export default MovementItem;
