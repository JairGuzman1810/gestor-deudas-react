import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";

import DebtorItem from "../components/DebtorItem";
import { getAllDebtors } from "../utils/DebtorHelper";

const Home = () => {
  const [debtors, setDebtors] = useState({});
  const [isSearching, setIsSerching] = useState(false);
  useEffect(() => {
    // Set up the real-time listener and get the unsubscribe function
    const unsubscribe = getAllDebtors(setDebtors);

    // Clean up the listener when the component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []); // El array vacío [] significa que se ejecutará solo una vez
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
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
          }}
        >
          <Ionicons name="filter" size={28} color="white" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={Object.values(debtors)}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => <DebtorItem debtor={item} />}
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
});

export default Home;
