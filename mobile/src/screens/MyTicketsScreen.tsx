import { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { api } from "../lib/api";

type Props = NativeStackScreenProps<RootStackParamList, "MyTickets">;

const STATUS_LABEL: Record<string, string> = { VALID: "Valide", USED: "Scanné", CANCELLED: "Annulé" };

export default function MyTicketsScreen({ navigation }: Props) {
  const [tickets, setTickets] = useState<any[]>([]);

  const load = useCallback(() => {
    api("/tickets/mine").catch(() => []).then((t) => setTickets(t || []));
  }, []);

  useEffect(() => {
    load();
    const unsub = navigation.addListener("focus", load);
    return unsub;
  }, [load, navigation]);

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={{ padding: 16 }}
      data={tickets}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={<Text style={styles.empty}>Vous n'avez pas encore de billet.</Text>}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.qrDataUrl }} style={styles.qr} />
          <View style={{ flex: 1 }}>
            <Text style={styles.eventTitle}>{item.event.title}</Text>
            <Text style={styles.tier}>{item.ticketType.name}</Text>
            {item.seatInfo ? <Text style={styles.tier}>{item.seatInfo}</Text> : null}
            <Text style={styles.date}>{new Date(item.event.startDateTime).toLocaleString("fr-FR")}</Text>
            <Text style={styles.status}>{STATUS_LABEL[item.status] || item.status}</Text>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  empty: { textAlign: "center", color: "#64748b", marginTop: 40 },
  card: { flexDirection: "row", gap: 12, backgroundColor: "white", borderRadius: 14, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: "#e2e8f0" },
  qr: { width: 90, height: 90, borderRadius: 8 },
  eventTitle: { fontWeight: "700", fontSize: 15 },
  tier: { color: "#64748b", marginTop: 2 },
  date: { color: "#94a3b8", fontSize: 12, marginTop: 4 },
  status: { marginTop: 6, fontWeight: "600", fontSize: 12, color: "#166534" },
});
