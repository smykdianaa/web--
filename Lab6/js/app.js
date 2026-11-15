import { NoiseSensor } from './models/NoiseSensor.js';
import { MonitoringSystem } from './services/MonitoringSystem.js';

// 1. Дані 6 сенсорів зі зразка
const sensorsData = [
    { id: "NS-01", district: "Галицький", location: "просп. Свободи, 14", noiseLevel: 52 },
    { id: "NS-02", district: "Франківський", location: "вул. Наукова, 8", noiseLevel: 68 },
    { id: "NS-03", district: "Шевченківський", location: "просп. Чорновола, 21", noiseLevel: 83 },
    { id: "NS-04", district: "Сихівський", location: "вул. Зелена, 102", noiseLevel: 49 },
    { id: "NS-05", district: "Личаківський", location: "вул. Пасічна, 30", noiseLevel: 71 },
    { id: "NS-06", district: "Залізничний", location: "вул. Городоцька, 155", noiseLevel: 86 }
];

const system = new MonitoringSystem();
sensorsData.forEach(data => {
    system.addSensor(NoiseSensor.fromObject(data));
});

// Верхній блок "Поточний моніторинг" (ЛР 5)
function updateCurrentMonitoring() {
    const container = document.querySelector('.monitoring-grid');
    if (!container) return;

    container.replaceChildren();
    system.sensors.forEach(sensor => {
        const status = sensor.getStatus();
        const card = document.createElement('div');
        card.className = `monitoring-card ${status}`;
        card.innerHTML = `
            <span class="card-label">${sensor.id} • ${sensor.district}</span>
            <div class="card-value">${sensor.noiseLevel} дБ</div>
            <span class="card-subtext">${sensor.location}</span>
        `;
        container.appendChild(card);
    });
}

// Секція "Активні сенсори" (ЛР 6)
const sensorList = document.querySelector(".sensor-list");
const districtFilter = document.querySelector("#district-filter");
const criticalFilter = document.querySelector("#critical-filter");

function createSensorCard(sensor) {
    const statusValue = sensor.getStatus();

    const card = document.createElement("article");
    card.classList.add("sensor-card", `sensor-card--${statusValue}`);

    card.innerHTML = `
        <div class="sensor-card-header">
            <h3>${sensor.id}</h3>
            <span class="status-pill">
                <span class="status-dot"></span>
                ${statusValue}
            </span>
        </div>
        <div class="sensor-card-info">
            <p>📍 ${sensor.district} район</p>
            <p>🏢 ${sensor.location}</p>
        </div>
        <div class="sensor-card-footer">
            <span>📶 Рівень шуму:</span>
            <span class="noise-db">${sensor.noiseLevel} дБ</span>
        </div>
    `;

    return card;
}

function renderSensors(sensorArray) {
    if (!sensorList) return;
    sensorList.replaceChildren();

    sensorArray.forEach((sensor) => {
        const card = createSensorCard(sensor);
        sensorList.append(card);
    });
}

function applyFilters() {
    const selectedDistrict = districtFilter.value;
    const criticalOnly = criticalFilter.checked;

    const filteredSensors = system.sensors.filter((sensor) => {
        const matchesDistrict =
            selectedDistrict === "all" ||
            sensor.district === selectedDistrict;

        const matchesStatus =
            !criticalOnly ||
            sensor.getStatus() === "critical";

        return matchesDistrict && matchesStatus;
    });

    renderSensors(filteredSensors);
}

document.addEventListener("DOMContentLoaded", () => {
    updateCurrentMonitoring();
    renderSensors(system.sensors);

    if (districtFilter && criticalFilter) {
        districtFilter.addEventListener("change", applyFilters);
        criticalFilter.addEventListener("change", applyFilters);
    }
});