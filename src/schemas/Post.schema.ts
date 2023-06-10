import mongoose, { Schema } from 'mongoose';
import { IPost } from '../interface/interface';
const postSchema: Schema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

export default mongoose.model<IPost>('Post', postSchema);
