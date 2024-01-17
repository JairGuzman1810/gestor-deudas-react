/* eslint-disable prettier/prettier */
import { get, push, ref, set, update, remove } from "firebase/database";

import { updateDebtorDetails } from "./CommonHelper";
import { FIREBASE_DATABASE, FIREBASE_AUTH } from "../../firebaseConfig";

export const fetchMovements = async (debtor) => {
  const user = FIREBASE_AUTH.currentUser;
  if (user) {
    const userRef = ref(
      FIREBASE_DATABASE,
      `Movimientos/${user.uid}/${debtor.uid}`
    );
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const movementsData = snapshot.val();

      // Convert the object values to an array and sort by 'fecha' in descending order
      const sortedMovements = Object.values(movementsData).sort(
        (a, b) => b.fecha - a.fecha
      );

      return sortedMovements;
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
        debtor.ultimomovimiento = creado;
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

export const updateMovement = async (
  movement,
  debtor,
  amount,
  description,
  date
) => {
  try {
    const user = FIREBASE_AUTH.currentUser;

    if (user) {
      const userUID = user.uid;
      const movementRef = ref(
        FIREBASE_DATABASE,
        `Movimientos/${userUID}/${movement.deudor}/${movement.uid}`
      );

      const movementData = {
        importe: parseFloat(amount),
        descripcion: description,
        fecha: date.getTime(),
      };

      await update(movementRef, movementData);

      const amountupdate =
        parseFloat(debtor.deudaindividual) -
        parseFloat(movement.importe) +
        parseFloat(amount);

      // Limpia los campos después de la actualización exitosa

      const result = await updateDebtorDetails(
        debtor.uid,
        new Date().getTime(),
        amountupdate
      );

      if (result) {
        console.log("Update successful");
        // Actualizar el objeto 'debtor' con los nuevos campos

        debtor.deudaindividual = amountupdate;

        return debtor; // Retorna el objeto 'debtor' actualizado
      } else {
        console.log("Update failed");
        return null; // Retornar null si la actualización falla
      }
    } else {
      return null; // Retorna false si no hay un usuario conectado
    }
  } catch (error) {
    console.error("Error al actualizar información del movimiento:", error);
    return null; // Retorna false en caso de error durante la actualización
  }
};

export const deleteAllMovements = async (debtorUID) => {
  try {
    const user = FIREBASE_AUTH.currentUser;

    if (user) {
      const userUID = user.uid;
      const movementRef = ref(
        FIREBASE_DATABASE,
        `Movimientos/${userUID}/${debtorUID}`
      );

      remove(movementRef);

      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error al eliminar información de movimientos:", error);
    return false;
  }
};

export const deleteMovement = async (debtor, movement) => {
  try {
    const user = FIREBASE_AUTH.currentUser;

    if (user) {
      const userUID = user.uid;
      const movementRef = ref(
        FIREBASE_DATABASE,
        `Movimientos/${userUID}/${debtor.uid}/${movement.uid}`
      );

      await remove(movementRef);

      const amountupdate =
        parseFloat(debtor.deudaindividual) - parseFloat(movement.importe);

      const result = await updateDebtorDetails(
        debtor.uid,
        new Date().getTime(),
        amountupdate
      );

      if (result) {
        console.log("Update successful");
        // Actualizar el objeto 'debtor' con los nuevos campos

        debtor.deudaindividual = amountupdate;

        return debtor; // Retorna el objeto 'debtor' actualizado
      } else {
        console.log("Update failed");
        return null; // Retornar null si la actualización falla
      }
    } else {
      return null; // Retorna false si no hay un usuario conectado
    }
  } catch (error) {
    console.error("Error al borrar información del movimiento:", error);
    return null; // Retorna false en caso de error durante la actualización
  }
};
