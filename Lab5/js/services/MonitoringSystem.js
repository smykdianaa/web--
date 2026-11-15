import { NoiseSensor } from '../models/NoiseSensor.js';

export class MonitoringSystem {
    constructor() {
        this.sensors = [];
    }

    // Додавання сенсора з перевіркою типу та унікальності ID
    addSensor(sensor) {
        if (!(sensor instanceof NoiseSensor)) {
            throw new Error("Можна додавати лише об'єкти типу NoiseSensor");
        }
        const sensorExists = this.sensors.some(item => item.id === sensor.id);
        if (sensorExists) {
            throw new Error(`Датчик з ID ${sensor.id} вже існує в системі`);
        }
        this.sensors.push(sensor);
    }

    findSensorById(id) {
        return this.sensors.find(sensor => sensor.id === id) || null;
    }

    getSensorsByDistrict(district) {
        return this.sensors.filter(
            sensor => sensor.district.toLowerCase() === district.toLowerCase()
        );
    }

    getCriticalSensors() {
        return this.sensors.filter(sensor => sensor.getStatus() === 'critical');
    }

    getAverageNoiseLevel() {
        if (this.sensors.length === 0) return 0;
        
        const validSensors = this.sensors.filter(s => Number.isFinite(s.noiseLevel));
        if (validSensors.length === 0) return 0;

        const totalSum = validSensors.reduce((acc, sensor) => acc + sensor.noiseLevel, 0);
        return parseFloat((totalSum / validSensors.length).toFixed(2));
    }
}