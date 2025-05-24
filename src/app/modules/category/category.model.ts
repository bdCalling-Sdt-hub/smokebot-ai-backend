import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    categories: {
        type: [String],
        unique: true,
    },
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
