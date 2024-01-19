/* eslint-disable prettier/prettier */
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
  FlatList,
  TextInput,
} from "react-native";

import DebtorItem from "../components/DebtorItem";
import SortDebtorModal from "../components/SortDebtorModal";
import { getAllDebtors } from "../utils/DebtorHelper";
import { printDebtors } from "../utils/PrintUtils";

const Home = () => {
  const [debtors, setDebtors] = useState({});
  const [isSearching, setIsSearching] = useState(false);
  const [totalDebt, setTotalDebt] = useState(0);
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sortingOrder, setSortingOrder] = useState("Asc");
  const [selectedOption, setSelectedOption] = useState("Fecha de creación");
  const [sortingValues, setSortingValues] = useState({
    selectedOption,
    sortingOrder,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Fetch the saved search text from AsyncStorage on component mount
    AsyncStorage.getItem("searchText")
      .then((storedSearchText) => {
        if (storedSearchText) {
          setSearch(storedSearchText);
          setIsSearching(true);
          setSearchFocused(false);
        }
      })
      .catch((error) => console.error(error));
  }, []);

  const fetchDataAndSort = async () => {
    let storedSortingValues;

    try {
      // Recuperar la cadena JSON de sortingValues desde AsyncStorage
      const storedSortingValuesString =
        await AsyncStorage.getItem("sortingValues");

      // Si hay una cadena JSON válida, convertirla a un objeto
      if (storedSortingValuesString) {
        storedSortingValues = JSON.parse(storedSortingValuesString);

        // Actualizar el estado con los valores recuperados
      }
    } catch (error) {
      console.error("Error fetching data from AsyncStorage:", error);
      // Manejar el error según sea necesario
      return;
    }

    setIsLoading(true);

    try {
      const debtors = await getAllDebtors();

      const debtorsArray = Object.values(debtors);
      // Handle the sorting logic based on the selected option
      const sortedDebtors = [...debtorsArray];

      switch (storedSortingValues.selectedOption) {
        case "Alfabeticamente":
          sortedDebtors.sort((a, b) =>
            storedSortingValues.sortingOrder === "Asc"
              ? a.nombre.localeCompare(b.nombre)
              : b.nombre.localeCompare(a.nombre)
          );
          break;
        case "Fecha del movimiento":
          sortedDebtors.sort((a, b) =>
            storedSortingValues.sortingOrder === "Asc"
              ? a.ultimomovimiento - b.ultimomovimiento
              : b.ultimomovimiento - a.ultimomovimiento
          );
          break;
        case "Fecha de creación":
          sortedDebtors.sort((a, b) =>
            storedSortingValues.sortingOrder === "Asc"
              ? a.creado - b.creado
              : b.creado - a.creado
          );
          break;
        case "Deuda":
          sortedDebtors.sort((a, b) =>
            storedSortingValues.sortingOrder === "Asc"
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
    } catch (error) {
      console.error("Error fetching debtors:", error);
      // Manejar el error según sea necesario
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Llamar a la función para realizar las consultas al montar el componente
    fetchDataAndSort();
  }, [sortingValues]);

  useEffect(() => {
    const fetchSortData = async () => {
      try {
        // Recuperar la cadena JSON de sortingValues desde AsyncStorage
        const storedSortingValuesString =
          await AsyncStorage.getItem("sortingValues");

        // Si hay una cadena JSON válida, convertirla a un objeto
        if (storedSortingValuesString) {
          const storedSortingValues = JSON.parse(storedSortingValuesString);

          setSelectedOption(storedSortingValues.selectedOption);
          setSortingOrder(storedSortingValues.sortingOrder);

          // Actualizar el estado con los valores recuperados
        }
      } catch (error) {
        console.error("Error fetching data from AsyncStorage:", error);
      }

      // Set up the real-time listener and get the unsubscribe function
    };

    // Llamar a la función para realizar las consultas al montar el componente
    fetchSortData();
  }, []); //

  useEffect(() => {
    // Calculate the total debt whenever debtors change
    const newTotalDebt = Object.values(debtors).reduce(
      (total, debtor) => total + (debtor.deudaindividual ?? 0),
      0
    );

    setTotalDebt(newTotalDebt);
  }, [debtors]);

  useEffect(() => {
    //Si borra elementos y se esta buscando cierra el buscador.
    if (Object.values(debtors).length === 0) {
      setIsSearching(false);
    }
  }, [debtors]);

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const filteredDebtors = Object.values(debtors).filter((debtor) => {
    const nombre = debtor?.nombre;
    const deudaindividual = debtor?.deudaindividual;
    const ultimomovimiento = debtor?.ultimomovimiento;

    if (
      nombre !== undefined &&
      ultimomovimiento !== undefined &&
      deudaindividual !== undefined
    ) {
      const formattedUltimoMovimiento = new Date(
        ultimomovimiento
      ).toLocaleString();

      const formattedDeudaindividual = deudaindividual.toLocaleString(
        undefined,
        {
          style: "currency",
          currency: "USD", // Puedes cambiarlo según tu moneda
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      );

      return (
        nombre.toLowerCase().includes(search && search.toLowerCase()) ||
        formattedDeudaindividual.toString().includes(search) ||
        formattedDeudaindividual.replace(/,/g, "").includes(search) || // Búsqueda sin comas
        formattedUltimoMovimiento.includes(search)
      );
    }

    return false;
  });

  const handleSearchChange = (newSearchText) => {
    setSearch(newSearchText);

    // Save the new search text to AsyncStorage
    AsyncStorage.setItem("searchText", newSearchText)
      .then(() => console.log("Search text saved to AsyncStorage"))
      .catch((error) => console.error(error));
  };

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
            navigation.navigate("NewDebtor");
          }}
        >
          <Ionicons name="person-add" size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          disabled={isLoading || Object.values(debtors).length === 0}
          style={[
            styles.iconButton,
            {
              opacity:
                isLoading || Object.values(debtors).length === 0 ? 0.5 : 1,
            },
          ]}
          onPress={() =>
            printDebtors(isSearching ? filteredDebtors : Object.values(debtors))
          }
        >
          <Ionicons
            name={
              isLoading || Object.values(debtors).length === 0
                ? "download-outline"
                : "download"
            }
            size={28}
            color="white"
          />
        </TouchableOpacity>

        <TouchableOpacity
          disabled={isLoading || Object.values(debtors).length === 0}
          style={[
            styles.iconButton,
            {
              backgroundColor: isSearching
                ? "#D3D2D2" // Color para deudaindividual igual a 0
                : "#808080",
              opacity:
                isLoading || Object.values(debtors).length === 0 ? 0.5 : 1,
            },
          ]}
          onPress={() => {
            //desactivar/activar la barra de busqueda.
            setIsSearching(!isSearching);
            //Siempre true para que se active el teclado.
            setSearchFocused(true);
            //Vaciamos para no quede busqueda anterior.
            setSearch("");
            //Guardamos en el async, evitamos que abra la barra de busqueda
            //con algo que ya no se esta buscando.
            AsyncStorage.setItem("searchText", "")
              .then(() => console.log("Search text cleared"))
              .catch((error) => console.error(error));
          }}
        >
          <Ionicons
            name={
              isSearching || isLoading || Object.values(debtors).length === 0
                ? "search-circle-outline"
                : "search-circle"
            }
            size={28}
            color="white"
          />
        </TouchableOpacity>

        <TouchableOpacity
          disabled={isLoading || Object.values(debtors).length === 0}
          style={[
            styles.iconButton,
            {
              opacity:
                isLoading || Object.values(debtors).length === 0 ? 0.5 : 1,
            },
          ]}
          onPress={() => {
            /* Handle cancel button press */
            setIsModalVisible(true);
          }}
        >
          <Ionicons
            name={
              isLoading || Object.values(debtors).length === 0
                ? "funnel-outline"
                : "funnel"
            }
            size={28}
            color="white"
          />
        </TouchableOpacity>
      </View>
      {/* BARRA DE BUSQUEDA */}
      {isSearching && (
        <View style={styles.input}>
          <TextInput
            value={search}
            onChangeText={handleSearchChange}
            style={styles.textinput}
            placeholder="Buscar"
            autoFocus={searchFocused}
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
              refreshing={isRefreshing}
              onRefresh={fetchDataAndSort}
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
            {parseFloat(totalDebt).toLocaleString(undefined, {
              style: "currency",
              currency: "USD", // Puedes cambiarlo según tu moneda
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
        </View>
      </View>
      <SortDebtorModal
        isModalVisible={isModalVisible}
        hideModal={hideModal}
        sortingOrder={sortingOrder}
        setSortingOrder={setSortingOrder}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        sortingValues={sortingValues}
        setSortingValues={setSortingValues}
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
        elevation: 10,
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
    borderColor: "#000",
    marginTop: 1,
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
  touchableOpacity: {
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
});

export default Home;
