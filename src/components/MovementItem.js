import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";

const MovementItem = ({
  movimiento = "$100,000",
  notas = "Como estas",
  fecha = "2024/10/12",
}) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardView}>
        <View style={styles.innerContainer}>
          <Text style={styles.text}>{movimiento}</Text>
          <Text
            style={[styles.text, { textAlign: "center", color: "#878585" }]}
          >
            {notas}
          </Text>
          <Text style={[styles.text, styles.rightAlignedText]}>{fecha}</Text>
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
