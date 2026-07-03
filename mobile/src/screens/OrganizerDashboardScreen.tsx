import { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { api, clearSession } from "../lib/api";

type Props = NativeStackScreenProps<RootStackParamList, "OrganizerDashboard">;

export default function OrganizerDashboardScreen({ navigation }: Props) {
  const [events, setEvents] = useState<any[]>([]);

  const load = useCallback(() => {
    api("/organizer/events").catch(() => []).then((e) => setEvents(e || []));
  }, []);

  useEffect(() => {
    load();
    const unsub = navigation.addListener("focus", load);
    return unsub;
  }, [load, navigation]);

  async function logout() {
    await clearSession();
    navigation.reset({ index: 0, routes: [{ name: "Home" }] });
  }

  return (
    <View style={styles.container}>
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate("OrganizerScan")}>
          <Text style={styles.actionText}>📷 Scanner un billet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPrimary]} onPress={() => navigation.navigate("OrganizerNewEvent")}>
          <Text style={styles.actionTextPrimary}>+ Nouvel événement</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={<Text style={styles.empty}>Aucun événement pour l'instant.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardMeta}>
              {item.type} · {new Date(item.startDateTime).toLocaleDateString("fr-FR")} · {item.status}
            </Text>
          </View>
        )}
      />

      <TouchableOpacity onPress={logout} style={styles.logout}>
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  actionsRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  actionBtn: { flex: 1, backgroundColor: "#e2e8f0", borderRadius: 10, paddingVertical: 12, alignItems: "center" },
  actionBtnPrimary: { backgroundColor: "#5b21b6" },
  actionText: { fontWeight: "600", color: "#334155" },
  actionTextPrimary: { fontWeight: "600", color: "white" },
  card: { backgroundColor: "white", borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: "#e2e8f0" },
  cardTitle: { fontWeight: "700" },
  cardMeta: { color: "#64748b", marginTop: 4, fontSize: 12 },
  empty: { textAlign: "center", color: "#64748b", marginTop: 40 },
  logout: { alignItems: "center", paddingVertical: 12 },
  logoutText: { color: "#94a3b8" },
});
