import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  ActivityIndicator,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";

import UserItem from "../components/UserItem";
import { getAllUsers } from "../utils/UserHelpers";

const MyUsers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [users, setUsers] = useState({});

  const navigation = useNavigation();

  const fetchData = async () => {
    setIsLoading(true);
    setIsRefreshing(true);

    try {
      const users = await getAllUsers();
      setUsers(users);
    } catch (error) {
      console.error("Error fetching debtors:", error);
      // Manejar el error según sea necesario
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const goBack = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  useEffect(() => {
    // Llamar a la función para realizar las consultas al montar el componente
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.toolbarContainer}>
          <TouchableOpacity style={styles.toolbarButton} onPress={goBack}>
            <Ionicons name="arrow-back" size={30} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.titlecontainer}>
          <Text style={styles.title}>Mis usuarios</Text>
        </View>
      </View>
      {isLoading ? (
        <ActivityIndicator style={{ flex: 1 }} size="large" color="#808080" />
      ) : (
        <>
          {Object.values(users).length === 0 ? (
            <View style={styles.noUsersContainer}>
              <Text style={styles.noUsersText}>
                Sin usuarios. Haga su primer usuario con el boton
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("CreateUser")}
              >
                <Ionicons name="person-add" size={28} color="black" />
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={Object.values(users)}
              keyExtractor={(item) => item.uid}
              refreshing={isRefreshing}
              onRefresh={fetchData}
              renderItem={({ item }) => <UserItem user={item} />}
            />
          )}
        </>
      )}
    </View>
  );
};

export default MyUsers;

const styles = StyleSheet.create({
  container: {
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
    paddingHorizontal: 10,
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
  noUsersContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noUsersText: {
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
    fontSize: 18,
    marginBottom: 10,
    marginHorizontal: 20,
  },
});
