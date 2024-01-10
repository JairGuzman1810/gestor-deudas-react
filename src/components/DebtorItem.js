import React, { useState } from "react";
import { View, Text, StyleSheet, Platform, Alert } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const DebtorItem = ({ debtor }) => {
  const [isHeld, setIsHeld] = useState(false);

  const handlePress = () => {
    Alert.alert("PRESS");
  };

  const handleLongPress = () => {
    setIsHeld(true);
    // Mostrar un Alert personalizado con opciones
    //TODO CAMBIAR A UNO PERSONALIZADO
    Alert.alert(
      `Deudor "${debtor.nombre}" seleccionado.`,
      "¿Qué acción desea realizar?",
      [
        {
          text: "Cancelar",
          style: "cancel",
          onPress: () => {
            setIsHeld(false);
          },
        },
        {
          text: "Editar",
          onPress: () => {
            // Lógica para editar
            setIsHeld(false);
          },
        },
        {
          text: "Eliminar",
          onPress: () => {
            // Lógica para eliminar
            setIsHeld(false);
          },
          style: "destructive",
        },
      ],
      // eslint-disable-next-line prettier/prettier
      { cancelable: false }
    );
  };
  const handlePressOut = () => {
    if (isHeld) {
      setIsHeld(false);
    }
  };

  return (
    <View
      style={[styles.container, isHeld ? { backgroundColor: "#82E7EB" } : null]}
    >
      <TouchableOpacity
        style={styles.content}
        activeOpacity={0.5}
        onPress={handlePress}
        onLongPress={handleLongPress}
        onPressOut={handlePressOut}
      >
        <View style={styles.leftcontainer}>
          <View
            style={[
              styles.indicator,
              {
                backgroundColor:
                  debtor.deudaindividual === 0
                    ? "#30BFBF" // Color para deudaindividual igual a 0
                    : debtor.deudaindividual > 0
                      ? "#1A7A13" // Color para deudaindividual mayor a 0
                      : "#B11D1D", // Color para deudaindividual menor a 0
              },
            ]}
          />
          <Text style={styles.name}>{debtor.nombre}</Text>
        </View>
        <View style={styles.rightcontainer}>
          <View style={styles.rightcontent}>
            <Text
              style={[
                styles.amount,
                {
                  color:
                    debtor.deudaindividual === 0
                      ? "#30BFBF" // Color para deudaindividual igual a 0
                      : debtor.deudaindividual > 0
                        ? "#1A7A13" // Color para deudaindividual mayor a 0
                        : "#B11D1D", // Color para deudaindividual menor a 0
                },
              ]}
            >
              $
              {debtor.deudaindividual.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
            <Text style={styles.date}>
              {debtor.ultimomovimiento !== 0
                ? new Date(debtor.ultimomovimiento).toLocaleString()
                : "--"}{" "}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
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
    fontFamily: "Montserrat-Regular",
    marginRight: 8,
    color: "#878585",
    fontSize: 10,
    marginBottom: 4,
  },
});
