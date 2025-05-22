import httpStatus from "http-status";
import AppError from "../../error/appError";
import { IProduct } from "./product.interface";
import productModel from "./product.model";

const updateUserProfile = async (id: string, payload: Partial<IProduct>) => {
    if (payload.email || payload.username) {
        throw new AppError(httpStatus.BAD_REQUEST, "You cannot change the email or username");
    }
    const user = await productModel.findById(id);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "Profile not found");
    }
    return await productModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
};

const ProductServices = { updateUserProfile };
export default ProductServices;