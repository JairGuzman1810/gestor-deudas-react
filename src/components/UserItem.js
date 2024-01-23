import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";

const UserItem = ({ user }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.leftcontainer}>
          <Text style={styles.email}>{user.correo}</Text>
          <Text style={styles.name}>{user.nombre}</Text>
        </View>
        <View style={styles.rightcontainer}>
          <View style={styles.button}>
            <TouchableOpacity style={styles.touchableOpacity}>
              <Text style={styles.buttonText}>EDITAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default UserItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginHorizontal: 4,
    marginBottom: 5,
    borderRadius: 2,
    borderTopStartRadius: 4,
    borderBottomStartRadius: 4,
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
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftcontainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    marginLeft: 20,
    flex: 1,
  },
  rightcontainer: {
    alignItems: "flex-end", // Align to the right edge
    justifyContent: "center", // Align to the bottom
    marginRight: 20,
  },
  button: {
    backgroundColor: "#1A7A13",
    borderRadius: 1,
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
  touchableOpacity: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  email: {
    fontFamily: "Montserrat-Bold",
    fontSize: 16,
    marginTop: 10,
  },
  name: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    marginVertical: 10,
    color: "#878585",
  },
});
