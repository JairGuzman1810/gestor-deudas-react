import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  useColorScheme,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { darkColors, lightColors } from "../colors";

const Splashscreen = ({ userLoggedIn }) => {
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === "light" ? lightColors : darkColors;

  const navigation = useNavigation();

  const opacity = useSharedValue(0);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const [fontsLoaded] = useFonts({
    "Monserrat-Bold": require("../fonts/montserratbold.ttf"),
    "Monserrat-Regular": require("../fonts/montserratregular.ttf"),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      SplashScreen.hideAsync().then(() => {
        // Navigate to the appropriate screen (e.g., Login or Home)
        if (userLoggedIn) {
          navigation.navigate("Home");
        } else {
          navigation.navigate("Login");
        }
      });
    }, 3000);

    opacity.value = withTiming(1, {
      duration: 1000, // Adjust the duration as needed
      easing: Easing.inOut(Easing.ease),
    });

    return () => clearTimeout(timer);
  }, [navigation, opacity, userLoggedIn]); //VERIFICA SI CAMBIA USERLOGGEDIN

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        animatedContainerStyle,
        { backgroundColor: themeColors.backgroundFirst },
      ]}
    >
      <Image source={require("../images/logotwins.png")} style={styles.image} />
      <Text style={[styles.welcome, { color: themeColors.textSplash }]}>
        Bienvenido
      </Text>
      <ActivityIndicator
        style={styles.indicator}
        size="large"
        color={themeColors.accent}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontFamily: "Monserrat-Regular",
  },
  indicator: {
    marginTop: 20,
  },
});

export default Splashscreen;
