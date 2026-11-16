"use strict";
const API_URL = "https://6af9f5816d8b86fb22d76494.mockapi.io/api/v1/sensors";
function renderSensors(sensors) {
    const container = document.querySelector("#sensors");
    if (!container) {
        return;
    }
    container.innerHTML = "";
    sensors.forEach((sensor) => {
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
async function loadSensors() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Не вдалося завантажити сенсори");
        }
        const sensors = await response.json();
        renderSensors(sensors);
    }
    catch (error) {
        console.error("Помилка:", error);
    }
}
loadSensors();
