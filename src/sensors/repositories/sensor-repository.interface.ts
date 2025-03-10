export interface Sensor {
  id: string;
  sensorId: string;
  areaId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSensorData {
  sensorId: string;
  areaId: string;
}

export interface SensorRepository {
  findBySensorIdAndArea(
    sensorId: string,
    areaId: string,
  ): Promise<Sensor | null>;
  create(data: CreateSensorData): Promise<Sensor>;
  findOrCreate(data: CreateSensorData): Promise<Sensor>;
}
