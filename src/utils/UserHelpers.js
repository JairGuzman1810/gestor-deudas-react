import { get, ref } from "firebase/database";

import { FIREBASE_DATABASE } from "../../firebaseConfig";

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
