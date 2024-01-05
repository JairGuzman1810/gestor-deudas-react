import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import Routes from "./src/router/Routes";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Routes></Routes>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
