import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { api, setSession } from "../lib/api";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    try {
      const res = await api("/auth/login", { method: "POST", body: { email, password }, auth: false });
      await setSession(res.token, res.user);
      navigation.reset({
        index: 0,
        routes: [{ name: res.user.role === "ORGANIZER" ? "OrganizerDashboard" : "Home" }],
      });
    } catch (e: any) {
      Alert.alert("Erreur de connexion", e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <TouchableOpacity onPress={handleLogin} disabled={loading} style={styles.btn}>
        <Text style={styles.btnText}>{loading ? "Connexion…" : "Se connecter"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>Pas de compte ? Créer un compte</Text>
      </TouchableOpacity>
      <Text style={styles.hint}>
        Démo : organisateur@demo.com / password123 — client@demo.com / password123
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", backgroundColor: "#f8fafc" },
  title: { fontSize: 26, fontWeight: "800", marginBottom: 24 },
  input: { borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 10, padding: 12, marginBottom: 12, backgroundColor: "white" },
  btn: { backgroundColor: "#1d4ed8", borderRadius: 10, paddingVertical: 14, alignItems: "center", marginTop: 8 },
  btnText: { color: "white", fontWeight: "700" },
  link: { color: "#1d4ed8", textAlign: "center", marginTop: 16 },
  hint: { color: "#94a3b8", fontSize: 12, textAlign: "center", marginTop: 24 },
});
