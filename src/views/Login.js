import { useFonts } from "expo-font";
import React, { useState } from "react";
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const navigation = useNavigation();

  const [hidePass, setHidePass] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let [fontsLoaded] = useFonts({
    "Montserrat-Bold": require("../fonts/montserratbold.ttf"),
    "Montserrat-Regular": require("../fonts/montserratregular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <View style={styles.container}>
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
            name={"mail"}
            color="black"
          />
          <TextInput
            style={styles.textinput}
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholder="Correo"
          ></TextInput>
        </View>
        <View style={styles.input}>
          <Ionicons
            style={styles.iconinput}
            size={20}
            name={"lock-closed"}
            color="black"
          />
          <TextInput
            style={styles.textinput}
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={hidePass ? true : false}
            placeholder="Contraseña"
          ></TextInput>
          <Ionicons
            size={20}
            name={hidePass ? "eye" : "eye-off-sharp"}
            onPress={() => setHidePass(!hidePass)}
            color="black"
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  iconinput: {
    marginRight: 5,
  },
});

export default LoginScreen;
