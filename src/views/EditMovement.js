/* eslint-disable prettier/prettier */
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Pressable,
  ToastAndroid,
  Alert,
} from "react-native";

import MovementModal from "../components/MovementModal";
import { updateMovement } from "../utils/MovementsHelper";

const EditMovement = ({ route }) => {
  const { movement, debtor, isPayment } = route.params;
  const [amount, setAmount] = useState(Math.abs(movement.importe).toString());
  const [description, setDescription] = useState(movement.descripcion);
  const [date, setDate] = useState(new Date(movement.fecha));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const navigation = useNavigation();

  const goBack = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "DetailDebtor", params: { debtor } }],
    });
  };

  const handleDatePress = () => {
    setShowDatePicker(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const handleUpdateMovement = async () => {
    if (
      Math.abs(amount) === Math.abs(movement.importe) &&
      description === movement.descripcion &&
      date.getTime() === new Date(movement.fecha).getTime()
    ) {
      // Mostrar mensaje indicando que no hay cambios
      if (Platform.OS === "android") {
        ToastAndroid.show(
          "No hay cambios para actualizar.",
          ToastAndroid.SHORT
        );
      } else {
        Alert.alert("No hay cambios para actualizar.");
      }
      return;
    }

    try {
      const result = await updateMovement(
        movement,
        debtor,
        isPayment ? amount : -amount,
        description,
        date
      );
      if (result) {
        console.log("Movement updated successfully");

        if (Platform.OS === "android") {
          ToastAndroid.show(
            "Movimiento actualizado para el deudor " + debtor.nombre + ".",
            ToastAndroid.LONG
          );
        } else {
          Alert.alert(
            "Movimiento actualizado para el deudor " + debtor.nombre + "."
          );
        }

        // Clear the fields after successful insertion
        navigation.reset({
          index: 0,
          routes: [{ name: "DetailDebtor", params: { debtor } }],
        });
      } else {
        console.log("Update failed");

        // Display error message for failure
        if (Platform.OS === "android") {
          ToastAndroid.show(
            "Error al actualizar el movimiento. Inténtelo de nuevo.",
            ToastAndroid.LONG
          );
        } else {
          Alert.alert(
            "Error",
            "No se pudo actualizar el movimiento. Por favor, inténtelo de nuevo."
          );
        }
      }
    } catch (error) {
      console.log(error);

      // Handle errors with Toast or Alert
      if (Platform.OS === "android") {
        ToastAndroid.show("Error al actualizar movimiento.", ToastAndroid.LONG);
      } else {
        Alert.alert(
          "Error",
          "No se pudo actualizar el movimiento. Por favor, inténtelo de nuevo."
        );
      }
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios"); // Close the DatePicker for iOS immediately
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const formatText = (text) => {
    // Remove commas from the input
    const withoutCommas = text.replace(/,/g, "");

    // Allow only numbers and up to two decimal places
    let formattedText = withoutCommas.replace(/[^0-9.]/g, ""); // Remove non-numeric and non-dot characters
    const parts = formattedText.split(".");

    if (parts.length > 1) {
      // If there's a decimal part
      formattedText = `${parts[0]}.${parts[1].slice(0, 2)}`;
    }

    // Update the state with the cleaned text
    setAmount(formattedText);
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
              onPress={goBack}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>
          {isPayment ? "Editar Abono" : "Editar Deuda"}
        </Text>

        <TouchableOpacity
          style={[styles.iconButton, { marginHorizontal: 10 }]}
          onPress={() => {
            /* Handle filter button press */
            setIsModalVisible(true);
          }}
        >
          <Ionicons name="trash" size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          disabled={
            amount === "" ||
            isNaN(parseFloat(amount)) ||
            parseFloat(amount) <= 0
          }
          style={[
            styles.iconButton,
            {
              opacity:
                amount === "" ||
                isNaN(parseFloat(amount)) ||
                parseFloat(amount) <= 0
                  ? 0.5
                  : 1,
            },
          ]}
          onPress={handleUpdateMovement}
        >
          <Ionicons
            name={
              amount === "" ||
              isNaN(parseFloat(amount)) ||
              parseFloat(amount) <= 0
                ? "save-outline"
                : "save"
            }
            size={28}
            color="white"
          />
        </TouchableOpacity>
      </View>
      {/* Nombre */}
      <View style={styles.contentcontainer}>
        <Text style={styles.contenttitle}>Nombre</Text>
        <View style={styles.separator} />
        <View style={styles.namecontainer}>
          <TouchableOpacity>
            <Ionicons name="person" size={18} color="black" />
          </TouchableOpacity>
          <Text style={styles.name}>{debtor.nombre}</Text>
        </View>
      </View>
      {/* Importe */}
      <View style={styles.contentcontainer}>
        <Text style={styles.contenttitle}>Importe</Text>
        <View style={styles.separator} />
      </View>
      <View style={styles.section}>
        <View style={styles.input}>
          <Ionicons
            style={styles.iconinput}
            size={20}
            name="cash"
            color="black"
          />
          <TextInput
            value={amount}
            inputMode="numeric"
            onChangeText={(text) => formatText(text)}
            style={styles.textinput}
            placeholder="Importe"
          />
        </View>
        <Text style={[styles.formattedTitle]}>Previsualización:</Text>
        <Text
          style={[
            styles.formattedAmount,
            { color: isPayment ? "#1A7A13" : "#B11D1D" },
          ]}
        >
          {parseFloat(
            isPayment
              ? amount === ""
                ? 0
                : amount
              : -(amount === "" ? 0 : amount)
          ).toLocaleString(undefined, {
            style: "currency",
            currency: "USD", // Puedes cambiarlo según tu moneda
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
      </View>
      {/* Descripcion */}
      <View style={styles.contentcontainer}>
        <Text style={styles.contenttitle}>Descripción</Text>
        <View style={styles.separator} />
      </View>
      <View style={[styles.section]}>
        <View style={[styles.input, { height: 125 }]}>
          <Ionicons
            style={styles.iconinput}
            size={20}
            name="book"
            color="black"
          />
          <TextInput
            value={description}
            onChangeText={(text) => setDescription(text)}
            style={styles.textinput}
            placeholder="Notas/Descripción"
            multiline
          />
        </View>
      </View>
      {/* Date */}
      <View style={styles.contentcontainer}>
        <Text style={styles.contenttitle}>Fecha</Text>
        <View style={styles.separator} />
      </View>
      <View
        style={[
          styles.section,
          { alignItems: "center", width: "65%", alignSelf: "center" },
        ]}
      >
        <Pressable onPress={handleDatePress} style={styles.input}>
          <Ionicons
            style={styles.iconinput}
            size={20}
            name="calendar"
            color="black"
          />
          <Text
            style={[styles.textinput, { textAlign: "center", marginLeft: -10 }]}
          >
            {date ? date.toLocaleDateString() : "Fecha"}
          </Text>
        </Pressable>
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          format="DD/MM/YYY"
          mode="date"
          display="calendar"
          onChange={handleDateChange}
        />
      )}
      <MovementModal
        debtor={debtor}
        movement={movement}
        isModalVisible={isModalVisible}
        hideModal={hideModal}
      />
    </View>
  );
};

export default EditMovement;

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
  titlecontainer: {
    flex: 1,
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
  separator: {
    height: 1,
    backgroundColor: "#878585",
    marginTop: 5,
    marginBottom: 10,
  },
  namecontainer: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    marginLeft: 2,
    fontFamily: "Montserrat-Bold",
    fontSize: 20,
    color: "#000",
  },
  section: {
    marginHorizontal: 15,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    marginHorizontal: 10,
    fontSize: 18,
    flexDirection: "row",
    fontFamily: "Montserrat-Regular",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconinput: {
    marginRight: 5,
  },
  textinput: {
    flex: 1,
    fontFamily: "Montserrat-Regular",
    fontSize: 18,
    height: "100%",
  },
  formattedAmount: {
    fontFamily: "Montserrat-Regular",
    fontSize: 18,
    color: "#000",
    textAlign: "center",
    marginTop: 5,
  },
  formattedTitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 17,
    color: "#000",
    textAlign: "center",
    marginTop: 5,
  },
});
