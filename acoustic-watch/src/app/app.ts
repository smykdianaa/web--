import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sensor } from './sensor';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  sensors: Sensor[] = [
    { id: 1, name: 'Сенсор Центр', district: 'Галицький', noiseLevel: 72, status: 'active' },
    { id: 2, name: 'Сенсор Сихів', district: 'Сихівський', noiseLevel: 58, status: 'active' },
    { id: 3, name: 'Сенсор Левандівка', district: 'Залізничний', noiseLevel: 81, status: 'inactive' }
  ];

  newName = '';
  newDistrict = '';
  newNoiseLevel: number | null = null;
  newStatus: 'active' | 'inactive' = 'active';

  addSensor(): void {
    const trimmedName = this.newName.trim();
    const trimmedDistrict = this.newDistrict.trim();

    if (!trimmedName || !trimmedDistrict || this.newNoiseLevel === null) {
      return;
    }

    const nextId =
      this.sensors.length > 0
        ? Math.max(...this.sensors.map((s) => s.id)) + 1
        : 1;

    const sensor: Sensor = {
      id: nextId,
      name: trimmedName,
      district: trimmedDistrict,
      noiseLevel: Number(this.newNoiseLevel),
      status: this.newStatus
    };

    this.sensors.push(sensor);

    this.newName = '';
    this.newDistrict = '';
    this.newNoiseLevel = null;
    this.newStatus = 'active';
  }

  toggleStatus(id: number): void {
    const sensor = this.sensors.find((s) => s.id === id);
    if (!sensor) {
      return;
    }
    sensor.status = sensor.status === 'active' ? 'inactive' : 'active';
  }

  deleteSensor(id: number): void {
    this.sensors = this.sensors.filter((s) => s.id !== id);
  }
}