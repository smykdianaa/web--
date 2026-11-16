import { NoiseSensor } from './NoiseSensor.js';

export class MobileNoiseSensor extends NoiseSensor {
    constructor(id, district, location, noiseLevel, batteryLevel = 100) {
        super(id, district, location, noiseLevel);
        this.batteryLevel = batteryLevel;
    }

    needsCharging() {
        return this.batteryLevel < 20;
    }

    updateBattery(level) {
        if (level >= 0 && level <= 100) {
            this.batteryLevel = level;
        }
    }
}