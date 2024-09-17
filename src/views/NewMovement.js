/* eslint-disable prettier/prettier */
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import { darkColors, lightColors } from "../colors";
import { addMovement } from "../utils/MovementsHelper";

const NewMovement = ({ route }) => {
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === "light" ? lightColors : darkColors;
  const { debtor, isPayment } = route.params;
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation();

  const goBack = () => {
    setAmount("");
    setDescription("");
    setDate(new Date());
    navigation.navigate("DetailDebtor", { debtor });
  };

  const handleAddMovement = async () => {
    try {
      const result = await addMovement(
        isPayment ? amount : -amount,
        description,
        date,
        debtor
      );
      if (result !== null) {
        if (Platform.OS === "android") {
          ToastAndroid.show(
            "Nuevo movimiento registrado para el deudor " + debtor.nombre + ".",
            ToastAndroid.LONG
          );
        } else {
          Alert.alert(
            "Nuevo movimiento registrado para el deudor " + debtor.nombre + "."
          );
        }

        // Clear the fields after successful insertion
        navigation.reset({
          index: 0,
          routes: [{ name: "DetailDebtor", params: { debtor: result } }],
        });
      } else {
        // Display error message for failure
        if (Platform.OS === "android") {
          ToastAndroid.show(
            "Error al agregar el movimiento. Inténtelo de nuevo.",
            ToastAndroid.LONG
          );
        } else {
          Alert.alert(
            "Error",
            "No se pudo agregar el movimiento. Por favor, inténtelo de nuevo."
          );
        }
      }
    } catch (error) {
      console.log(error);

      // Handle errors with Toast or Alert
      if (Platform.OS === "android") {
        ToastAndroid.show("Error al agregar movimiento.", ToastAndroid.LONG);
      } else {
        Alert.alert(
          "Error",
          "No se pudo agregar el movimiento. Por favor, inténtelo de nuevo."
        );
      }
    }
  };

  const handleDatePress = () => {
    setShowDatePicker(true);
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
    <View
      style={[styles.container, { backgroundColor: themeColors.backgroundTwo }]}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.toolbarContainer}>
          <TouchableOpacity style={[styles.toolbarButton]}>
            <Ionicons
              name="arrow-back"
              size={30}
              color="white"
              onPress={goBack}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>
          {isPayment ? "Nuevo Abono" : "Nueva Deuda"}
        </Text>

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
          onPress={handleAddMovement}
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
        <Text style={[styles.contenttitle, { color: themeColors.text }]}>
          Nombre
        </Text>
        <View style={styles.separator} />
        <View style={styles.namecontainer}>
          <TouchableOpacity>
            <Ionicons name="person" size={18} color={themeColors.icon} />
          </TouchableOpacity>
          <Text style={[styles.name, { color: themeColors.text }]}>
            {debtor.nombre}
          </Text>
        </View>
      </View>
      {/* Importe */}
      <View style={styles.contentcontainer}>
        <Text style={[styles.contenttitle, { color: themeColors.text }]}>
          Importe
        </Text>
        <View style={styles.separator} />
      </View>
      <View style={styles.section}>
        <View
          style={[
            styles.input,
            { backgroundColor: themeColors.backgroundFirst },
          ]}
        >
          <Ionicons
            style={styles.iconinput}
            size={20}
            name="cash"
            color={themeColors.icon}
          />
          <TextInput
            value={amount}
            inputMode="numeric"
            onChangeText={(text) => formatText(text)}
            style={[styles.textinput, { color: themeColors.text }]}
            placeholder="Importe"
            placeholderTextColor="#808080"
          />
        </View>
        <Text style={[styles.formattedTitle, { color: themeColors.text }]}>
          Previsualización:
        </Text>
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
        <Text style={[styles.contenttitle, { color: themeColors.text }]}>
          Descripción
        </Text>
        <View style={styles.separator} />
      </View>
      <View style={styles.section}>
        <View
          style={[
            styles.input,
            { height: 125, backgroundColor: themeColors.backgroundFirst },
          ]}
        >
          <Ionicons
            style={styles.iconinput}
            size={20}
            name="book"
            color={themeColors.icon}
          />
          <TextInput
            value={description}
            onChangeText={(text) => setDescription(text)}
            style={[styles.textinput, { color: themeColors.text }]}
            placeholder="Notas/Descripción"
            multiline
            placeholderTextColor="#808080"
          />
        </View>
      </View>
      {/* Date */}
      <View style={styles.contentcontainer}>
        <Text style={[styles.contenttitle, { color: themeColors.text }]}>
          Fecha
        </Text>
        <View style={styles.separator} />
      </View>
      <View
        style={[
          styles.section,
          { alignItems: "center", width: "65%", alignSelf: "center" },
        ]}
      >
        <Pressable
          onPress={handleDatePress}
          style={[
            styles.input,
            { backgroundColor: themeColors.backgroundFirst },
          ]}
        >
          <Ionicons
            style={styles.iconinput}
            size={20}
            name="calendar"
            color={themeColors.icon}
          />
          <Text
            style={[
              styles.textinput,
              { textAlign: "center", marginLeft: -10, color: themeColors.text },
            ]}
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
    </View>
  );
};

export default NewMovement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  contentcontainer: {
    padding: 8,
    justifyContent: "space-between",
  },
  contenttitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 17,
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
