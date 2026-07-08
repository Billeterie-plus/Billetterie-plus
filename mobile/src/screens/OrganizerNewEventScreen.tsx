import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { api } from "../lib/api";

type Props = NativeStackScreenProps<RootStackParamList, "OrganizerNewEvent">;

const TYPES = ["CONCERT", "SOIREE", "FILM"];

export default function OrganizerNewEventScreen({ navigation }: Props) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("CONCERT");
  const [venue, setVenue] = useState("");
  const [startDateTime, setStartDateTime] = useState(""); // e.g. 2026-08-20T20:00
  const [tierName, setTierName] = useState("");
  const [tierPrice, setTierPrice] = useState("");
  const [tierQuota, setTierQuota] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    try {
      await api("/organizer/events", {
        method: "POST",
        body: {
          title,
          type,
          venue,
          startDateTime: new Date(startDateTime).toISOString(),
          ticketTypes: [{ name: tierName, price: Number(tierPrice), quota: Number(tierQuota) }],
        },
      });
      Alert.alert("Événement créé", "Votre événement a été enregistré en brouillon.");
      navigation.goBack();
    } catch (e: any) {
      Alert.alert("Erreur", e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>Nouvel événement</Text>
      <TextInput placeholder="Titre" value={title} onChangeText={setTitle} style={styles.input} />

      <View style={styles.typeRow}>
        {TYPES.map((t) => (
          <TouchableOpacity key={t} onPress={() => setType(t)} style={[styles.typeChip, type === t && styles.typeChipActive]}>
            <Text style={type === t ? styles.typeChipTextActive : styles.typeChipText}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput placeholder="Lieu (salle, club...)" value={venue} onChangeText={setVenue} style={styles.input} />

      <TextInput
        placeholder="Date/heure (AAAA-MM-JJTHH:mm, ex: 2026-08-20T20:00)"
        value={startDateTime}
        onChangeText={setStartDateTime}
        style={styles.input}
      />

      <Text style={styles.section}>Premier tarif</Text>
      <TextInput placeholder="Nom du tarif (ex: Fosse)" value={tierName} onChangeText={setTierName} style={styles.input} />
      <TextInput placeholder="Prix €" keyboardType="numeric" value={tierPrice} onChangeText={setTierPrice} style={styles.input} />
      <TextInput placeholder="Quota" keyboardType="numeric" value={tierQuota} onChangeText={setTierQuota} style={styles.input} />

      <TouchableOpacity onPress={handleSubmit} disabled={loading} style={styles.btn}>
        <Text style={styles.btnText}>{loading ? "Création…" : "Créer l'événement"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 16 },
  input: { borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 10, padding: 12, marginBottom: 12, backgroundColor: "white" },
  typeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  typeChip: { backgroundColor: "#e2e8f0", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  typeChipActive: { backgroundColor: "#1d4ed8" },
  typeChipText: { color: "#334155", fontSize: 12 },
  typeChipTextActive: { color: "white", fontSize: 12 },
  section: { fontWeight: "700", marginBottom: 8, marginTop: 4 },
  btn: { backgroundColor: "#1d4ed8", borderRadius: 10, paddingVertical: 14, alignItems: "center", marginTop: 8 },
  btnText: { color: "white", fontWeight: "700" },
});
