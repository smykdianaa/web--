import express from "express";
import sensorsRouter from "./routes/sensors.routes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Acoustic Watch API is running" });
});

app.use("/api/sensors", sensorsRouter);

// Обробник неіснуючих шляхів (має стояти після всіх маршрутів)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Обробник помилок із 4 параметрами (має стояти останнім)
app.use((err, req, res, next) => {
  if (err.status === 400 && err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON" });
  }
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

export default app;