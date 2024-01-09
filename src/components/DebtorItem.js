import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";

const DebtorItem = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.leftcontainer}>
          <View style={[styles.indicator, { backgroundColor: "#878585" }]} />
          <Text style={styles.name}>Deudor</Text>
        </View>
        <View style={styles.rightcontainer}>
          <View style={styles.rightcontent}>
            <Text style={[styles.amount, { color: "#B11D1D" }]}>
              $-2,000.00
            </Text>
            <Text style={[styles.date]}>18/12/2023 10:00:00</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default DebtorItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginHorizontal: 4,
    marginBottom: 5,
    borderRadius: 2,
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
    flexDirection: "row",
    justifyContent: "space-between",
    height: 70,
  },
  leftcontainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rightcontainer: {
    flexDirection: "column",
    alignItems: "flex-end", // Align to the right edge
    justifyContent: "flex-end", // Align to the bottom
  },
  rightcontent: {
    alignItems: "flex-end", // Align to the right within the column
    justifyContent: "flex-end", // Align to the bottom
    height: "100%", // Added height property to take up full height
  },
  indicator: {
    width: 6,
    height: "100%",
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
    // No need for marginBottom or additional styling
    fontFamily: "Montserrat-Regular",
    marginRight: 8,
    color: "#878585",
    fontSize: 10,
    marginBottom: 4,
  },
});
