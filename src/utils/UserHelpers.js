import { get, ref, remove, set, update } from "firebase/database";

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

export const updateUserEmail = async (userSelected, email) => {
  try {
    const user = FIREBASE_AUTH.currentUser;

    if (user) {
      const userUID = userSelected.uid;
      const userRef = ref(FIREBASE_DATABASE, `Usuarios/${userUID}`);

      const userData = {
        correo: email,
      };

      await update(userRef, userData);

      // Limpia los campos después de la actualización exitosa

      return true; // Retorna true si la actualización fue exitosa
    } else {
      return false; // Retorna false si no hay un usuario conectado
    }
  } catch (error) {
    console.error("Error al actualizar información de usuario:", error);
    return false; // Retorna false en caso de error durante la actualización
  }
};

export const updateUserName = async (userSelected, name) => {
  try {
    const user = FIREBASE_AUTH.currentUser;

    if (user) {
      const userUID = userSelected.uid;
      const userRef = ref(FIREBASE_DATABASE, `Usuarios/${userUID}`);

      const userData = {
        nombre: name,
      };

      await update(userRef, userData);

      // Limpia los campos después de la actualización exitosa

      return true; // Retorna true si la actualización fue exitosa
    } else {
      return false; // Retorna false si no hay un usuario conectado
    }
  } catch (error) {
    console.error("Error al actualizar información de usuario:", error);
    return false; // Retorna false en caso de error durante la actualización
  }
};

export const updateUserPassword = async (userSelected, password) => {
  try {
    const user = FIREBASE_AUTH.currentUser;

    if (user) {
      const userUID = userSelected.uid;
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
    console.error("Error al actualizar información de usuario:", error);
    return false; // Retorna false en caso de error durante la actualización
  }
};

export const deleteUserData = async (userSelected) => {
  try {
    const user = FIREBASE_AUTH.currentUser;

    if (user) {
      const userUID = userSelected.uid;
      const userRef = ref(FIREBASE_DATABASE, `Usuarios/${userUID}`);

      // Borrar el usuario.
      await remove(userRef);

      // Borrar todos los deudores del usuario
      const userDebtorsRef = ref(FIREBASE_DATABASE, `Deudores/${userUID}`);

      await remove(userDebtorsRef);

      // Borrar todos los movimientos del usuario.
      const userMovementsRef = ref(FIREBASE_DATABASE, `Movimientos/${userUID}`);

      await remove(userMovementsRef);

      return true; // Retorna true si la eliminación fue exitosa
    } else {
      return false; // Retorna false si no hay un usuario conectado
    }
  } catch (error) {
    console.error("Error al eliminar información de deudor:", error);
    return false; // Retorna false en caso de error durante la eliminación
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
