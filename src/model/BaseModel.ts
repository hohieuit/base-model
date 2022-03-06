import { Identifiable } from './Identifiable';

export interface BaseModel extends Identifiable {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  createdBy: string;
  updatedBy: string;
}
