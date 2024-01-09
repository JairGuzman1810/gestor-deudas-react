import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { push, ref, set } from "firebase/database";
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

import { FIREBASE_DATABASE, FIREBASE_AUTH } from "../../firebaseConfig";

const NewDebtor = () => {
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [notes, setNotes] = useState("");

  const goBack = () => {
    navigation.navigate("Home");
  };

  // Esta función agrega a una persona que debe dinero a la base de datos
  const addDebtor = async () => {
    // 1. ¿Hay un usuario conectado?
    const user = auth.currentUser;

    // Si hay un usuario conectado,
    if (user) {
      // 2. Obtén el ID de usuario
      const userUID = user.uid;

      // 3. Crea una referencia a la base de datos
      const userDatabaseRef = ref(FIREBASE_DATABASE, `Deudores/${userUID}`);

      // 4. Crea una nueva referencia a la base de datos
      const newDebtorRef = push(userDatabaseRef);

      // 5. Obtén la clave de la nueva referencia
      const pushKey = newDebtorRef.key;

      // 6. Crea un objeto con la información del deudor
      const debtorData = {
        uid: pushKey,
        nombre: name,
        telefono: phoneNumber,
        notas: notes,
        deudaindividual: 0,
        ultimomovimiento: 0,
        creado: new Date().getTime(),
      };

      // 7. Asigna la información del deudor a la nueva referencia
      await set(newDebtorRef, debtorData);

      if (Platform.OS === "android") {
        ToastAndroid.show("Deudor agregado.", ToastAndroid.SHORT);
      } else {
        Alert.alert("Deudor agregado.");
      }

      setName("");
      setPhoneNumber("");
      setNotes("");

      // 8. Imprime un mensaje de éxito
      console.log(`Debtor data added successfully at key ${pushKey}`);
    } else {
      // No hay un usuario conectado
      console.log("No hay un usuario conectado");
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
          <Text style={styles.title}>Nuevo deudor</Text>
        </View>
      </View>
      <View style={styles.content}>
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
        <TouchableOpacity
          disabled={name === ""}
          style={name === "" ? styles.buttonDisable : styles.button}
          onPress={addDebtor}
        >
          <Ionicons
            style={styles.iconinput}
            size={25}
            name="add"
            color={name === "" ? "#808080" : "white"}
          />
          <Text
            style={name === "" ? styles.buttonTextDisable : styles.buttonText}
          >
            Agregar
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
    padding: 15,
    borderRadius: 15,
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 30,
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
    padding: 15,
    borderRadius: 15,
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 30,
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
});

export default NewDebtor;
