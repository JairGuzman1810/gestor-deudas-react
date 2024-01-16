/* eslint-disable prettier/prettier */
// CommonHelper.js
import { ref, update } from "firebase/database";

import { FIREBASE_DATABASE, FIREBASE_AUTH } from "../../firebaseConfig";

export const updateDebtorDetails = async (
  debtorUID,
  ultimomovimiento,
  deudaindividual
) => {
  try {
    const user = FIREBASE_AUTH.currentUser;

    if (user) {
      const userUID = user.uid;
      const debtorRef = ref(
        FIREBASE_DATABASE,
        `Deudores/${userUID}/${debtorUID}`
      );

      const debtorData = {
        ultimomovimiento,
        deudaindividual,
      };

      await update(debtorRef, debtorData);

      return true; // Return true if the update was successful
    } else {
      return false; // Return false if no user is connected
    }
  } catch (error) {
    console.error("Error updating debtor details:", error);
    return false; // Return false in case of an error
  }
};
