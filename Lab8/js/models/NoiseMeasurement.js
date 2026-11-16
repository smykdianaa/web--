/**
 * Клас, що представляє окреме вимірювання шуму
 */
export class NoiseMeasurement {
    constructor(value, measuredAt = new Date()) {
        if (!NoiseMeasurement.isValid(value)) {
            throw new Error(`Некоректне значення вимірювання: ${value}`);
        }
        this.value = Number(value);
        this.measuredAt = measuredAt instanceof Date ? measuredAt : new Date(measuredAt);
    }

    static isValid(value) {
        return Number.isFinite(value) && value >= 0 && value <= 200;
    }

    getFormattedTime() {
        return this.measuredAt.toLocaleTimeString('uk-UA', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}