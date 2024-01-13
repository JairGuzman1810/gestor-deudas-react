import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";

const NewMovement = ({ route }) => {
  const { debtor, isPayment } = route.params;

  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.toolbarContainer}>
          <TouchableOpacity style={[styles.toolbarButton]}>
            <Ionicons
              name="arrow-back"
              size={30}
              color="white"
              onPress={() => navigation.navigate("DetailDebtor", { debtor })}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>
          {isPayment ? "Nuevo Abono" : "Nueva Deuda"}
        </Text>

        <TouchableOpacity style={[styles.iconButton]} onPress={() => {}}>
          <Ionicons name="save" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NewMovement;

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
    paddingHorizontal: 10,
    marginBottom: 10,
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
  titlecontainer: {
    flex: 1,
  },
  title: {
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
});
