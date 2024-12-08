export interface IMainRequestBody {
  breadcrumbId: string;
  data: any[];
}

export interface IQueryParams {
  page?: string;
  limit?: string;
}

export interface IQueryParamsOrder {
  startDate?: Date;
  endDate?: Date;
  limit?: string;
  page?: string;
}

export interface IQueryParamsGetById {
  id: string;
}
