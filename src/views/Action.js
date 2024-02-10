import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
  useColorScheme,
} from "react-native";

import { lightColors, darkColors } from "../colors";
import UserModal from "../components/UserModal";

const Action = ({ route, user }) => {
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === "light" ? lightColors : darkColors;
  const { userSelected } = route.params;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const navigation = useNavigation();

  const goBack = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "MyUsers" }],
    });
  };

  const hideModal = () => {
    setIsModalVisible(false);
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
          <Text style={styles.title}>¿Que acción desea realizar?</Text>
        </View>
      </View>

      <View style={styles.gridContainer}>
        <View style={[styles.gridRow, { alignItems: "flex-end" }]}>
          <View style={[styles.button, { marginBottom: 30 }]}>
            <TouchableOpacity
              style={styles.touchableOpacity}
              onPress={() =>
                navigation.navigate("ChangeUserEmail", { userSelected, user })
              }
            >
              <Ionicons name="mail" size={40} color="white" />
              <Text style={styles.buttonText}>Cambiar{"\n"}Correo</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.button, { marginBottom: 30 }]}>
            <TouchableOpacity
              style={styles.touchableOpacity}
              onPress={() =>
                navigation.navigate("ChangeUserName", { userSelected })
              }
            >
              <Ionicons name="person" size={40} color="white" />
              <Text style={styles.buttonText}>Cambiar{"\n"}Nombre</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.gridRow}>
          <View style={[styles.button, { marginTop: 30 }]}>
            <TouchableOpacity
              style={styles.touchableOpacity}
              onPress={() =>
                navigation.navigate("ChangeUserPassword", {
                  userSelected,
                  user,
                })
              }
            >
              <Ionicons name="lock-closed" size={40} color="white" />
              <Text style={styles.buttonText}>Cambiar{"\n"}Contraseña</Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.button,
              { backgroundColor: "#B11D1D", marginTop: 30 },
            ]}
          >
            <TouchableOpacity
              style={styles.touchableOpacity}
              onPress={() => setIsModalVisible(true)}
            >
              <Ionicons name="trash" size={40} color="white" />
              <Text style={styles.buttonText}>Eliminar{"\n"}cuenta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <UserModal
        userSelected={userSelected}
        isModalVisible={isModalVisible}
        hideModal={hideModal}
        user={user}
      />
    </View>
  );
};

export default Action;

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === "android" ? 0 : 0, // Apply marginTop only on Android
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
  gridContainer: {
    flex: 1,
  },
  gridRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    height: "60%",
    marginVertical: 10,
    marginHorizontal: 10,
    backgroundColor: "#1A7A13",
    justifyContent: "center", // Centrado vertical
    alignItems: "center", // Centrado horizontal
    borderRadius: 5,
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
    color: "white",
    textAlign: "center",
    fontFamily: "Montserrat-Regular",
    fontSize: 17,
    marginTop: 5,
  },
  touchableOpacity: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
