import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { FIREBASE_AUTH } from "../../firebaseConfig";
import { fetchUser } from "../utils/UserHelpers";

const Login = ({ setUser }) => {
  const navigation = useNavigation();

  const [hidePass, setHidePass] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  const [fontsLoaded] = useFonts({
    "Montserrat-Bold": require("../fonts/montserratbold.ttf"),
    "Montserrat-Regular": require("../fonts/montserratregular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  const SignIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      if (response.user) {
        // The user is authenticated successfully
        //TODO console.log("Login successful:", response.user);
        const userData = await fetchUser(response.user);
        setUser(userData);
        navigation.navigate("Home");
      } else {
        // Something unexpected happened, and the user is not authenticated
        console.log("Unexpected response:", response);
        Alert.alert("Sign in failed", "Unexpected response. Please try again.");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Sign in failed", error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView>
        <View>
          <Image
            source={require("../images/logotwins.png")} // Replace with your logo path
            style={styles.logo}
          />
          <View style={styles.cardContainer}>
            <Text style={styles.title}>Inicio de sesión</Text>
            <View style={styles.input}>
              <Ionicons
                style={styles.iconinput}
                size={20}
                name="mail"
                color="black"
              />
              <TextInput
                style={styles.textinput}
                inputMode="email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                placeholder="Correo"
              />
            </View>
            <View style={styles.input}>
              <Ionicons
                style={styles.iconinput}
                size={20}
                name="lock-closed"
                color="black"
              />
              <TextInput
                style={styles.textinput}
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={!!hidePass}
                placeholder="Contraseña"
              />
              <Ionicons
                size={20}
                name={hidePass ? "eye" : "eye-off-sharp"}
                onPress={() => setHidePass(!hidePass)}
                color="black"
              />
            </View>
            {loading ? (
              // Show ActivityIndicator when loading is true
              <ActivityIndicator size="large" color="#4e9316" />
            ) : (
              // Show buttons when loading is false
              <TouchableOpacity
                disabled={email === "" || password === ""}
                style={
                  email === "" || password === ""
                    ? styles.buttonDisable
                    : styles.button
                }
                onPress={SignIn}
              >
                <Text
                  style={
                    email === "" || password === ""
                      ? styles.buttonTextDisable
                      : styles.buttonText
                  }
                >
                  LOGIN
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  logo: {
    marginTop: 80,
    marginBottom: 50,
    width: 400,
    height: 150,
    alignSelf: "center",
  },
  cardContainer: {
    backgroundColor: "#D3D2D2",
    margin: 5,
    padding: 10,
    borderRadius: 5,
    elevation: 5,
  },
  title: {
    fontFamily: "Montserrat-Bold",
    fontSize: 28,
    color: "#000",
    marginBottom: 25,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    fontSize: 18,
    flexDirection: "row",
    fontFamily: "Montserrat-Regular",
    alignItems: "center", // Vertically center the items
    justifyContent: "space-between",
  },
  textinput: {
    flex: 1,
    fontFamily: "Montserrat-Regular",
    fontSize: 18,
  },
  button: {
    backgroundColor: "#4e9316",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "Montserrat-Bold",
    fontSize: 16,
    color: "#fff",
  },
  buttonDisable: {
    backgroundColor: "#e0e0e0",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonTextDisable: {
    fontFamily: "Montserrat-Bold",
    fontSize: 16,
    color: "#808080",
  },
  iconinput: {
    marginRight: 5,
  },
});

export default Login;
