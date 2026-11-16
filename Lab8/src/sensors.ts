interface Sensor {
  id: string;
  name: string;
  district: string;
  noiseLevel: number;
  status: "active" | "inactive";
}

const API_URL: string = "https://6af9f5816d8b86fb22d76494.mockapi.io/api/v1/sensors";

function renderSensors(sensors: Sensor[]): void {
  const container = document.querySelector<HTMLDivElement>("#sensors");
  if (!container) {
    return;
  }

  container.innerHTML = "";

  sensors.forEach((sensor: Sensor) => {
    const card = document.createElement("div");
    card.className = "sensor-card";

    const statusClass = sensor.status === "active" 
      ? "sensor-status--active" 
      : "sensor-status--inactive";

    card.innerHTML = `
      <h3>${sensor.name}</h3>
      <p>Район: ${sensor.district}</p>
      <p>Рівень шуму: <strong>${sensor.noiseLevel} дБ</strong></p>
      <p>Статус: <span class="${statusClass}">${sensor.status}</span></p>
    `;

    container.appendChild(card);
  });
}

async function loadSensors(): Promise<void> {
  try {
    const response: Response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Не вдалося завантажити сенсори");
    }

    const sensors: Sensor[] = await response.json();
    renderSensors(sensors);
  } catch (error) {
    console.error("Помилка:", error);
  }
}

loadSensors();