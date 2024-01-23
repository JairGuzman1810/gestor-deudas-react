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
  FlatList,
  TextInput,
} from "react-native";

import MovementItem from "../components/MovementItem";
import SortMovementModal from "../components/SortMovementModal";
import { fetchMovements } from "../utils/MovementsHelper";
import { printMovements } from "../utils/PrintUtils";

const DetailDebtor = ({ route }) => {
  const navigation = useNavigation();
  const [movements, setMovements] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sortingValues, setSortingValues] = useState({
    selectedOption: "Fecha del movimiento",
    sortingOrder: "Asc",
  });
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { debtor } = route.params;

  const goBack = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
    setIsLoading(true);
  };

  const fetchData = async () => {
    setIsRefreshing(true);
    setIsLoading(true);

    try {
      const data = await fetchMovements(debtor);

      const movementsArray = Object.values(data);
      // Handle the sorting logic based on the selected option
      const sortedMovements = [...movementsArray];

      switch (sortingValues.selectedOption) {
        case "Fecha del movimiento":
          sortedMovements.sort((a, b) =>
            sortingValues.sortingOrder === "Asc"
              ? a.ultimomovimiento - b.ultimomovimiento
              : b.ultimomovimiento - a.ultimomovimiento
          );
          break;
        case "Fecha de creación":
          sortedMovements.sort((a, b) =>
            sortingValues.sortingOrder === "Asc"
              ? a.creado - b.creado
              : b.creado - a.creado
          );
          break;
        case "Deuda":
          sortedMovements.sort((a, b) =>
            sortingValues.sortingOrder === "Asc"
              ? a.deudaindividual - b.deudaindividual
              : b.deudaindividual - a.deudaindividual
          );
          break;
        default:
          break;
      }

      // Convert the sorted array back to an object
      const sortedMovementsObject = {};
      sortedMovements.forEach((debtor) => {
        sortedMovementsObject[debtor.uid] = debtor;
      });

      setMovements(sortedMovementsObject);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sortingValues]);

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

  const newPayment = () => {
    navigation.navigate("NewMovement", {
      debtor,
      isPayment: true,
    });
  };

  const newDebt = () => {
    navigation.navigate("NewMovement", {
      debtor,
      isPayment: false,
    });
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const filteredMovements = Object.values(movements).filter((movement) => {
    // Verificar que movement no sea undefined y que los campos necesarios no sean undefined
    const descripcion = movement?.descripcion;
    const importe = movement?.importe;
    const fecha = movement?.fecha;

    if (
      descripcion !== undefined &&
      importe !== undefined &&
      fecha !== undefined
    ) {
      // Formatear el campo importe
      const formattedImporte = importe.toLocaleString(undefined, {
        style: "currency",
        currency: "USD", // Puedes cambiarlo según tu moneda
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      // Formatear el campo fecha

      const formattedFecha = new Date(fecha).toLocaleDateString();

      // Realizar la búsqueda en los tres campos
      return (
        descripcion.toLowerCase().includes(search && search.toLowerCase()) ||
        formattedImporte.toString().includes(search) ||
        formattedImporte.replace(/,/g, "").includes(search) || // Búsqueda sin comas
        formattedFecha.toString().includes(search)
      );
    }

    return false;
  });

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
              onPress={goBack}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Detalles</Text>

        <TouchableOpacity
          disabled={isLoading || Object.values(movements).length === 0}
          style={[
            styles.iconButton,
            {
              marginHorizontal: 10,
              opacity:
                isLoading || Object.values(movements).length === 0 ? 0.5 : 1,
            },
          ]}
          onPress={() => {
            printMovements(
              debtor,
              isSearching ? filteredMovements : Object.values(movements)
            );
          }}
        >
          <Ionicons
            name={
              isLoading || Object.values(movements).length === 0
                ? "download-outline"
                : "download"
            }
            size={28}
            color="white"
          />
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
              {debtor.deudaindividual.toLocaleString(undefined, {
                style: "currency",
                currency: "USD", // Puedes cambiarlo según tu moneda
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
          <View style={[styles.button, { backgroundColor: "#1A7A13" }]}>
            <TouchableOpacity
              onPress={newPayment}
              style={styles.touchableOpacity}
            >
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.button, { backgroundColor: "#B11D1D" }]}>
            <TouchableOpacity onPress={newDebt} style={styles.touchableOpacity}>
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.contentcontainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.contenttitle}>
            {isLoading
              ? "Movimientos (...)"
              : `Movimientos (${Object.values(movements).length})`}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              flex: 1,
            }}
          >
            {/* First TouchableOpacity */}
            <TouchableOpacity
              disabled={isLoading || Object.values(movements).length === 0}
              onPress={() => {
                //desactivar/activar la barra de busqueda.
                setIsSearching(!isSearching);
                //Siempre true para que se active el teclado.
                setSearchFocused(true);
                //Vaciamos para no quede busqueda anterior.
                setSearch("");
              }}
              style={{
                marginHorizontal: 10,
                opacity:
                  isLoading || Object.values(movements).length === 0 ? 0.5 : 1,
              }}
            >
              <Ionicons
                name={
                  isSearching ||
                  isLoading ||
                  Object.values(movements).length === 0
                    ? "search-circle-outline"
                    : "search-circle"
                }
                size={30}
                color="black"
              />
            </TouchableOpacity>

            {/* Second TouchableOpacity */}
            <TouchableOpacity
              onPress={() => setIsModalVisible(true)}
              style={{
                opacity:
                  isLoading || Object.values(movements).length === 0 ? 0.5 : 1,
              }}
              disabled={isLoading || Object.values(movements).length === 0}
            >
              <Ionicons
                name={
                  isLoading || Object.values(movements).length === 0
                    ? "funnel-outline"
                    : "funnel"
                }
                size={30}
                color="black"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.separator, { marginBottom: 0 }]} />
      </View>
      {/* BARRA DE BUSQUEDA */}
      {isSearching && (
        <View style={styles.input}>
          <TextInput
            value={search}
            onChangeText={(text) => setSearch(text)}
            style={styles.textinput}
            placeholder="Buscar"
            autoFocus={searchFocused}
          />
        </View>
      )}
      {isLoading ? (
        <ActivityIndicator style={{ flex: 1 }} size="large" color="#808080" />
      ) : (
        <>
          {Object.values(movements).length === 0 && !isSearching ? (
            <View style={styles.noMovementsContainer}>
              <Text style={styles.noMovementsText}>
                Sin movimientos. Haga su primer movimiento con los botones
              </Text>
              <View style={styles.noMovementsButtons}>
                <View style={[styles.button, { backgroundColor: "#1A7A13" }]}>
                  <TouchableOpacity
                    onPress={newPayment}
                    style={styles.touchableOpacity}
                  >
                    <Text style={styles.buttonText}>+</Text>
                  </TouchableOpacity>
                </View>
                <View style={[styles.button, { backgroundColor: "#B11D1D" }]}>
                  <TouchableOpacity
                    onPress={newDebt}
                    style={styles.touchableOpacity}
                  >
                    <Text style={styles.buttonText}>-</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : filteredMovements.length === 0 ? (
            <View style={styles.noMovementsContainer}>
              <Text style={styles.noMovementsText}>
                Sin registros con el nombre:
              </Text>
              <Text style={styles.noMovementsText}>"{search}"</Text>
            </View>
          ) : (
            <FlatList
              data={isSearching ? filteredMovements : Object.values(movements)}
              keyExtractor={(item) => item.uid}
              refreshing={isRefreshing}
              onRefresh={fetchData}
              renderItem={({ item }) => (
                <MovementItem movement={item} debtor={debtor} />
              )}
            />
          )}
        </>
      )}
      <SortMovementModal
        isModalVisible={isModalVisible}
        hideModal={hideModal}
        sortingValues={sortingValues}
        setSortingValues={setSortingValues}
      />
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
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  rightnamecontainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  name: {
    marginLeft: 2,
    flex: 1,
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
    marginHorizontal: 10,
  },
  noMovementsButtons: {
    flexDirection: "row",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginHorizontal: 4,
    fontSize: 18,
    flexDirection: "row",
    fontFamily: "Montserrat-Regular",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  textinput: {
    flex: 1,
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    height: "100%",
  },
});
