const API_URL = "https://succeedable-flowable-marquitta.ngrok-free.dev";

/* =========================
   LOGIN
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

  return data;
}

/* =========================
   GET AGENDAS
========================= */
export async function getAgendas(token) {
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
   CREAR AGENDA
========================= */
export async function createAgenda(token, agendaData) {
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
   🔒 SAFE JSON PARSER
   (esto evita crashes)
========================= */
async function safeJson(response) {
  try {
    return await response.json();
  } catch (e) {
    console.log("⚠️ Respuesta no es JSON");
    return {};
  }
}
