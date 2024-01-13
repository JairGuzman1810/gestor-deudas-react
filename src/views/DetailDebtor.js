/* eslint-disable prettier/prettier */
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import * as Linking from "expo-linking";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";

import MovementItem from "../components/MovementItem";
import { fetchDebtor } from "../utils/MovementsHelper";

const DetailDebtor = ({ route }) => {
  const navigation = useNavigation();
  const [movements, setMovements] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { debtor } = route.params;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDebtor(debtor);
        setMovements(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [debtor]);

  const doCall = () => {
    if (debtor.telefono) {
      Linking.openURL(`tel:${debtor.telefono}`);
    } else {
      if (Platform.OS === "android") {
        ToastAndroid.show(
          "No tienes un número asignado a este deudor.",
          ToastAndroid.SHORT
        );
      } else {
        Alert.alert("No tienes un número asignado a este deudor.");
      }
    }
  };

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

        <TouchableOpacity
          style={[styles.iconButton]}
          onPress={() => {
            navigation.navigate("EditDebtor", { debtor, isHome: false });
          }}
        >
          <Ionicons name="pencil-sharp" size={28} color="white" />
        </TouchableOpacity>
      </View>
      {/* NOMBRE Y MARCAR */}
      <View style={styles.namecontainer}>
        <View style={styles.leftnamecontainer}>
          <TouchableOpacity>
            <Ionicons name="person" size={18} color="black" />
          </TouchableOpacity>
          <Text style={styles.name}>{debtor.nombre}</Text>
        </View>
        <View style={styles.rightnamecontainer}>
          <TouchableOpacity>
            <Ionicons
              onPress={doCall}
              name={debtor.telefono ? "call" : "call-outline"}
              size={30}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.contentcontainer}>
        <Text style={styles.contenttitle}>Notas</Text>
        <View style={styles.separator} />
        <Text style={styles.notes}>
          {debtor.notas ? debtor.notas : "No hay notas en este deudor."}
        </Text>
      </View>
      <View style={styles.contentcontainer}>
        <Text style={styles.contenttitle}>Deuda Total</Text>
        <View style={styles.separator} />
        <View style={styles.amountcontainer}>
          <View style={styles.leftamountcontainer}>
            <Text
              style={[
                styles.amount,
                {
                  color:
                    debtor.deudaindividual === 0
                      ? "#30BFBF" // Color para deudaindividual igual a 0
                      : debtor.deudaindividual > 0
                        ? "#1A7A13" // Color para deudaindividual mayor a 0
                        : "#B11D1D", // Color para deudaindividual menor a 0
                },
              ]}
            >
              $
              {debtor.deudaindividual
                .toFixed(2)
                .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
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
        <Text style={styles.contenttitle}>
          {isLoading
            ? "Movimientos (...)"
            : `Movimientos (${Object.values(movements).length})`}
        </Text>
        <View style={[styles.separator, { marginBottom: 0 }]} />
      </View>
      {isLoading ? (
        <ActivityIndicator style={{ flex: 1 }} size="large" color="#808080" />
      ) : (
        <>
          {Object.values(movements).length === 0 ? (
            <View style={styles.noMovementsContainer}>
              <Text style={styles.noMovementsText}>
                Sin movimientos. Haga su primer movimiento con los botones
              </Text>
              <View style={styles.noMovementsButtons}>
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
          ) : (
            <FlatList
              data={Object.values(movements)}
              keyExtractor={(item) => item.uid}
              renderItem={({ item }) => <MovementItem debtor={item} />}
            />
          )}
        </>
      )}
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
    textAlign: "justify",
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
  noMovementsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noMovementsText: {
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
    fontSize: 18,
    marginBottom: 10,
  },
  noMovementsButtons: {
    flexDirection: "row",
  },
});
