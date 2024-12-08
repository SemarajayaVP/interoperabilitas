import { IRespondData } from '../interfaces/IRespondData';

export const respondBody = (message: string, status: boolean, data: Record<string, unknown> | unknown[]): IRespondData => {
  return {
    status: status ? 'success' : 'failed',
    message,
    data,
  };
};
