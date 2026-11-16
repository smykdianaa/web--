// ВСТАВТЕ СЮДИ ВАШУ АДРЕСУ З MOCKAPI:
const API_URL = "https://6af9f5816d8b86fb22d76494.mockapi.io/api/v1/sensors";

/**
 * Завантажує список сенсорів із MockAPI
 */
async function loadSensors() {
    const container = document.querySelector("#sensors-list");

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const sensors = await response.json();
        renderSensors(sensors);
    } catch (error) {
        console.error("Не вдалося завантажити сенсори:", error);
        if (container) {
            container.innerHTML = `<p class="error-message">Не вдалося завантажити дані сенсорів. Перевірте підключення або адресу API.</p>`;
        }
    }
}

/**
 * Відображає отримані сенсори у DOM
 */
function renderSensors(sensors) {
    const container = document.querySelector("#sensors-list");
    if (!container) return;

    container.innerHTML = "";

    sensors.forEach((sensor) => {
        const card = document.createElement("article");
        card.classList.add("sensor-card");

        const statusClass = sensor.status === "active" 
            ? "sensor-status--active" 
            : "sensor-status--inactive";

        card.innerHTML = `
            <h3>${sensor.name}</h3>
            <p>Район: ${sensor.district}</p>
            <p>Рівень шуму: <strong>${sensor.noiseLevel} дБ</strong></p>
            <p>Статус: <span class="${statusClass}">${sensor.status}</span></p>
        `;

        container.append(card);
    });
}

// Запуск завантаження після відкриття сторінки
loadSensors();