/* eslint-disable prettier/prettier */
import { push, ref, set, update, remove, get } from "firebase/database";

import { deleteAllMovements } from "./MovementsHelper";
import { FIREBASE_DATABASE, FIREBASE_AUTH } from "../../firebaseConfig";

// Esta función agrega a una persona que debe dinero a la base de datos
// DebtorHelper.js

export const addDebtor = async (name, phoneNumber, notes) => {
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

      return true; // Retorna true si la actualización fue exitosa
    } else {
      return false; // Retorna false si no hay un usuario conectado
    }
  } catch (error) {
    console.error("Error al actualizar información de deudor:", error);
    return false; // Retorna false en caso de error durante la actualización
  }
};

export const deleteDebtor = async (debtorUID) => {
  try {
    const user = FIREBASE_AUTH.currentUser;

    if (user) {
      const userUID = user.uid;
      const debtorRef = ref(
        FIREBASE_DATABASE,
        `Deudores/${userUID}/${debtorUID}`
      );

      // Borrar el deudor
      await remove(debtorRef);

      // Borrar todos los movimientos del deudor
      await deleteAllMovements(debtorUID);

      return true; // Retorna true si la eliminación fue exitosa
    } else {
      return false; // Retorna false si no hay un usuario conectado
    }
  } catch (error) {
    console.error("Error al eliminar información de deudor:", error);
    return false; // Retorna false en caso de error durante la eliminación
  }
};

export const getAllDebtors = async () => {
  const user = FIREBASE_AUTH.currentUser;

  if (user) {
    const userUID = user.uid;
    const userDatabaseRef = ref(FIREBASE_DATABASE, `Deudores/${userUID}`);

    try {
      // Obtener los datos en un momento dado
      const snapshot = await get(userDatabaseRef);
      const debtors = snapshot.val();

      if (debtors) {
        return debtors;
      } else {
        return {};
      }
    } catch (error) {
      console.error("Error fetching debtors:", error);
      throw error;
    }
  } else {
    console.log("No hay un usuario conectado");
    return null; // Return null if no user is connected
  }
};
