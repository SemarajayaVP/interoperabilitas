import { ParameterizedContext } from 'koa';
import { IOrder, OrderModel } from '../models/orders';
import { IQueryParamsGetById, IQueryParamsOrder } from '../interfaces/IMainRequestBody';
import { IPaginatedResponse } from '../interfaces/IMainResponseBody';
import { respondBody } from '../utils/respond-body';
import { IRespondData } from '../interfaces/IRespondData';
import mongoose from 'mongoose';

export const getAllOrders = async (ctx: ParameterizedContext) => {
  try {
    const { page, limit, startDate, endDate } = ctx.query as IQueryParamsOrder;
    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 10;

    if (pageNumber < 1 || !Number.isInteger(pageNumber)) {
      ctx.status = 400;
      ctx.body = respondBody('Validation Error', false, {
        error: 'Page number must be a positive integer',
      }) as IRespondData;
      return;
    }

    if (pageSize < 1 || !Number.isInteger(pageSize)) {
      ctx.status = 400;
      ctx.body = respondBody('Validation Error', false, {
        error: 'Limit must be a positive integer',
      }) as IRespondData;
      return;
    }

    const condition: any = {};

    if (startDate || endDate) {
      if (!startDate || !endDate) {
        ctx.status = 400;
        ctx.body = respondBody('Validation Error', false, {
          error: 'Both startDate and endDate must be provided for date filtering',
        }) as IRespondData;
        return;
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        ctx.status = 400;
        ctx.body = respondBody('Validation Error', false, {
          error: 'Invalid date format. Use ISO format YYYY-MM-DD',
        }) as IRespondData;
        return;
      }

      if (start > end) {
        ctx.status = 400;
        ctx.body = respondBody('Validation Error', false, {
          error: 'startDate must be earlier than or equal to endDate',
        }) as IRespondData;
        return;
      }

      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      condition.date = {
        $gte: start,
        $lte: end,
      };
    }

    const skip = (pageNumber - 1) * pageSize;

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
    ctx.body = respondBody('Internal Server Error', false, {
      error: error.message || 'Internal Server Error',
    }) as IRespondData;
    // Alternatively, use middleware for error handling
  }
};

export const getOrderById = async (ctx: ParameterizedContext) => {
  const { id } = ctx.params as IQueryParamsGetById;

  console.log('Requested Order ID:', id);
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      ctx.status = 400;
      ctx.body = respondBody('Validation Error', false, {
        error: 'Invalid order ID format',
      }) as IRespondData;
      return;
    }

    const orderData = await OrderModel.findById(id);

    if (!orderData) {
      ctx.status = 404;
      ctx.body = respondBody('Order not found', false, {}) as IRespondData;
      return;
    }

    ctx.status = 200;
    ctx.body = { data: orderData };
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.status = 500;
    ctx.body = respondBody('Failed to get order by ID', false, {
      error: error.message,
    }) as IRespondData;
    return;
  }
};