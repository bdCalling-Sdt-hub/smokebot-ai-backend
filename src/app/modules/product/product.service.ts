import httpStatus from 'http-status';
import AppError from '../../error/appError';
import { IProduct } from './product.interface';
import { Product } from './product.model';
import QueryBuilder from '../../builder/QueryBuilder';
import Category from '../category/category.model';

const createProduct = async (storeId: string, payload: IProduct) => {
    const data = await Category.findOne();
    if (!data?.categories.includes(payload.category)) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Category not found , please select valid category'
        );
    }
    const totalFeaturedProduct = await Product.countDocuments({
        isFeatured: true,
        store: storeId,
    });
    if (payload.isFeatured && totalFeaturedProduct >= 5) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'You already added 5 featured product , if you want to add that as feature you need to make unfeatured a product first'
        );
    }
    const created = await Product.create({ ...payload, store: storeId });
    return created;
};

const updateProduct = async (
    storeId: string,
    id: string,
    payload: Partial<IProduct>
) => {
    const product = await Product.findOne({ store: storeId, _id: id });
    if (!product) {
        throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
    }
    const totalFeaturedProduct = await Product.countDocuments({
        isFeatured: true,
        store: storeId,
    });
    if (payload.isFeatured && totalFeaturedProduct >= 5) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'You already added 5 featured product , if you want to add that as feature you need to make unfeatured a product first'
        );
    }
    if (payload.category) {
        const data = await Category.findOne();
        if (!data?.categories.includes(payload.category)) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Category not found , please select valid category'
            );
        }
    }

    const updated = await Product.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return updated;
};

const getAllProducts = async (query: Record<string, unknown>) => {
    const productQuery = new QueryBuilder(Product.find(), query)
        .search(['name'])
        .fields()
        .filter()
        .paginate()
        .sort();
    const result = await productQuery.modelQuery;
    const meta = await productQuery.countTotal();
    return {
        meta,
        result,
    };
};
const getMyProduct = async (
    storeId: string,
    query: Record<string, unknown>
) => {
    const productQuery = new QueryBuilder(
        Product.find({ store: storeId }),
        query
    )
        .search(['name'])
        .fields()
        .filter()
        .paginate()
        .sort();
    const result = await productQuery.modelQuery;
    const meta = await productQuery.countTotal();
    return {
        meta,
        result,
    };
};
const getSpecificStoreProduct = async (
    storeId: string,
    query: Record<string, unknown>
) => {
    const productQuery = new QueryBuilder(
        Product.find({ store: storeId }).populate({ path: 'store' }),
        query
    )
        .search(['name'])
        .fields()
        .filter()
        .paginate()
        .sort();
    const result = await productQuery.modelQuery;
    const meta = await productQuery.countTotal();
    return {
        meta,
        result,
    };
};
//
const getSingleProduct = async (id: string) => {
    return await Product.findById(id);
};
const deleteProduct = async (storeId: string, id: string) => {
    const product = Product.findOne({ store: storeId, _id: id });
    if (!product) {
        throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
    }
    return await Product.findByIdAndDelete(id);
};

const productService = {
    createProduct,
    updateProduct,
    getAllProducts,
    getSingleProduct,
    getMyProduct,
    deleteProduct,
    getSpecificStoreProduct,
};

export default productService;
