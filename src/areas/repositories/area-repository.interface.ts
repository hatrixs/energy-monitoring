export interface Area {
  id: string;
  name: string;
  workCenterId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAreaData {
  name: string;
  workCenterId: string;
}

export interface AreaRepository {
  findOrCreate(data: CreateAreaData): Promise<Area>;
}
