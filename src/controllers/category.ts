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
    console.log('Process ended with breadcumbId:', breadcrumbId);
    ctx.body = respondBody('Category successfully created', true, {}) as IRespondData;
  } catch (error) {
    console.error('Error occurred with breadcrumbId:', breadcrumbId, error);
    ctx.status = 500;
    ctx.body = respondBody('Failed to create category', false, {
      error: error.message,
    });
  }
  return;
};

// Update category
export const updateCategory = async (ctx: ParameterizedContext) => {
  const { id } = ctx.params as IQueryParamsGetById;
  const { breadcrumbId, data } = ctx.request.body as ICategoryRequestBody;
  console.log('Process started with BreadcrumbId:', breadcrumbId);

  try {
    const categoryIds: ICategory[] = data;
    await Promise.all(
      categoryIds.map(async (categoryId) => {
        await CategoryModel.updateOne(
          { _id: id },
          {
            $set: {
              name: categoryId.name,
              organizer: categoryId.organizer,
            },
          }
        );
      })
    );
    const updatedData = await CategoryModel.find({ _id: { $in: id } });
    ctx.body = respondBody('Category successfully updated', true, updatedData) as IRespondData;
  } catch (error) {
    console.error('Error occured with breadcrumbId: ', breadcrumbId, error);
    ctx.status = 500;
    ctx.body = respondBody('Failed to update the category', false, {
      error: error.message,
    }) as IRespondData;
  }
  return;
};

// Delete Category
export const deleteCategory = async (ctx: ParameterizedContext) => {
  const { id } = ctx.params as IQueryParamsGetById;
  try {
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
    const idDeletedData = await CategoryModel.find({ _id: { $in: id } });
    ctx.body = respondBody('Category successfully deleted', true, idDeletedData) as IRespondData;
  } catch (error) {
    console.error('Error occured with breadcrumbId:', error);
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
    const { page, limit } = ctx.request.body as IQueryParams;
    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 10;

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
  console.log('ISI DATAAA: ', id);

  try {
    console.log('INI ISI CATEGORY ID', id);
    const categoryData = await CategoryModel.find({
      _id: id,
      isDeleted: false,
    });
    const response = {
      data: categoryData,
    };
    ctx.body = response;
  } catch (error) {
    console.error('Error occured with breadcrumbId:', error);
    ctx.status = 500;
    ctx.body = respondBody('Failed to get category by Id', false, {
      error: error.message,
    }) as IRespondData;
    return;
  }
};
