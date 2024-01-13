/* eslint-disable prettier/prettier */
import { get, ref } from "firebase/database";

import { FIREBASE_DATABASE, FIREBASE_AUTH } from "../../firebaseConfig";

export const fetchDebtor = async (debtor) => {
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
