import { Request, Response } from 'express';
import Post from "../schemas/Post.schema.js";
import { IPost, IUser } from '../interface/interface.js';
import UserSchema from '../schemas/User.schema.js';
import { JWT } from '../utils/jwt.js';
class PostController {
    async createPost(req: Request, res: Response) {
        try {
            let token: any = req.headers.token;
            if (!token) {
                return res.status(401).json({
                    error: 'Token not found'
                });
            }
            const id = JWT.VERIFY(token).id;
            const { title, content } = req.body;
            const post: IPost = new Post({ title, content, user: id });
            await UserSchema.findByIdAndUpdate(id, {
                $push: {
                    posts: post._id
                }
            });
            await post.save();
            res.status(201).json(post);
        } catch (error) {
            res.status(500).json({ error: 'Post yaratishda xatolik yuz berdi' });
        }
    }
    async getPosts(req: Request, res: Response) {
        try {
            let token: any = req.headers.token;
            const id = JWT.VERIFY(token).id;
            if (!id) {
                return res.status(401).json({
                    error: 'unknown'
                });
            }
            // let posts: IPost[] | null = await Post.find({ user: id });
            let postAll: IPost[] | null = await Post.find();
            res.json(postAll);
        } catch (error) {
            res.status(500).json({ error: 'Postlarni olishda xatolik yuz berdi' });
        }
    }

    // Postni olish
    async getPostById(req: Request, res: Response) {
        try {
            let token: any = req.headers.token;
            const id = JWT.VERIFY(token).id;
            if (!id) {
                return res.status(401).json({
                    error: 'unknown'
                });
            }
            const post: IPost | null = await Post.findById(req.params.id).populate('user');
            // if (post && post.user == id) {
            //     res.json(post);
            // } else {
            //     res.status(404).json({ error: 'Post topilmadi' });
            // }
            if (post) {
                res.json(post);
            } else {
                res.status(404).json({ error: 'Post topilmadi' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Postni olishda xatolik yuz berdi' });
        }
    }

    // Postni yangilash
    async updatePost(req: Request, res: Response) {
        try {
            let token: any = req.headers.token;
            const id = JWT.VERIFY(token).id;
            if (!id) {
                return res.status(401).json({
                    error: 'unknown'
                });
            }
            const { title, content } = req.body;
            let post: IPost | null = await Post.findById(req.params.id);
            if (post && post.user == id) {
                let post: IPost | null = await Post.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
                res.json(post);
            } else {
                res.status(404).json({ error: 'Post topilmadi yoki xato so\'rov yubordingiz.' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Postni yangilashda xatolik yuz berdi' });
        }
    }

    // Postni o'chirish
    async deletePost(req: Request, res: Response) {
        try {
            let token: any = req.headers.token;
            const id = JWT.VERIFY(token).id;
            if (!id) {
                return res.status(401).json({
                    error: 'unknown'
                });
            }
            let post: IPost | null = await Post.findById(req.params.id);
            if (post && post.user == id) {
                const post2: IPost | null = await Post.findByIdAndDelete(req.params.id);
                res.json({ message: 'Post o\'chirildi' });
            } else {
                res.status(404).json({ error: 'Post topilmadi' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Postni o\'chirishda xatolik yuz berdi' });
        }
    }
}
export default new PostController();
