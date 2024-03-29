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
  useColorScheme,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { FIREBASE_AUTH } from "../../firebaseConfig";
import { lightColors, darkColors } from "../colors";
import { fetchUser } from "../utils/UserHelpers";

const Login = ({ setUser, setUserLoggedIn }) => {
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === "light" ? lightColors : darkColors;
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
        setUserLoggedIn(true);
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
      style={[
        styles.container,
        { backgroundColor: themeColors.backgroundFirst },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView>
        <View>
          <Image
            source={require("../images/logotwins.png")} // Replace with your logo path
            style={styles.logo}
          />
          <View
            style={[
              styles.cardContainer,
              { backgroundColor: themeColors.backgroundTwo },
            ]}
          >
            <Text style={[styles.title, { color: themeColors.text }]}>
              Inicio de sesión
            </Text>
            <View
              style={[
                styles.input,
                { backgroundColor: themeColors.backgroundFirst },
              ]}
            >
              <Ionicons
                style={styles.iconinput}
                size={20}
                name="mail"
                color={themeColors.icon}
              />
              <TextInput
                style={[styles.textinput, { color: themeColors.text }]}
                inputMode="email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                placeholder="Correo"
                placeholderTextColor="#808080"
              />
            </View>
            <View
              style={[
                styles.input,
                { backgroundColor: themeColors.backgroundFirst },
              ]}
            >
              <Ionicons
                style={styles.iconinput}
                size={20}
                name="lock-closed"
                color={themeColors.icon}
              />
              <TextInput
                style={[styles.textinput, { color: themeColors.text }]}
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={!!hidePass}
                placeholder="Contraseña"
                placeholderTextColor="#808080"
              />
              <Ionicons
                size={20}
                name={hidePass ? "eye" : "eye-off-sharp"}
                onPress={() => setHidePass(!hidePass)}
                color={themeColors.icon}
              />
            </View>
            {loading ? (
              // Show ActivityIndicator when loading is true
              <ActivityIndicator size="large" color="#1A7A13" />
            ) : (
              // Show buttons when loading is false
              <View
                style={
                  email === "" || password === ""
                    ? styles.buttonDisable
                    : styles.button
                }
              >
                <TouchableOpacity
                  disabled={email === "" || password === ""}
                  onPress={SignIn}
                  style={styles.touchableOpacity}
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
              </View>
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
    margin: 5,
    padding: 10,
    borderRadius: 5,
    elevation: 5,
  },
  title: {
    fontFamily: "Montserrat-Bold",
    fontSize: 28,
    marginBottom: 25,
    textAlign: "center",
  },
  input: {
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
    backgroundColor: "#1A7A13",
    borderRadius: 5,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 4 }, // Adjust the offset if needed
        shadowOpacity: 0.5, // Increase the opacity for a more visible shadow
        shadowRadius: 6, // Adjust the radius if needed
      },
      android: {
        elevation: 8, // Increase the elevation for a more visible shadow
      },
    }),
  },
  buttonText: {
    fontFamily: "Montserrat-Bold",
    fontSize: 16,
    color: "#fff",
  },
  buttonDisable: {
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 4 }, // Adjust the offset if needed
        shadowOpacity: 0.5, // Increase the opacity for a more visible shadow
        shadowRadius: 6, // Adjust the radius if needed
      },
      android: {
        elevation: 4, // Increase the elevation for a more visible shadow
      },
    }),
  },
  buttonTextDisable: {
    fontFamily: "Montserrat-Bold",
    fontSize: 16,
    color: "#808080",
  },
  iconinput: {
    marginRight: 5,
  },
  touchableOpacity: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
});

export default Login;
