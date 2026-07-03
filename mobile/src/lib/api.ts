import AsyncStorage from "@react-native-async-storage/async-storage";

// Point this at your machine's LAN IP when testing on a physical device,
// e.g. http://192.168.1.20:4000 (localhost won't work from a real phone).
export const API_URL = "http://localhost:4000";

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem("token");
}

export async function setSession(token: string, user: unknown) {
  await AsyncStorage.setItem("token", token);
  await AsyncStorage.setItem("user", JSON.stringify(user));
}

export async function getUser<T = any>(): Promise<T | null> {
  const raw = await AsyncStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

export async function clearSession() {
  await AsyncStorage.multiRemove(["token", "user"]);
}

export async function api<T = any>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {}
): Promise<T> {
  const { method = "GET", body, auth = true } = options;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) {
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error?.message || data.error || `Request failed (${res.status})`);
  }
  return data as T;
}
