import { ParameterizedContext } from 'koa';
import { ICategoryRequestBody } from '../interfaces/ICategory';

import { CategoryModel, ICategory } from '../models/category';
import { respondBody } from '../utils/respond-body';
import { IRespondData } from '../interfaces/IRespondData';
import { IQueryParams, IQueryParamsGetById } from '../interfaces/IMainRequestBody';
import { IPaginatedResponse } from '../interfaces/IMainResponseBody';

// Create Category
export const createCategory = async (ctx: ParameterizedContext) => {
  const { breadcrumbId, data } = ctx.request.body as ICategoryRequestBody;
  console.log('Process started with breadcrumbId:', breadcrumbId);

  try {
    const categoryData: ICategory[] = data;
    await CategoryModel.create(categoryData);
    console.log('Process ended with breadcrumbId:', breadcrumbId);
    ctx.body = respondBody('Category successfully created', true, {}) as IRespondData;
  } catch (error) {
    console.error('Error occurred with breadcrumbId:', breadcrumbId, error);

    if (error.name === 'ValidationError') {
      ctx.status = 400;
      const messages = Object.values(error.errors).map((err: any) => err.message);
      ctx.body = respondBody('Validation Error', false, {
        error: messages.join(', '),
      });
    } else {
      ctx.status = 500;
      ctx.body = respondBody('Failed to create category', false, {
        error: error.message,
      });
    }
  }
  return;
};

// Update category
export const updateCategory = async (ctx: ParameterizedContext) => {
  const { id } = ctx.params as IQueryParamsGetById;
  const { breadcrumbId, data } = ctx.request.body as ICategoryRequestBody;
  console.log('Process started with BreadcrumbId:', breadcrumbId);

  try {
    if (!data || data.length === 0) {
      ctx.status = 400;
      ctx.body = respondBody('Validation Error', false, {
        error: 'Data array cannot be empty',
      }) as IRespondData;
      return;
    }

    const categoryData: ICategory[] = data;

    const category = await CategoryModel.findById(id);
    console.log('isi file category ==>', category);
    if (!category || category.isDeleted) {
      ctx.status = 404;
      ctx.body = respondBody('Category not found', false, {}) as IRespondData;
      return;
    }

    await Promise.all(
      categoryData.map(async (categoryItem) => {
        await CategoryModel.updateOne(
          { _id: id },
          {
            $set: {
              name: categoryItem.name,
              organizer: categoryItem.organizer,
            },
          }
        );
      })
    );

    const updatedData = await CategoryModel.find({ _id: id });
    ctx.body = respondBody('Category successfully updated', true, updatedData) as IRespondData;
  } catch (error) {
    console.error('Error occurred with breadcrumbId: ', breadcrumbId, error);
    ctx.status = error.name === 'ValidationError' ? 400 : 500;
    ctx.body = respondBody(
      error.name === 'ValidationError' ? 'Validation Error' : 'Failed to update the category',
      false,
      {
        error: error.message,
      }
    ) as IRespondData;
  }
  return;
};

import mongoose from 'mongoose';

// Delete Category
export const deleteCategory = async (ctx: ParameterizedContext) => {
  const { id } = ctx.params as IQueryParamsGetById;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      ctx.status = 400;
      ctx.body = respondBody('Validation Error', false, {
        error: 'Invalid category ID format',
      }) as IRespondData;
      return;
    }

    const category = await CategoryModel.findById(id);
    if (!category) {
      ctx.status = 404;
      ctx.body = respondBody('Category not found', false, {}) as IRespondData;
      return;
    }

    if (category.isDeleted) {
      ctx.status = 400;
      ctx.body = respondBody('Validation Error', false, {
        error: 'Category is already deleted',
      }) as IRespondData;
      return;
    }

    await CategoryModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          isDeleted: true,
        },
      }
    );
    const idDeletedData = await CategoryModel.find({ _id: id });
    ctx.body = respondBody('Category successfully deleted', true, idDeletedData) as IRespondData;
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.status = 500;
    ctx.body = respondBody('Failed to delete category', false, {
      error: error.message,
    }) as IRespondData;
  }
  return;
};

// Get Category
export const getCategory = async (ctx: ParameterizedContext) => {
  try {
    const { page, limit } = ctx.query;
    console.log('inii isi variabel page', page);
    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 10;

    console.log('inii isi variabel pageNumber', pageNumber);
    if (pageNumber < 1) {
      ctx.status = 400;
      ctx.body = respondBody('Validation Error', false, {
        error: 'Page number must be a positive integer',
      });
      return;
    }

    if (pageSize < 1) {
      ctx.status = 400;
      ctx.body = respondBody('Validation Error', false, {
        error: 'Limit must be a positive integer',
      });
      return;
    }

    const skip = (pageNumber - 1) * pageSize;

    const category = await CategoryModel.find({ isDeleted: false }).skip(skip).limit(pageSize).exec();

    const totalCategory = await CategoryModel.countDocuments({
      isDeleted: false,
    });

    const response: IPaginatedResponse<ICategory> = {
      data: category,
      meta: {
        totalItems: totalCategory,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCategory / pageSize),
        itemsPerPage: pageSize,
      },
    };
    ctx.body = response;
  } catch (error) {
    ctx.status = error.status || 500;
    ctx.body = { message: error.message || 'Internal Server Error' };
    // Atau gunakan middleware error handling
  }
};

// Get Category by Id
export const getCategoryById = async (ctx: ParameterizedContext) => {
  const { id } = ctx.params as IQueryParamsGetById;
  console.log('Requested Category ID: ', id);

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      ctx.status = 400;
      ctx.body = respondBody('Validation Error', false, {
        error: 'Invalid category ID format',
      }) as IRespondData;
      return;
    }

    const categoryData = await CategoryModel.find({
      _id: id,
      isDeleted: false,
    });

    if (categoryData.length === 0) {
      ctx.status = 404;
      ctx.body = respondBody('Category not found', false, {}) as IRespondData;
      return;
    }

    const response = {
      data: categoryData,
    };
    ctx.body = response;
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.status = 500;
    ctx.body = respondBody('Failed to get category by Id', false, {
      error: error.message,
    }) as IRespondData;
    return;
  }
};
