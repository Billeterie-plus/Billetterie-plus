import { useEffect, useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { api, getToken } from "../lib/api";

type Props = NativeStackScreenProps<RootStackParamList, "EventDetail">;

export default function EventDetailScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const [event, setEvent] = useState<any>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [promoCode, setPromoCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api(`/events/${id}`, { auth: false }).then(setEvent).catch((e) => Alert.alert("Erreur", e.message));
  }, [id]);

  if (!event) return <Text style={{ padding: 16 }}>Chargement…</Text>;

  const total = event.ticketTypes.reduce((sum: number, t: any) => sum + (quantities[t.id] || 0) * t.price, 0);
  const totalQty = Object.values(quantities).reduce((a, b) => a + b, 0);

  function setQty(id: string, delta: number, max: number) {
    setQuantities((q) => ({ ...q, [id]: Math.max(0, Math.min(max, (q[id] || 0) + delta)) }));
  }

  async function handleBuy() {
    const token = await getToken();
    if (!token) return navigation.navigate("Login");

    setSubmitting(true);
    try {
      const items = Object.entries(quantities)
        .filter(([, qty]) => qty > 0)
        .map(([ticketTypeId, quantity]) => ({ ticketTypeId, quantity }));

      const res = await api("/orders", {
        method: "POST",
        body: { eventId: event.id, items, promoCode: promoCode || undefined },
      });

      // NOTE: in demo mode (no Stripe key on the backend), the order is
      // auto-confirmed. For real payments, integrate @stripe/stripe-react-native
      // and present its PaymentSheet using the session returned here.
      Alert.alert("Commande confirmée", "Vos billets sont disponibles dans « Mes billets ».");
      navigation.navigate("MyTickets");
    } catch (e: any) {
      Alert.alert("Erreur", e.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.type}>{event.type}</Text>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.subtitle}>
        {event.type === "TRAIN" ? `${event.departureStation} → ${event.arrivalStation}` : event.venue}
      </Text>
      <Text style={styles.date}>{new Date(event.startDateTime).toLocaleString("fr-FR")}</Text>
      {event.description ? <Text style={styles.description}>{event.description}</Text> : null}

      <View style={styles.ticketBox}>
        <Text style={styles.sectionTitle}>Choisissez vos billets</Text>
        {event.ticketTypes.map((t: any) => {
          const remaining = t.quota - t.sold;
          return (
            <View key={t.id} style={styles.tierRow}>
              <View>
                <Text style={styles.tierName}>{t.name}</Text>
                <Text style={styles.tierMeta}>
                  {t.price}€ · {remaining > 0 ? `${remaining} places` : "Épuisé"}
                </Text>
              </View>
              <View style={styles.stepper}>
                <TouchableOpacity onPress={() => setQty(t.id, -1, remaining)} style={styles.stepBtn}>
                  <Text style={styles.stepBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.stepValue}>{quantities[t.id] || 0}</Text>
                <TouchableOpacity onPress={() => setQty(t.id, 1, remaining)} style={styles.stepBtn}>
                  <Text style={styles.stepBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        <TextInput
          placeholder="Code promo (optionnel)"
          value={promoCode}
          onChangeText={setPromoCode}
          style={styles.promoInput}
        />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{total.toFixed(2)}€</Text>
        </View>

        <TouchableOpacity
          onPress={handleBuy}
          disabled={totalQty === 0 || submitting}
          style={[styles.buyBtn, (totalQty === 0 || submitting) && { opacity: 0.5 }]}
        >
          <Text style={styles.buyBtnText}>{submitting ? "Traitement…" : "Acheter"}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  type: { color: "#1d4ed8", fontWeight: "600" },
  title: { fontSize: 24, fontWeight: "800", marginTop: 4 },
  subtitle: { color: "#64748b", marginTop: 6 },
  date: { color: "#64748b", marginTop: 2 },
  description: { marginTop: 12, lineHeight: 20 },
  ticketBox: { marginTop: 20, backgroundColor: "white", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#e2e8f0" },
  sectionTitle: { fontWeight: "700", marginBottom: 10 },
  tierRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderColor: "#f1f5f9" },
  tierName: { fontWeight: "600" },
  tierMeta: { color: "#64748b", fontSize: 12, marginTop: 2 },
  stepper: { flexDirection: "row", alignItems: "center", gap: 10 },
  stepBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: "#f1f5f9", alignItems: "center", justifyContent: "center" },
  stepBtnText: { fontSize: 18, fontWeight: "700" },
  stepValue: { minWidth: 20, textAlign: "center", fontWeight: "600" },
  promoInput: { marginTop: 12, borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 10, padding: 10 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 14 },
  totalLabel: { fontWeight: "700" },
  totalValue: { fontWeight: "700" },
  buyBtn: { marginTop: 14, backgroundColor: "#1d4ed8", borderRadius: 10, paddingVertical: 14, alignItems: "center" },
  buyBtnText: { color: "white", fontWeight: "700" },
});
