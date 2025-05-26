/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import fs, { PathLike } from 'fs';
import csv from 'csv-parser';
import { getIO } from '../socket/socketManager';
import unlinkFile from '../utilities/unlinkFile';
import Category from '../modules/category/category.model';
import { Product } from '../modules/product/product.model';

let uploadCanceled = false;

export const stopCsvUpload = async (req: Request, res: Response) => {
    uploadCanceled = true;
    res.send({ stop: true });
};

const uploadCsvFile = async (req: Request, res: Response) => {
    uploadCanceled = false;
    const filePath = req?.file?.path;
    const results: any[] = [];
    const io = getIO();

    fs.createReadStream(filePath as PathLike)
        .pipe(csv())
        // .on('data', (data) => results.push(data))
        // for solve strine quotes in key
        .on('data', (data) => {
            // Normalize the keys by removing any leading/trailing quotes or spaces around keys
            const normalizedData = Object.keys(data).reduce((acc: any, key) => {
                // Clean the key: remove any quotes or leading/trailing spaces
                const cleanedKey = key.replace(/^['"]|['"]$/g, '').trim();

                // Add the cleaned key-value pair to the accumulator
                acc[cleanedKey] = data[key];
                return acc;
            }, {});

            results.push(normalizedData);
        })
        .on('end', async () => {
            try {
                let count = 0;
                for (const row of results) {
                    if (uploadCanceled) {
                        break;
                    }
                    console.log('row', row);
                    const { name, isFeatured, category, price, quantity } = row;
                    console.log(
                        'kdjkdjfkdj',
                        name,
                        isFeatured,
                        category,
                        price
                    );
                    const payload = {
                        name,
                        isFeatured,
                        category,
                        price,
                        quantity,
                    };
                    // if (isFeatured == 'true') {
                    //     payload.isFeatured = true;
                    // } else {
                    //     payload.isFeatured = false;
                    // }
                    payload.isFeatured = false;
                    const productCategory = category.toLowerCase();

                    const data = await Category.findOne();
                    if (
                        !data?.categories.some(
                            (category) =>
                                category.toLowerCase() === productCategory
                        )
                    ) {
                        await Category.updateOne(
                            {},
                            { $addToSet: { categories: category } },
                            { upsert: true }
                        );
                    } else {
                        payload.category = data.categories.find(
                            (category) =>
                                category.toLowerCase() == productCategory
                        );
                    }

                    await Product.findOneAndUpdate(
                        { name: payload.name, store: req.user.profileId },
                        {
                            ...payload,
                            store: req.user.profileId,
                        },
                        { upsert: true, new: true }
                    );
                    count++;
                    io.emit('upload-progress', {
                        total: results?.length,
                        completed: count,
                    });
                }

                // Delete file after processing
                // fs.unlinkSync(filePath as PathLike);
                unlinkFile(filePath as string);

                res.status(200).send({
                    success: true,
                    message: 'Product successfully uploaded and saved.',
                });
            } catch (error: any) {
                res.status(500).send({
                    message: `Error processing data: ${error.message}`,
                });
            }
        });
};

export default uploadCsvFile;
