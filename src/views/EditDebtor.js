/* eslint-disable prettier/prettier */
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ToastAndroid,
  Alert,
} from "react-native";

import { updateDebtor } from "../utils/DebtorHelper";

const formatPhoneNumber = (phoneNumber) => {
  // Elimina cualquier caracter que no sea dígito
  const cleanedNumber = phoneNumber.replace(/\D/g, "");

  // Aplica formato si el número empieza con "+"
  if (phoneNumber.startsWith("+")) {
    const formattedNumber = cleanedNumber.replace(
      /(\d{1,2})(\d{3})(\d{3})(\d{4})/,
      "+$1 $2 $3 $4"
    );
    return formattedNumber;
  }

  // Aplica formato si el número no tiene prefijo de país
  if (cleanedNumber.length === 10) {
    const formattedNumber = cleanedNumber.replace(
      /(\d{3})(\d{3})(\d{4})/,
      "$1 $2 $3"
    );
    return formattedNumber;
  }

  // Si no se cumple ninguna de las condiciones anteriores, devuelve el número sin formato
  return cleanedNumber;
};

const EditDebtor = ({ route }) => {
  const navigation = useNavigation();
  const { debtor, isHome } = route.params;
  const [name, setName] = useState(debtor.nombre);
  const [phoneNumber, setPhoneNumber] = useState(debtor.telefono);
  const [notes, setNotes] = useState(debtor.notas);

  const goBack = () => {
    if (isHome) {
      navigation.navigate("Home");
    } else {
      navigation.navigate("DetailDebtor", { debtor });
    }
  };
  const handleUpdateDebtor = async () => {
    // Comparar con los valores originales
    if (
      name === debtor.nombre &&
      phoneNumber === debtor.telefono &&
      notes === debtor.notas
    ) {
      // Mostrar mensaje indicando que no hay cambios
      if (Platform.OS === "android") {
        ToastAndroid.show(
          "No hay cambios para actualizar.",
          ToastAndroid.SHORT
        );
      } else {
        Alert.alert("No hay cambios para actualizar.");
      }
      return;
    }

    try {
      const result = await updateDebtor(debtor.uid, name, phoneNumber, notes);

      if (result) {
        console.log("Update successful");

        if (Platform.OS === "android") {
          ToastAndroid.show(
            "Información de deudor actualizada.",
            ToastAndroid.SHORT
          );
        } else {
          Alert.alert("Información de deudor actualizada.");
        }

        // Update debtor locally
        const updatedDebtor = {
          ...debtor,
          nombre: name,
          telefono: phoneNumber,
          notas: notes,
        };

        // Check if isHome and navigate accordingly
        if (isHome) {
          navigation.navigate("Home");
        } else {
          navigation.navigate("DetailDebtor", { debtor: updatedDebtor });
        }
      } else {
        console.log("Update failed");

        // Display error message for failure
        if (Platform.OS === "android") {
          ToastAndroid.show(
            "Error al actualizar la información del deudor. Inténtelo de nuevo.",
            ToastAndroid.LONG
          );
        } else {
          Alert.alert(
            "Error",
            "No se pudo actualizar la información del deudor. Por favor, inténtelo de nuevo."
          );
        }
      }
    } catch (error) {
      console.error("Error updating debtor:", error);

      // Handle errors with Toast or Alert
      if (Platform.OS === "android") {
        ToastAndroid.show(
          "Error al actualizar la información del deudor. Inténtelo de nuevo.",
          ToastAndroid.LONG
        );
      } else {
        Alert.alert(
          "Error",
          "No se pudo actualizar la información del deudor. Por favor, inténtelo de nuevo."
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.toolbarContainer}>
          <TouchableOpacity style={styles.toolbarButton} onPress={goBack}>
            <Ionicons name="arrow-back" size={30} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.titlecontainer}>
          <Text style={styles.title}>Editar deudor</Text>
        </View>
      </View>
      {/* Nombre */}
      <View style={styles.section}>
        <View style={styles.input}>
          <Ionicons
            style={styles.iconinput}
            size={20}
            name="person"
            color="black"
          />
          <TextInput
            value={name}
            onChangeText={(text) => setName(text)}
            style={styles.textinput}
            placeholder="Nombre"
          />
        </View>
      </View>
      {/* Telefono */}
      <View style={styles.section}>
        <View style={styles.input}>
          <Ionicons
            style={styles.iconinput}
            size={20}
            name="call"
            color="black"
          />
          <TextInput
            value={phoneNumber}
            inputMode="tel"
            onChangeText={(text) => setPhoneNumber(text)}
            style={styles.textinput}
            placeholder="Teléfono"
          />
        </View>
        <Text style={[styles.formattedTitle]}>Previsualización:</Text>
        <Text style={[styles.formattedPhone]}>
          {phoneNumber
            ? formatPhoneNumber(phoneNumber)
            : "No hay número registrado."}
        </Text>
      </View>
      {/* Notas */}
      <View style={[styles.section]}>
        <View style={[styles.input, { height: "50%" }]}>
          <Ionicons
            style={styles.iconinput}
            size={20}
            name="book"
            color="black"
          />
          <TextInput
            value={notes}
            onChangeText={(text) => setNotes(text)}
            style={styles.textinput}
            placeholder="Notas"
            multiline
          />
        </View>
      </View>
      {/* Change Password button */}
      <View style={name === "" ? styles.buttonDisable : styles.button}>
        <TouchableOpacity
          style={styles.touchableOpacity}
          disabled={name === ""}
          onPress={handleUpdateDebtor}
        >
          <Ionicons
            style={styles.iconinput}
            size={25}
            name="pencil-sharp"
            color={name === "" ? "#808080" : "white"}
          />
          <Text
            style={name === "" ? styles.buttonTextDisable : styles.buttonText}
          >
            Editar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === "android" ? 30 : 0, // Apply marginTop only on Android
    flex: 1,
    backgroundColor: "#F0F0F0",
  },
  textinput: {
    flex: 1,
    fontFamily: "Montserrat-Regular",
    fontSize: 18,
    height: "100%",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    marginHorizontal: 10,
    fontSize: 18,
    flexDirection: "row",
    fontFamily: "Montserrat-Regular",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#1A7A13",
    borderRadius: 15,
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 30,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 4 }, // Adjust the offset if needed
        shadowOpacity: 0.5, // Increase the opacity for a more visible shadow
        shadowRadius: 6, // Adjust the radius if needed
      },
      android: {
        elevation: 4, // Increase the elevation for a more visible shadow
      },
    }),
  },
  buttonText: {
    flex: 1,
    marginLeft: -35,
    color: "white",
    textAlign: "center",
    fontFamily: "Montserrat-Bold",
    fontSize: 15,
  },
  buttonDisable: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    borderRadius: 15,
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 30,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 4 }, // Adjust the offset if needed
        shadowOpacity: 0.5, // Increase the opacity for a more visible shadow
        shadowRadius: 6, // Adjust the radius if needed
      },
      android: {
        elevation: 4, // Increase the elevation for a more visible shadow
      },
    }),
  },
  buttonTextDisable: {
    flex: 1,
    marginLeft: -35,
    color: "#808080",
    textAlign: "center",
    fontFamily: "Montserrat-Bold",
    fontSize: 15,
  },
  header: {
    width: "100%",
    height: 50,
    backgroundColor: "#808080",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  toolbarContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  toolbarButton: {
    marginRight: 10,
  },
  title: {
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
  titlecontainer: {
    flex: 1,
  },
  iconButton: {
    padding: 5,
  },
  iconinput: {
    marginRight: 5,
  },
  section: {
    marginHorizontal: 15,
    marginBottom: 10,
  },
  touchableOpacity: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  formattedPhone: {
    fontFamily: "Montserrat-Regular",
    fontSize: 18,
    color: "#000",
    textAlign: "center",
    marginTop: 5,
  },
  formattedTitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 17,
    color: "#000",
    textAlign: "center",
    marginTop: 5,
  },
});

export default EditDebtor;
