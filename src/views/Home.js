/* eslint-disable prettier/prettier */
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from "react-native";
import { FlatList, TextInput } from "react-native-gesture-handler";

import DebtorItem from "../components/DebtorItem";
import SortModal from "../components/SortModal";
import { getAllDebtors } from "../utils/DebtorHelper";

const Home = () => {
  const [debtors, setDebtors] = useState({});
  const [isSearching, setIsSerching] = useState(false);
  const [totalDebt, setTotalDebt] = useState(0);
  const [search, setSearch] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sortingOrder, setSortingOrder] = useState("Asc");
  const [selectedOption, setSelectedOption] = useState("Fecha de creación");

  useEffect(() => {
    // Set up the real-time listener and get the unsubscribe function
    const unsubscribe = getAllDebtors((debtors) => {
      const debtorsArray = Object.values(debtors);
      // Handle the sorting logic based on the selected option
      const sortedDebtors = [...debtorsArray];

      switch (selectedOption) {
        case "Alfabeticamente":
          sortedDebtors.sort((a, b) =>
            sortingOrder === "Asc"
              ? a.nombre.localeCompare(b.nombre)
              : b.nombre.localeCompare(a.nombre)
          );
          break;
        case "Fecha del movimiento":
          sortedDebtors.sort((a, b) =>
            sortingOrder === "Asc"
              ? a.ultimomovimiento - b.ultimomovimiento
              : b.ultimomovimiento - a.ultimomovimiento
          );
          break;
        case "Fecha de creación":
          sortedDebtors.sort((a, b) =>
            sortingOrder === "Asc" ? a.creado - b.creado : b.creado - a.creado
          );
          break;
        case "Deuda":
          sortedDebtors.sort((a, b) =>
            sortingOrder === "Asc"
              ? a.deudaindividual - b.deudaindividual
              : b.deudaindividual - a.deudaindividual
          );
          break;
        default:
          break;
      }

      // Convert the sorted array back to an object
      const sortedDebtorsObject = {};
      sortedDebtors.forEach((debtor) => {
        sortedDebtorsObject[debtor.uid] = debtor;
      });

      setDebtors(sortedDebtorsObject);
      setIsLoading(false);
    });
  }, [selectedOption, sortingOrder]); // El array vacío [] significa que se ejecutará solo una vez

  useEffect(() => {
    // Calculate the total debt whenever debtors change
    const newTotalDebt = Object.values(debtors).reduce(
      (total, debtor) => total + debtor.deudaindividual,
      0
    );

    setTotalDebt(newTotalDebt);
  }, [debtors]);

  useEffect(() => {
    // Clear search term when not searching
    if (!isSearching) {
      setSearch("");
    }
  }, [isSearching]);

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const filteredDebtors = Object.values(debtors).filter((debtor) =>
    debtor.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.toolbarContainer}>
          <TouchableOpacity
            style={styles.toolbarButton}
            onPress={() => navigation.openDrawer()}
          >
            <Ionicons name="menu" size={30} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Mis deudores</Text>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            /* Handle filter button press */
          }}
        >
          <Ionicons name="download-sharp" size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            navigation.navigate("NewDebtor");
          }}
        >
          <Ionicons name="person-add" size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.iconButton,
            {
              backgroundColor: isSearching
                ? "#D3D2D2" // Color para deudaindividual igual a 0
                : "#808080",
            },
          ]}
          onPress={() => {
            setIsSerching(!isSearching);
          }}
        >
          <Ionicons
            name={isSearching ? "search-circle-outline" : "search-circle"}
            size={28}
            color="white"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            /* Handle cancel button press */
            setIsModalVisible(true);
          }}
        >
          <Ionicons name="filter" size={28} color="white" />
        </TouchableOpacity>
      </View>
      {/* BARRA DE BUSQUEDA */}
      {isSearching && (
        <View style={styles.input}>
          <TextInput
            value={search}
            onChangeText={(text) => setSearch(text)}
            style={styles.textinput}
            placeholder="Buscar"
            autoFocus={isSearching}
          />
        </View>
      )}
      {/* LISTA DE DEUDORES */}
      {isLoading ? (
        <ActivityIndicator style={{ flex: 1 }} size="large" color="#808080" />
      ) : (
        <>
          {Object.values(debtors).length === 0 && !isSearching ? (
            <View style={styles.noDebtorsContainer}>
              <Text style={styles.noDebtorsText}>
                Sin deudores. Haga su primer deudor con el icono
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("NewDebtor")}
              >
                <Ionicons name="person-add" size={28} color="black" />
              </TouchableOpacity>
            </View>
          ) : filteredDebtors.length === 0 ? (
            <View style={styles.noDebtorsContainer}>
              <Text style={styles.noDebtorsText}>
                Sin registros con el nombre:
              </Text>
              <Text style={styles.noDebtorsText}>"{search}"</Text>
            </View>
          ) : (
            <FlatList
              data={isSearching ? filteredDebtors : Object.values(debtors)}
              keyExtractor={(item) => item.uid}
              renderItem={({ item }) => <DebtorItem debtor={item} />}
            />
          )}
        </>
      )}
      {/* FOOTER */}
      <View style={styles.totaldebtcontainer}>
        <View style={styles.leftTextContainer}>
          <Text style={styles.leftText}>Deuda total:</Text>
        </View>
        <View style={styles.rightTextContainer}>
          <Text
            style={[
              styles.rightText,
              {
                color:
                  totalDebt === 0
                    ? "#30BFBF" // Color para deudaindividual igual a 0
                    : totalDebt > 0
                      ? "#1A7A13" // Color para deudaindividual mayor a 0
                      : "#B11D1D", // Color para deudaindividual menor a 0
              },
            ]}
          >
            ${totalDebt.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}
          </Text>
        </View>
      </View>
      <SortModal
        isModalVisible={isModalVisible}
        hideModal={hideModal}
        setDebtors={setDebtors}
        debtors={debtors}
        sortingOrder={sortingOrder}
        setSortingOrder={setSortingOrder}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />
    </View>
  );
};

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
    paddingHorizontal: 10,
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
    marginRight: 5,
  },
  title: {
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
    color: "white",
  },
  iconButton: {
    width: "15%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  totaldebtcontainer: {
    height: 50,
    backgroundColor: "#fdfdfd",
    borderTopRightRadius: 25,
    flexDirection: "row",
    borderTopLeftRadius: 25,
    overflow: "hidden",
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
  leftTextContainer: {
    flex: 1, // Toma el 50% del ancho total
    justifyContent: "center", // Centra verticalmente el texto izquierdo
    marginStart: 20,
  },

  rightTextContainer: {
    flex: 1, // Toma el 50% del ancho total
    justifyContent: "center", // Centra verticalmente el texto derecho
    marginEnd: 20,
  },

  leftText: {
    // Estilo para el texto izquierdo
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
  },

  rightText: {
    textAlign: "right",
    fontFamily: "Montserrat-Regular",
    fontSize: 18,
  },
  textinput: {
    flex: 1,
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    height: "100%",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 4,
    fontSize: 18,
    flexDirection: "row",
    fontFamily: "Montserrat-Regular",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  iconinput: {
    marginRight: 5,
  },
  noDebtorsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDebtorsText: {
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
    fontSize: 18,
    marginBottom: 10,
  },
});

export default Home;
