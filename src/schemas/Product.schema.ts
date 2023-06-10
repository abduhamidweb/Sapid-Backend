import { Schema, model } from 'mongoose';
import { IProduct } from '../interface/interface';
const productSchema = new Schema<IProduct>({
    category: {
        type: String,
        enum: ['lavash', 'shurva', 'burger', 'xot-dog', 'pizza', 'ichimlik'],
        required: true
    },
    img: {
        type: String,
        required: true
    },
    title: {
        type: String,
        maxlength: 50,
        required: true
    },
    description: {
        type: String,
        maxlength: 100,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    count: {
        type: Number,
        default: 1
    }
});

const Product = model<IProduct>('Product', productSchema);

export default Product;
