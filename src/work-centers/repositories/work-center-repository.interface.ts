export interface WorkCenter {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkCenterRepository {
  findByName(name: string): Promise<WorkCenter | null>;
  create(name: string): Promise<WorkCenter>;
  findOrCreate(name: string): Promise<WorkCenter>;
  findAll(): Promise<WorkCenter[]>;
}
