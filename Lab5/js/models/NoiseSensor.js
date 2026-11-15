import { NoiseMeasurement } from './NoiseMeasurement.js';

// Пункт 9: Централізовані межі класифікації шуму
export const NOISE_LIMITS = Object.freeze({
    normalMax: 55,
    warningMax: 70
});

export class NoiseSensor {
    constructor(id, district, location, noiseLevel) {
        this.id = id;
        this.district = district;
        this.location = location; // у методичці названо location (адреса)
        this.noiseLevel = noiseLevel;
        this.measurements = [];

        // Якщо при створенні передано початковий рівень — зберігаємо його як перше вимірювання
        if (noiseLevel !== undefined && noiseLevel !== null) {
            this.addMeasurement(new NoiseMeasurement(noiseLevel));
        }
    }

    // Метод визначення статусу на основі централізованих констант
    getStatus() {
        if (this.noiseLevel === null || this.noiseLevel === undefined) {
            return 'unknown';
        }
        if (this.noiseLevel <= NOISE_LIMITS.normalMax) {
            return 'normal';
        }
        if (this.noiseLevel <= NOISE_LIMITS.warningMax) {
            return 'warning';
        }
        return 'critical';
    }

    // Оновлення рівня шуму через числове значення
    updateNoiseLevel(value) {
        if (!NoiseSensor.isValidNoiseLevel(value)) {
            throw new Error(`Некоректне значення рівня шуму: ${value}`);
        }
        const measurement = new NoiseMeasurement(value);
        this.addMeasurement(measurement);
    }

    // Додавання об'єкта вимірювання (композиція)
    addMeasurement(measurement) {
        if (!(measurement instanceof NoiseMeasurement)) {
            throw new Error("Очікується екземпляр NoiseMeasurement");
        }
        this.measurements.push(measurement);
        this.noiseLevel = measurement.value;
    }

    // Пункт 10: Static-метод перевірки коректності значення
    static isValidNoiseLevel(value) {
        return Number.isFinite(value) && value >= 0 && value <= 200;
    }

    // Static-фабрика для створення екземпляра з протого об'єкта
    static fromObject(data) {
        if (!data.id || !data.district || !data.location) {
            throw new Error("Недостатньо даних для створення NoiseSensor");
        }
        return new NoiseSensor(data.id, data.district, data.location, data.noiseLevel);
    }
}