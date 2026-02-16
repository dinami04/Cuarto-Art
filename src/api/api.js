const API_URL = "http://192.168.1.70:3000";
// (porque estás usando npm run web)

export const getAgendas = async () => {
  try {
    const response = await fetch(`${API_URL}/agendas`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener agendas:", error);
    return [];
  }
};
