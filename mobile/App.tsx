import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

import type { RootStackParamList } from "./src/navigation/types";
import HomeScreen from "./src/screens/HomeScreen";
import EventDetailScreen from "./src/screens/EventDetailScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import MyTicketsScreen from "./src/screens/MyTicketsScreen";
import OrganizerDashboardScreen from "./src/screens/OrganizerDashboardScreen";
import OrganizerNewEventScreen from "./src/screens/OrganizerNewEventScreen";
import OrganizerScanScreen from "./src/screens/OrganizerScanScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerTintColor: "#5b21b6" }}>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Billetterie+" }} />
          <Stack.Screen name="EventDetail" component={EventDetailScreen} options={{ title: "Détail" }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Connexion" }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Créer un compte" }} />
          <Stack.Screen name="MyTickets" component={MyTicketsScreen} options={{ title: "Mes billets" }} />
          <Stack.Screen name="OrganizerDashboard" component={OrganizerDashboardScreen} options={{ title: "Espace organisateur" }} />
          <Stack.Screen name="OrganizerNewEvent" component={OrganizerNewEventScreen} options={{ title: "Nouvel événement" }} />
          <Stack.Screen name="OrganizerScan" component={OrganizerScanScreen} options={{ title: "Scanner" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
