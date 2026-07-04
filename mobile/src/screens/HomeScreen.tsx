import { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, RefreshControl } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { api, getUser } from "../lib/api";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const TYPES = [
  { value: "", label: "Tous" },
  { value: "CONCERT", label: "Concert" },
  { value: "SOIREE", label: "Soirée" },
];

export default function HomeScreen({ navigation }: Props) {
  const [events, setEvents] = useState<any[]>([]);
  const [type, setType] = useState("");
  const [q, setQ] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(() => {
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (q) params.set("q", q);
    api(`/events?${params.toString()}`, { auth: false }).then(setEvents).catch(console.warn);
  }, [type, q]);

  useEffect(() => {
    load();
    const unsub = navigation.addListener("focus", load);
    return unsub;
  }, [load, navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleAccount} style={{ marginRight: 12 }}>
          <Text style={{ color: "#1d4ed8", fontWeight: "600" }}>Compte</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  async function handleAccount() {
    const user = await getUser();
    if (!user) return navigation.navigate("Login");
    if (user.role === "ORGANIZER") navigation.navigate("OrganizerDashboard");
    else navigation.navigate("MyTickets");
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Rechercher un événement..."
        value={q}
        onChangeText={setQ}
        onSubmitEditing={load}
        style={styles.search}
      />
      <View style={styles.chipsRow}>
        {TYPES.map((t) => (
          <TouchableOpacity
            key={t.value}
            onPress={() => setType(t.value)}
            style={[styles.chip, type === t.value && styles.chipActive]}
          >
            <Text style={type === t.value ? styles.chipTextActive : styles.chipText}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => {
          const minPrice = Math.min(...item.ticketTypes.map((t: any) => t.price));
          return (
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("EventDetail", { id: item.id })}>
              <Text style={styles.cardType}>{item.type}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>
                {item.type === "TRAIN" ? `${item.departureStation} → ${item.arrivalStation}` : item.venue}
              </Text>
              <Text style={styles.cardPrice}>à partir de {minPrice}€</Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>Aucun événement trouvé.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  search: { backgroundColor: "white", borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: "#e2e8f0" },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  chip: { backgroundColor: "#e2e8f0", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8, marginBottom: 8 },
  chipActive: { backgroundColor: "#1d4ed8" },
  chipText: { color: "#334155" },
  chipTextActive: { color: "white" },
  card: { backgroundColor: "white", borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: "#e2e8f0" },
  cardType: { color: "#1d4ed8", fontWeight: "600", fontSize: 12 },
  cardTitle: { fontSize: 17, fontWeight: "700", marginTop: 2 },
  cardSubtitle: { color: "#64748b", marginTop: 2 },
  cardPrice: { marginTop: 8, fontWeight: "600" },
  empty: { textAlign: "center", color: "#64748b", marginTop: 40 },
});
