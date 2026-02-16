const API_URL = "http://192.168.1.70:3000";

// LOGIN
export async function login(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al iniciar sesión");
  }

  return data;
}

// GET AGENDAS (ADMIN)
export async function getAgendas(token) {
  const response = await fetch(`${API_URL}/agendas`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al obtener agendas");
  }

  return data;
}
// CREAR AGENDA (ADMIN)
export async function createAgenda(token, agenda) {
  const response = await fetch(`${API_URL}/agendas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(agenda),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al crear agenda");
  }

  return data;
}
