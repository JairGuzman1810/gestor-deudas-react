import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { ActivityIndicator, Image, StyleSheet, Text } from "react-native";
import Animated, {
  withTiming,
  useSharedValue,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";

const Splashscreen = ({ userLoggedIn }) => {
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
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <Image source={require("../images/logotwins.png")} style={styles.image} />
      <Text style={[styles.welcome, { fontFamily: "Monserrat-Regular" }]}>
        Bienvenido
      </Text>
      <ActivityIndicator
        style={styles.indicator}
        size="large"
        color="#DDD9D9"
      />
    </Animated.View>
  );
};

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

export default Splashscreen;
