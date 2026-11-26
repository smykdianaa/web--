import express from 'express';
import sensors from './data/sensors.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Acoustic Watch API is running' });
});

app.get('/api/sensors', (req, res) => {
  res.json(sensors);
});

app.get('/api/sensors/:id', (req, res) => {
  const sensorId = Number(req.params.id);
  const sensor = sensors.find((item) => item.id === sensorId);

  if (!sensor) {
    return res.status(404).json({ message: 'Sensor not found' });
  }

  res.json(sensor);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});