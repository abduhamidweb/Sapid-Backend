import mongoose, { Document, Schema } from 'mongoose';
import validator from 'validator';
import { IUser } from '../interface/interface';
const User: Schema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 15,
        match: /^[a-zA-Z]+$/,
        validate: {
            validator: (value: string) => {
                return validator.isAlphanumeric(value);
            },
            message: 'Username must only contain alphanumeric characters'
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value: string) => {
                return validator.isEmail(value);
            },
            message: 'Invalid email address'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        // validate: {
        //     validator: (value: any) => {
        //         return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(value);
        //     },
        //     message: 'Password must contain at least 8 characters including uppercase, lowercase, and numeric characters'
        // }
    },
    posts: [{
        type: mongoose.Types.ObjectId,
        ref: 'Post'
    }]
});

export default mongoose.model<IUser>('User', User);
