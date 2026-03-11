import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_URL = "https://backend-production-b4f8.up.railway.app";

/* =========================
   🔒 SAFE JSON PARSER
========================= */
async function safeJson(response) {
  try {
    return await response.json();
  } catch (e) {
    console.log("⚠️ Respuesta no es JSON");
    return {};
  }
}

/* =========================
   🔐 LOGIN
========================= */
export async function login(email, password) {
  console.log("🔐 Login a:", `${API_URL}/login`);

  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await safeJson(response);

  console.log("✅ Login status:", response.status);
  console.log("📦 Login data:", data);

  if (!response.ok) {
    throw new Error(data?.error || "Error al iniciar sesión");
  }

  // ✅ guardar token automáticamente
  if (data.token) {
    await AsyncStorage.setItem("token", data.token);
  }

  return data;
}

/* =========================
   📥 GET AGENDAS
========================= */
export async function getAgendas() {
  const token = await AsyncStorage.getItem("token");

  console.log("📥 GET agendas");

  const response = await fetch(`${API_URL}/agendas`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await safeJson(response);

  console.log("📊 Agendas status:", response.status);

  if (!response.ok) {
    throw new Error(data?.error || "Error al obtener agendas");
  }

  return data;
}

/* =========================
   📤 CREAR AGENDA
========================= */
export async function createAgenda(agendaData) {
  const token = await AsyncStorage.getItem("token");

  console.log("📤 POST agenda:", agendaData);

  const response = await fetch(`${API_URL}/agendas`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(agendaData),
  });

  const data = await safeJson(response);

  console.log("📊 Crear agenda status:", response.status);

  if (!response.ok) {
    throw new Error(data?.error || "Error al crear agenda");
  }

  return data;
}

/* =========================
   🎯 GET EVENTOS
========================= */
export async function getEventos() {
  const token = await AsyncStorage.getItem("token");

  console.log("📥 GET eventos");

  const response = await fetch(`${API_URL}/eventos`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await safeJson(response);

  if (!response.ok) {
    throw new Error(data.error || "Error al obtener eventos");
  }

  return data;
}

/* =========================
   💰 GET PAGOS  ⭐ NUEVO
========================= */
export async function getPagos() {
  const token = await AsyncStorage.getItem("token");

  console.log("📥 GET pagos");

  const response = await fetch(`${API_URL}/pagos`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await safeJson(response);

  console.log("📊 Pagos status:", response.status);

  if (!response.ok) {
    throw new Error(data?.error || "Error al obtener pagos");
  }

  return data;
}

/* =========================
   💰 CREAR PAGO
========================= */
export async function crearPago(pagoData) {
  const token = await AsyncStorage.getItem("token");

  console.log("📤 POST pago:", pagoData);

  const response = await fetch(`${API_URL}/pagos`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pagoData),
  });

  const data = await safeJson(response);

  console.log("📊 Crear pago status:", response.status);

  if (!response.ok) {
    throw new Error(data?.error || "Error al guardar pago");
  }

  return data;
}
