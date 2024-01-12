import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { StyleSheet } from "react-native";

import DrawerContentAdmin from "../components/DrawerContentAdmin";
import DrawerContentUser from "../components/DrawerContentUser";
import ChangePassword from "../views/ChangePassword";
import DetailDebtor from "../views/DetailDebtor";
import Home from "../views/Home";
import Login from "../views/Login";
import NewDebtor from "../views/NewDebtor";
import Splashscreen from "../views/Splashscreen";

const Drawer = createDrawerNavigator();

const Routes = ({ userLoggedIn, setUserLoggedIn, setUser, user }) => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        //Se tiene que condicionar con el return, ya que si no, sale en blanco
        drawerContent={(props) => {
          if (userLoggedIn && user && user.privilegios === "admin") {
            // User is logged in and has admin privileges
            return <DrawerContentAdmin user={user} {...props} />;
          } else if (userLoggedIn && user) {
            // User is logged in but not an admin
            return <DrawerContentUser user={user} {...props} />;
          } else {
            // User is not logged in
            return null; // or any other default drawer content
          }
        }}
        styles={styles.container}
        initialRouteName="SplashScreen"
      >
        <Drawer.Screen
          name="SplashScreen"
          options={{ headerShown: false, swipeEdgeWidth: 0 }}
        >
          {(props) => <Splashscreen {...props} userLoggedIn={userLoggedIn} />}
        </Drawer.Screen>
        <Drawer.Screen
          name="Login"
          options={{ headerShown: false, swipeEdgeWidth: 0 }}
        >
          {(props) => (
            <Login
              {...props}
              setUser={setUser}
              setUserLoggedIn={setUserLoggedIn}
            />
          )}
        </Drawer.Screen>
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
        <Drawer.Screen
          name="DetailDebtor"
          component={DetailDebtor}
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
