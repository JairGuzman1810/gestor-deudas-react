/* eslint-disable prettier/prettier */
import { onValue, push, ref, set, update } from "firebase/database";
import { Platform, ToastAndroid, Alert } from "react-native";

import { FIREBASE_DATABASE, FIREBASE_AUTH } from "../../firebaseConfig";

// Esta función agrega a una persona que debe dinero a la base de datos
// DebtorHelper.js

export const addDebtor = async (
  name,
  phoneNumber,
  notes,
  setName,
  setPhoneNumber,
  // eslint-disable-next-line prettier/prettier
  setNotes
) => {
  try {
    const user = FIREBASE_AUTH.currentUser;

    if (user) {
      const userUID = user.uid;
      const userDatabaseRef = ref(FIREBASE_DATABASE, `Deudores/${userUID}`);
      const newDebtorRef = push(userDatabaseRef);
      const pushKey = newDebtorRef.key;

      const debtorData = {
        uid: pushKey,
        nombre: name,
        telefono: phoneNumber,
        notas: notes,
        deudaindividual: 0,
        ultimomovimiento: 0,
        creado: new Date().getTime(),
      };

      await set(newDebtorRef, debtorData);

      if (Platform.OS === "android") {
        ToastAndroid.show("Deudor agregado.", ToastAndroid.SHORT);
      } else {
        Alert.alert("Deudor agregado.");
      }

      // Limpia los campos después de la inserción exitosa
      setName("");
      setPhoneNumber("");
      setNotes("");

      console.log(`Debtor data added successfully at key ${pushKey}`);
      return true; // Retorna true si la inserción fue exitosa
    } else {
      console.log("No hay un usuario conectado");
      return false; // Retorna false si no hay un usuario conectado
    }
  } catch (error) {
    console.error("Error al agregar deudor:", error);
    return false; // Retorna false en caso de error durante la inserción
  }
};

export const updateDebtor = async (debtorUID, name, phoneNumber, notes) => {
  try {
    const user = FIREBASE_AUTH.currentUser;

    if (user) {
      const userUID = user.uid;
      const debtorRef = ref(
        FIREBASE_DATABASE,
        `Deudores/${userUID}/${debtorUID}`
      );

      const debtorData = {
        nombre: name,
        telefono: phoneNumber,
        notas: notes,
      };

      await update(debtorRef, debtorData);

      // Limpia los campos después de la actualización exitosa

      console.log(`Debtor data updated successfully for UID ${debtorUID}`);
      return true; // Retorna true si la actualización fue exitosa
    } else {
      console.log("No hay un usuario conectado");
      return false; // Retorna false si no hay un usuario conectado
    }
  } catch (error) {
    console.error("Error al actualizar información de deudor:", error);
    return false; // Retorna false en caso de error durante la actualización
  }
};

export const getAllDebtors = (setDebtors) => {
  const user = FIREBASE_AUTH.currentUser;

  if (user) {
    const userUID = user.uid;
    const userDatabaseRef = ref(FIREBASE_DATABASE, `Deudores/${userUID}`);

    // Setup the real-time listener and get the reference
    const unsubscribe = onValue(userDatabaseRef, (snapshot) => {
      const debtors = snapshot.val();

      if (debtors) {
        setDebtors(debtors);
      } else {
        setDebtors({});
      }
    });

    // Return the reference to the listener
    return unsubscribe;
  } else {
    console.log("No hay un usuario conectado");
    return null; // Return null if no user is connected
  }
};
