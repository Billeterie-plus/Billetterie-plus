import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { api } from "../lib/api";

// Real camera-based QR scanning for organizer staff at the entrance.
export default function OrganizerScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState<{ valid: boolean; message: string } | null>(null);

  if (!permission) return <View style={styles.center} />;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permissionText}>L'accès à la caméra est nécessaire pour scanner les billets.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.btn}>
          <Text style={styles.btnText}>Autoriser la caméra</Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function handleScan({ data }: { data: string }) {
    if (scanned) return;
    setScanned(true);
    try {
      const res = await api("/organizer/scan", { method: "POST", body: { qrToken: data } });
      setResult({ valid: true, message: `✅ ${res.ticket.event} — ${res.ticket.tier} (${res.ticket.owner})` });
    } catch (e: any) {
      setResult({ valid: false, message: `⚠️ ${e.message}` });
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView style={{ flex: 1 }} facing="back" barcodeScannerSettings={{ barcodeTypes: ["qr"] }} onBarcodeScanned={scanned ? undefined : handleScan} />
      {result && (
        <View style={[styles.resultBanner, result.valid ? styles.resultOk : styles.resultBad]}>
          <Text style={styles.resultText}>{result.message}</Text>
          <TouchableOpacity
            onPress={() => {
              setScanned(false);
              setResult(null);
            }}
            style={styles.rescanBtn}
          >
            <Text style={styles.rescanText}>Scanner un autre billet</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: "#f8fafc" },
  permissionText: { textAlign: "center", marginBottom: 16, color: "#334155" },
  btn: { backgroundColor: "#1d4ed8", borderRadius: 10, paddingHorizontal: 20, paddingVertical: 12 },
  btnText: { color: "white", fontWeight: "700" },
  resultBanner: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 20 },
  resultOk: { backgroundColor: "rgba(22,101,52,0.95)" },
  resultBad: { backgroundColor: "rgba(146,64,14,0.95)" },
  resultText: { color: "white", fontWeight: "600", marginBottom: 10 },
  rescanBtn: { backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 8, paddingVertical: 10, alignItems: "center" },
  rescanText: { color: "white", fontWeight: "600" },
});
