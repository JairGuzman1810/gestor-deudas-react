import { get, ref, set, update } from "firebase/database";

import { encrypt } from "./AESUtils";
import { FIREBASE_AUTH, FIREBASE_DATABASE } from "../../firebaseConfig";

export const fetchUser = async (user) => {
  const userRef = ref(FIREBASE_DATABASE, `Usuarios/${user.uid}`);
  const snapshot = await get(userRef);

  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    console.log("User data not found");
    return null;
  }
};

export const addUser = async (nombre, correo, contraseña) => {
  try {
    const user = FIREBASE_AUTH.currentUser;

    if (user) {
      const userUID = user.uid;
      const userDatabaseRef = ref(FIREBASE_DATABASE, `Usuarios/${userUID}`);
      const userData = {
        uid: userUID,
        nombre,
        correo,
        contraseña: encrypt(contraseña),
        privilegios: "user",
      };

      await set(userDatabaseRef, userData);

      console.log(`User data added successfully at key ${userUID}`);
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

export const updatePass = async (password) => {
  try {
    const user = FIREBASE_AUTH.currentUser;

    if (user) {
      const userUID = user.uid;
      const userRef = ref(FIREBASE_DATABASE, `Usuarios/${userUID}`);

      const userData = {
        contraseña: encrypt(password),
      };

      await update(userRef, userData);

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

export const getAllUsers = async () => {
  const user = FIREBASE_AUTH.currentUser;

  if (user) {
    const userUID = user.uid;
    const userDatabaseRef = ref(FIREBASE_DATABASE, `Usuarios`);

    try {
      // Obtener los datos en un momento dado
      const snapshot = await get(userDatabaseRef);
      const allUsers = snapshot.val();

      if (allUsers) {
        // Eliminar el usuario localmente
        const updatedUsers = { ...allUsers };
        delete updatedUsers[userUID];

        return updatedUsers;
      } else {
        return {};
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  } else {
    console.log("No hay un usuario conectado");
    return null; // Return null if no user is connected
  }
};
