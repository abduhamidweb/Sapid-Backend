var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Post from "../schemas/Post.schema.js";
import UserSchema from '../schemas/User.schema.js';
import { JWT } from '../utils/jwt.js';
class PostController {
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let token = req.headers.token;
                if (!token) {
                    return res.status(401).json({
                        error: 'Token not found'
                    });
                }
                const id = JWT.VERIFY(token).id;
                const { title, content } = req.body;
                const post = new Post({ title, content, user: id });
                yield UserSchema.findByIdAndUpdate(id, {
                    $push: {
                        posts: post._id
                    }
                });
                yield post.save();
                res.status(201).json(post);
            }
            catch (error) {
                res.status(500).json({ error: 'Post yaratishda xatolik yuz berdi' });
            }
        });
    }
    getPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let token = req.headers.token;
                const id = JWT.VERIFY(token).id;
                if (!id) {
                    return res.status(401).json({
                        error: 'unknown'
                    });
                }
                // let posts: IPost[] | null = await Post.find({ user: id });
                let postAll = yield Post.find();
                res.json(postAll);
            }
            catch (error) {
                res.status(500).json({ error: 'Postlarni olishda xatolik yuz berdi' });
            }
        });
    }
    // Postni olish
    getPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let token = req.headers.token;
                const id = JWT.VERIFY(token).id;
                if (!id) {
                    return res.status(401).json({
                        error: 'unknown'
                    });
                }
                const post = yield Post.findById(req.params.id).populate('user');
                // if (post && post.user == id) {
                //     res.json(post);
                // } else {
                //     res.status(404).json({ error: 'Post topilmadi' });
                // }
                if (post) {
                    res.json(post);
                }
                else {
                    res.status(404).json({ error: 'Post topilmadi' });
                }
            }
            catch (error) {
                res.status(500).json({ error: 'Postni olishda xatolik yuz berdi' });
            }
        });
    }
    // Postni yangilash
    updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let token = req.headers.token;
                const id = JWT.VERIFY(token).id;
                if (!id) {
                    return res.status(401).json({
                        error: 'unknown'
                    });
                }
                const { title, content } = req.body;
                let post = yield Post.findById(req.params.id);
                if (post && post.user == id) {
                    let post = yield Post.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
                    res.json(post);
                }
                else {
                    res.status(404).json({ error: 'Post topilmadi yoki xato so\'rov yubordingiz.' });
                }
            }
            catch (error) {
                res.status(500).json({ error: 'Postni yangilashda xatolik yuz berdi' });
            }
        });
    }
    // Postni o'chirish
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let token = req.headers.token;
                const id = JWT.VERIFY(token).id;
                if (!id) {
                    return res.status(401).json({
                        error: 'unknown'
                    });
                }
                let post = yield Post.findById(req.params.id);
                if (post && post.user == id) {
                    const post2 = yield Post.findByIdAndDelete(req.params.id);
                    res.json({ message: 'Post o\'chirildi' });
                }
                else {
                    res.status(404).json({ error: 'Post topilmadi' });
                }
            }
            catch (error) {
                res.status(500).json({ error: 'Postni o\'chirishda xatolik yuz berdi' });
            }
        });
    }
}
export default new PostController();
