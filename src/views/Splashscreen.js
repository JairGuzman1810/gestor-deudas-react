import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";

const Splashscreen = () => {
  const navigation = useNavigation();

  let [fontsLoaded] = useFonts({
    "Monserrat-Bold": require("../fonts/montserratbold.ttf"),
    "Monserrat-Regular": require("../fonts/montserratregular.ttf"),
  });
  useEffect(() => {
    const timer = setTimeout(() => {
      SplashScreen.hideAsync().then(() => {
        // Navigate to the appropriate screen (e.g., Login or Home)
        navigation.replace("Login"); // Replace with the actual screen name
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image source={require("../images/logotwins.png")} style={styles.image} />
      <Text style={[styles.welcome, { fontFamily: "Monserrat-Regular" }]}>
        Bienvenido
      </Text>
      <ActivityIndicator
        style={styles.indicator}
        size="large"
        color="#DDD9D9"
      ></ActivityIndicator>
    </View>
  );
};

export default Splashscreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  image: {
    marginTop: 164,
    width: "100%",
    height: 150,
  },
  welcome: {
    fontSize: 25,
    marginTop: 80,
    color: "#878585",
  },
  indicator: {
    marginTop: 20,
  },
});
