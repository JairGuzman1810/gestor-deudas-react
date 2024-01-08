import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Splashscreen from "../views/Splashscreen";
import Login from "../views/Login";
import Home from "../views/Home";
import DrawerContentUser from "../components/DrawerContentUser";
import ChangePassword from "../views/ChangePassword";
import DrawerContentAdmin from "../components/DrawerContentAdmin";
import NewDebtor from "../views/NewDebtor";

const Drawer = createDrawerNavigator();

const Routes = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <NavigationContainer>
      <Drawer.Navigator
        //Se tiene que condicionar con el return, ya que si no, sale en blanco
        drawerContent={(props) => {
          return isAdmin ? (
            <DrawerContentAdmin {...props} />
          ) : (
            <DrawerContentUser {...props} />
          );
        }}
        styles={styles.container}
        initialRouteName="SplashScreen"
      >
        <Drawer.Screen
          name="SplashScreen"
          component={Splashscreen}
          options={{ headerShown: false, swipeEdgeWidth: 0 }}
        />
        <Drawer.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false, swipeEdgeWidth: 0 }}
        />
        <Drawer.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={{ headerShown: false, swipeEdgeWidth: 0 }}
        />
        <Drawer.Screen
          name="NewDebtor"
          component={NewDebtor}
          options={{ headerShown: false, swipeEdgeWidth: 0 }}
        />
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
