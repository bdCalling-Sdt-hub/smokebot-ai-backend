import httpStatus from 'http-status';
import AppError from '../../error/appError';
import { IProduct } from './product.interface';
import { Product } from './product.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createProduct = async (storeId: string, payload: IProduct) => {
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
    const updated = await Product.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return updated;
};

const getAllProducts = async (query: Record<string, unknown>) => {
    const productQuery = new QueryBuilder(
        Product.find().populate({ path: 'store' }),
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
const getMyProduct = async (
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

const getSingleProduct = async (id: string) => {
    return await Product.findById(id).populate('store');
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
};

export default productService;
