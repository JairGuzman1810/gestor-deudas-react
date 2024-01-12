import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import MovementItem from "../components/MovementItem";

const DetailDebtor = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.toolbarContainer}>
          <TouchableOpacity
            style={[styles.toolbarButton, { paddingHorizontal: 10 }]}
          >
            <Ionicons
              name="arrow-back"
              size={30}
              color="white"
              onPress={() => navigation.navigate("Home")}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Detalles</Text>

        <TouchableOpacity
          style={[styles.iconButton, { marginHorizontal: 10 }]}
          onPress={() => {
            /* Handle filter button press */
          }}
        >
          <Ionicons name="download-sharp" size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.iconButton]} onPress={() => {}}>
          <Ionicons name="pencil-sharp" size={28} color="white" />
        </TouchableOpacity>
      </View>
      {/* NOMBRE Y MARCAR */}
      <View style={styles.namecontainer}>
        <View style={styles.leftnamecontainer}>
          <TouchableOpacity>
            <Ionicons name="person" size={18} color="black" />
          </TouchableOpacity>
          <Text style={styles.name}>Ayuda</Text>
        </View>
        <View style={styles.rightnamecontainer}>
          <TouchableOpacity>
            <Ionicons name="call" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.contentcontainer}>
        <Text style={styles.contenttitle}>Notas</Text>
        <View style={styles.separator} />
        <Text style={styles.notes}>No hay notas en este deudor.</Text>
      </View>
      <View style={styles.contentcontainer}>
        <Text style={styles.contenttitle}>Deuda Total</Text>
        <View style={styles.separator} />
        <View style={styles.amountcontainer}>
          <View style={styles.leftamountcontainer}>
            <Text style={[styles.amount, { color: "#1A7A13" }]}>
              $ 12,800.65
            </Text>
          </View>
          <View style={[styles.button, { backgroundColor: "#4e9316" }]}>
            <TouchableOpacity style={styles.touchableOpacity}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.button, { backgroundColor: "#B11D1D" }]}>
            <TouchableOpacity style={styles.touchableOpacity}>
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.contentcontainer}>
        <Text style={styles.contenttitle}>Movimientos (4)</Text>
        <View style={[styles.separator, { marginBottom: 0 }]} />
      </View>
      <MovementItem />
      <MovementItem />
      <MovementItem />
      <MovementItem />
    </View>
  );
};

export default DetailDebtor;

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === "android" ? 30 : 0, // Apply marginTop only on Android
    flex: 1,
    backgroundColor: "#F0F0F0",
  },
  header: {
    width: "100%",
    height: 50,
    backgroundColor: "#808080",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  toolbarContainer: {
    flexDirection: "row",
  },
  toolbarButton: {
    marginRight: 20,
  },
  title: {
    flex: 1,
    fontFamily: "Montserrat-Bold",
    textAlign: "center", // Centra el texto horizontalmente
    paddingHorizontal: 10,
    fontSize: 18,
    color: "white",
  },
  iconButton: {
    width: "10%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  namecontainer: {
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftnamecontainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightnamecontainer: {
    flexDirection: "row",
  },
  name: {
    marginLeft: 2,
    fontFamily: "Montserrat-Bold",
    fontSize: 20,
    color: "#000",
  },
  separator: {
    height: 1,
    backgroundColor: "#878585",
    marginTop: 5,
    marginBottom: 10,
  },
  contentcontainer: {
    padding: 8,
    justifyContent: "space-between",
  },
  contenttitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 17,
    color: "#000",
  },
  notes: {
    fontFamily: "Montserrat-Regular",
    fontSize: 17,
    color: "#000",
  },
  amount: {
    fontFamily: "Montserrat-Regular",
    fontSize: 20,
  },
  amountcontainer: {
    flexDirection: "row",
  },
  leftamountcontainer: {
    flex: 1,
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#4e9316",
    borderRadius: 10,
    height: 50,
    marginRight: 5,
    width: 50,
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
    fontSize: 20,
    color: "#fff",
  },
  touchableOpacity: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
