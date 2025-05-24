/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import catchAsync from '../../utilities/catchasync';
import sendResponse from '../../utilities/sendResponse';
import Category from './category.model';
import AppError from '../../error/appError';

const addNewCategory = catchAsync(async (req, res) => {
    const category = req.body.newCategory;
    const newCategory = category.toLowerCase();

    const data = await Category.findOne();
    if (
        data?.categories.some(
            (category) => category.toLowerCase() === newCategory
        )
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'This category already exists'
        );
    }
    const result = await Category.updateOne(
        {},
        { $addToSet: { categories: category } },
        { upsert: true }
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Category added successfully',
        data: result,
    });
});

const getCategories = catchAsync(async (req, res) => {
    const categoryDoc = await Category.findOne();
    let result: any;
    if (categoryDoc) {
        result = categoryDoc.categories;
    } else {
        result = [];
    }
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Category added successfully',
        data: result,
    });
});

const CategoryController = {
    addNewCategory,
    getCategories,
};

export default CategoryController;
