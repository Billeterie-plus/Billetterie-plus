import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { api, setSession } from "../lib/api";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"BUYER" | "ORGANIZER">("BUYER");
  const [organizationName, setOrganizationName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    try {
      const res = await api("/auth/register", {
        method: "POST",
        body: { name, email, password, role, organizationName },
        auth: false,
      });
      await setSession(res.token, res.user);
      navigation.reset({
        index: 0,
        routes: [{ name: res.user.role === "ORGANIZER" ? "OrganizerDashboard" : "Home" }],
      });
    } catch (e: any) {
      Alert.alert("Erreur", e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>
      <TextInput placeholder="Nom" value={name} onChangeText={setName} style={styles.input} />
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Mot de passe (8 caractères min.)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <View style={styles.roleRow}>
        <TouchableOpacity onPress={() => setRole("BUYER")} style={[styles.roleBtn, role === "BUYER" && styles.roleBtnActive]}>
          <Text style={role === "BUYER" ? styles.roleTextActive : styles.roleText}>Acheteur</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRole("ORGANIZER")} style={[styles.roleBtn, role === "ORGANIZER" && styles.roleBtnActive]}>
          <Text style={role === "ORGANIZER" ? styles.roleTextActive : styles.roleText}>Organisateur</Text>
        </TouchableOpacity>
      </View>

      {role === "ORGANIZER" && (
        <TextInput
          placeholder="Nom de votre organisation"
          value={organizationName}
          onChangeText={setOrganizationName}
          style={styles.input}
        />
      )}

      <TouchableOpacity onPress={handleSubmit} disabled={loading} style={styles.btn}>
        <Text style={styles.btnText}>{loading ? "Création…" : "Créer mon compte"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", backgroundColor: "#f8fafc" },
  title: { fontSize: 26, fontWeight: "800", marginBottom: 24 },
  input: { borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 10, padding: 12, marginBottom: 12, backgroundColor: "white" },
  roleRow: { flexDirection: "row", gap: 10, marginBottom: 12 },
  roleBtn: { flex: 1, borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 10, paddingVertical: 10, alignItems: "center", backgroundColor: "white" },
  roleBtnActive: { backgroundColor: "#1d4ed8", borderColor: "#1d4ed8" },
  roleText: { color: "#334155" },
  roleTextActive: { color: "white", fontWeight: "700" },
  btn: { backgroundColor: "#1d4ed8", borderRadius: 10, paddingVertical: 14, alignItems: "center", marginTop: 8 },
  btnText: { color: "white", fontWeight: "700" },
});
