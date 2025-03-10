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
  findByNameAndWorkCenter(
    name: string,
    workCenterId: string,
  ): Promise<Area | null>;
  create(data: CreateAreaData): Promise<Area>;
  findOrCreate(data: CreateAreaData): Promise<Area>;
}
