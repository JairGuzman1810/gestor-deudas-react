/* eslint-disable prettier/prettier */
import { get, push, ref, set } from "firebase/database";

import { FIREBASE_DATABASE, FIREBASE_AUTH } from "../../firebaseConfig";
import { updateDebtorDetails } from "./DebtorHelper";

export const fetchMovements = async (debtor) => {
  const user = FIREBASE_AUTH.currentUser;
  if (user) {
    const userRef = ref(
      FIREBASE_DATABASE,
      `Movimientos/${user.uid}/${debtor.uid}`
    );
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("User data not found");
      return {};
    }
  } else {
    console.log("No hay un usuario conectado");
    return {};
  }
};

export const addMovement = async (amount, description, date, debtor) => {
  try {
    const user = FIREBASE_AUTH.currentUser;

    if (user) {
      const userUID = user.uid;
      const userDatabaseRef = ref(
        FIREBASE_DATABASE,
        `Movimientos/${userUID}/${debtor.uid}`
      );
      const newDebtorRef = push(userDatabaseRef);
      const pushKey = newDebtorRef.key;

      const creado = new Date().getTime();

      const debtorData = {
        importe: parseFloat(amount),
        descripcion: description,
        fecha: new Date(date).getTime(),
        uid: pushKey,
        usuario: userUID,
        deudor: debtor.uid,
        creado,
      };

      await set(newDebtorRef, debtorData);

      const deudaindividual =
        parseFloat(debtor.deudaindividual) + parseFloat(amount);

      const result = await updateDebtorDetails(
        debtor.uid,
        creado,
        deudaindividual
      );

      if (result) {
        console.log("Update successful");
        console.log(`Movement data added successfully at key ${pushKey}`);

        // Actualizar el objeto 'debtor' con los nuevos campos
        debtor.creado = creado;
        debtor.deudaindividual = deudaindividual;

        return debtor; // Retorna el objeto 'debtor' actualizado
      } else {
        console.log("Update failed");
        return null; // Retornar null si la actualización falla
      }
    } else {
      console.log("No hay un usuario conectado");
      return null; // Retorna null si no hay un usuario conectado
    }
  } catch (error) {
    console.error("Error al agregar movimiento:", error);
    return null; // Retorna null en caso de error durante la inserción
  }
};
