import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Splashscreen from "../views/Splashscreen";
import Login from "../views/Login";
import HomeAdmin from "../views/HomeAdmin";
import Home from "../views/Home";
import DrawerContent from "../components/DrawerContent";

const Drawer = createDrawerNavigator();

const Routes = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <DrawerContent {...props} />}
        styles={styles.container}
        initialRouteName="SplashScreen"
      >
        <Drawer.Screen
          name="SplashScreen"
          component={Splashscreen}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Drawer.Screen name="Home" component={isAdmin ? HomeAdmin : Home} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default Routes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
