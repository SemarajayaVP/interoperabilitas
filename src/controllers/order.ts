import { ParameterizedContext } from 'koa';
import { IOrder, OrderModel } from '../models/orders';
import { IQueryParamsGetById, IQueryParamsOrder } from '../interfaces/IMainRequestBody';
import { IPaginatedResponse } from '../interfaces/IMainResponseBody';
import { response } from 'express';
import { respondBody } from '../utils/respond-body';
import { IRespondData } from '../interfaces/IRespondData';

export const getAllOrders = async (ctx: ParameterizedContext) => {
  try {
    const { page, limit, startDate, endDate } = ctx.query as IQueryParamsOrder;
    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 10;

    const skip = (pageNumber - 1) * pageSize;

    let condition: any = {};

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59);
      condition = {
        ...condition,
        date: {
          $gte: start,
          $lt: end,
        },
      };
    }

    const result = await OrderModel.find(condition).limit(pageSize).skip(skip);

    const totalOrders = await OrderModel.countDocuments(condition);

    const response: IPaginatedResponse<IOrder> = {
      data: result,
      meta: {
        totalItems: totalOrders,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalOrders / pageSize),
        itemsPerPage: pageSize,
      },
    };

    ctx.status = 200;
    ctx.body = response;
  } catch (error) {
    ctx.status = error.status || 500;
    ctx.body = { message: error.message || 'Internal Server Error' };
    // Atau gunakan middleware error handling
  }
};

export const getOrderById = async (ctx: ParameterizedContext) => {
  const { id } = ctx.params as IQueryParamsGetById;

  console.log('INI ID NYUA BROOWW =>>', id);
  try {
    const ordersData = await OrderModel.findById(id);
    console.log('isi data ordersDATA =>>', ordersData);
    const response = {
      data: ordersData,
    };
    ctx.body = response;
  } catch (error) {
    console.error('Error => ', error);
    ctx.status = 500;
    ctx.body = respondBody('Failed to get order by id', false, { error: error.message }) as IRespondData;
    return;
  }
};
