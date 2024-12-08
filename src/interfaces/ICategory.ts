import { ICategory } from '../models/category';
import { IMainRequestBody } from './IMainRequestBody';

export interface IGenericRequestBody<T> extends IMainRequestBody {
  data: T[];
}

export interface ICategoryDeleteData {
  _id: string;
}

export type ICategoryRequestBody = IGenericRequestBody<ICategory>;
export type ICategoryDeleteBody = IGenericRequestBody<ICategoryDeleteData>;

