import { NoiseSensor } from './models/NoiseSensor.js';
import { MobileNoiseSensor } from './models/MobileNoiseSensor.js';
import { MonitoringSystem } from './services/MonitoringSystem.js';

// 1. Початкові стартові дані з методички (Пункт 6.1)
const sensorsData = [
    { id: "NS-01", district: "Галицький", location: "просп. Свободи", noiseLevel: 58 },
    { id: "NS-02", district: "Франківський", location: "вул. Наукова", noiseLevel: 74 },
    { id: "NS-03", district: "Шевченківський", location: "просп. Чорновола", noiseLevel: 83 }
];

// 2. Ініціалізація системи та додавання сенсорів
const system = new MonitoringSystem();

sensorsData.forEach(data => {
    system.addSensor(NoiseSensor.fromObject(data));
});

// Додаємо один мобільний сенсор для демонстрації наслідування
const mobileSensor = new MobileNoiseSensor("MNS-01", "Сихівський", "вул. Червоної Калини", 52, 15);
system.addSensor(mobileSensor);

// 3. Консольні експерименти та перевірка (Розділ 7.1 методички)
console.group("=== Експерименти з Prototype та власними властивостями ===");
const sensorA = system.findSensorById("NS-01");
const sensorB = system.findSensorById("NS-02");

console.log("1. Однаковість методів через прототип (sensorA.getStatus === sensorB.getStatus):", sensorA.getStatus === sensorB.getStatus); // true
console.log("2. Чи є noiseLevel власною властивістю (Object.hasOwn(sensorA, 'noiseLevel')):", Object.hasOwn(sensorA, "noiseLevel")); // true
console.log("3. Чи є getStatus власною властивістю (Object.hasOwn(sensorA, 'getStatus')):", Object.hasOwn(sensorA, "getStatus")); // false

console.log("Середній рівень шуму системи:", system.getAverageNoiseLevel(), "dB"); // ~66.75 dB
console.log("Критичні сенсори:", system.getCriticalSensors());
console.log("Мобільний сенсор потребує зарядки:", mobileSensor.needsCharging()); // true
console.groupEnd();

// 4. Інтеграція з DOM (Рендеринг ка карток)
function renderSensorCard(sensor) {
    const status = sensor.getStatus();
    
    const card = document.createElement('div');
    card.className = `monitoring-card ${status}`;

    let statusText = 'Норма';
    if (status === 'warning') statusText = 'Попередження';
    if (status === 'critical') statusText = 'Критичний';

    card.innerHTML = `
        <div class="card-header">
            <span class="sensor-id">${sensor.id}</span>
            <span class="badge-status ${status}">${statusText}</span>
        </div>
        <div class="card-body">
            <div class="noise-value">${sensor.noiseLevel} dB</div>
            <div class="sensor-district">Район: ${sensor.district}</div>
            <div class="sensor-location">Адреса: ${sensor.location}</div>
            ${sensor instanceof MobileNoiseSensor ? `<div class="battery-info">🔋 Батарея: ${sensor.batteryLevel}%</div>` : ''}
        </div>
    `;

    return card;
}

function updateUI() {
    const container = document.querySelector('.monitoring-grid');
    if (!container) return;

    container.innerHTML = '';
    system.sensors.forEach(sensor => {
        container.appendChild(renderSensorCard(sensor));
    });
}

// Запуск після завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
    updateUI();

    // Демонстрація автоматичного оновлення статусу та перерендерингу
    setTimeout(() => {
        console.log(">>> Оновлення рівню шуму для NS-01 на 78 dB (перехід у critical)...");
        const ns01 = system.findSensorById("NS-01");
        if (ns01) {
            ns01.updateNoiseLevel(78);
            updateUI(); // Повторний рендеринг
        }
    }, 4000);
});