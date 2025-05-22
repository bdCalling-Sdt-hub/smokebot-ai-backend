import catchAsync from '../../utilities/catchasync';
import sendResponse from '../../utilities/sendResponse';
import productService from './product.service';

const createProduct = catchAsync(async (req, res) => {
    const result = await productService.createProduct(
        req.user.profileId,
        req.body
    );
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Product created successfully',
        data: result,
    });
});

const updateProduct = catchAsync(async (req, res) => {
    const result = await productService.updateProduct(
        req.user.profileId,
        req.params.id,
        req.body
    );
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Product updated successfully',
        data: result,
    });
});

const getAllProducts = catchAsync(async (req, res) => {
    const result = await productService.getAllProducts(req.query);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Products retrieved successfully',
        data: result,
    });
});
const getMyProducts = catchAsync(async (req, res) => {
    const result = await productService.getMyProduct(
        req.user.profileId,
        req.query
    );
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Products retrieved successfully',
        data: result,
    });
});

const getSingleProduct = catchAsync(async (req, res) => {
    const result = await productService.getSingleProduct(req.params.id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Product retrieved successfully',
        data: result,
    });
});
const deleteProduct = catchAsync(async (req, res) => {
    const result = await productService.deleteProduct(
        req.user.profileId,
        req.params.id
    );
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Product deleted successfully',
        data: result,
    });
});

const productController = {
    createProduct,
    updateProduct,
    getAllProducts,
    getSingleProduct,
    deleteProduct,
    getMyProducts,
};

export default productController;
