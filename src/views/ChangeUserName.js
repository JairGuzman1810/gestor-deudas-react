/* eslint-disable prettier/prettier */
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  TextInput,
  ToastAndroid,
  Alert,
  useColorScheme,
} from "react-native";

import { lightColors, darkColors } from "../colors";
import { updateUserName } from "../utils/UserHelpers";

const ChangeUserName = ({ route }) => {
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === "light" ? lightColors : darkColors;
  const [name, setName] = useState("");
  const { userSelected } = route.params;

  const navigation = useNavigation();

  const goBack = () => {
    setName("");
    navigation.navigate("Action", {
      userSelected,
    });
  };

  const showToast = (title, message) => {
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravityAndOffset(
        message,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } else {
      Alert.alert(title, message);
    }
  };

  const handleChangeName = async () => {
    try {
      //Actualizar información al db.
      await updateUserName(userSelected, name);

      // Mostrar mensaje de éxito
      showToast("Éxito", "Correo actualizado correctamente.");

      //Volver
      navigation.reset({
        index: 0,
        routes: [{ name: "MyUsers" }],
      });
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };
  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.backgroundTwo }]}
    >
      <View style={styles.header}>
        <View style={styles.toolbarContainer}>
          <TouchableOpacity style={styles.toolbarButton} onPress={goBack}>
            <Ionicons name="arrow-back" size={30} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.titlecontainer}>
          <Text style={styles.title}>Editar nombre</Text>
        </View>
      </View>
      {/* Antiguo Nombre */}
      <View style={styles.contentcontainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="person" size={18} color={themeColors.icon} />
          <Text
            style={[
              styles.contenttitle,
              { marginLeft: 2, color: themeColors.text },
            ]}
          >
            Antiguo nombre
          </Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.namecontainer}>
          <Text style={[styles.name, { color: themeColors.text }]}>
            {userSelected.nombre}
          </Text>
        </View>
      </View>
      {/* Nuevo Nombre */}
      <View style={styles.contentcontainer}>
        <Text style={[styles.contenttitle, { color: themeColors.text }]}>
          Nuevo nombre
        </Text>
        <View style={styles.separator} />
      </View>
      <View style={styles.section}>
        <View
          style={[
            styles.input,
            { backgroundColor: themeColors.backgroundFirst },
          ]}
        >
          <Ionicons
            style={styles.iconinput}
            size={20}
            name="person"
            color={themeColors.icon}
          />
          <TextInput
            value={name}
            onChangeText={(text) => setName(text)}
            style={[styles.textinput, { color: themeColors.text }]}
            placeholder="Nombre"
            placeholderTextColor="#808080"
          />
        </View>
      </View>
      {/* Change Name button */}
      <View style={name === "" ? styles.buttonDisable : styles.button}>
        <TouchableOpacity
          onPress={handleChangeName}
          disabled={name === ""}
          style={styles.touchableOpacity}
        >
          <Text
            style={name === "" ? styles.buttonTextDisable : styles.buttonText}
          >
            ACTUALIZAR
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChangeUserName;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: "100%",
    height: 50,
    paddingHorizontal: 10,
    backgroundColor: "#808080",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  toolbarContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  toolbarButton: {
    marginRight: 10,
  },
  title: {
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
    color: "white",
    textAlign: "center",
    marginLeft: -20,
  },
  titlecontainer: {
    flex: 1,
  },
  contentcontainer: {
    padding: 8,
    justifyContent: "space-between",
  },
  contenttitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 17,
  },
  separator: {
    height: 1,
    backgroundColor: "#878585",
    marginTop: 5,
    marginBottom: 10,
  },
  namecontainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: "center",
  },
  name: {
    fontFamily: "Montserrat-Regular",
    fontSize: 20,
  },
  section: {
    marginHorizontal: 15,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    marginHorizontal: 10,
    fontSize: 18,
    flexDirection: "row",
    fontFamily: "Montserrat-Regular",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconinput: {
    marginRight: 5,
  },
  textinput: {
    flex: 1,
    fontFamily: "Montserrat-Regular",
    fontSize: 18,
    height: "100%",
  },
  button: {
    backgroundColor: "#1A7A13",
    borderRadius: 5,
    marginTop: 20,
    marginHorizontal: 50,
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
    marginHorizontal: 50,
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
  touchableOpacity: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
});
