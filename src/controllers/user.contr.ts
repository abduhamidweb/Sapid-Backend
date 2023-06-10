import { Request, Response } from 'express';
import { IUser } from '../interface/interface.js';
import User from '../schemas/User.schema.js';
import { sendConfirmationEmail } from '../utils/nodemailer.js';
import { JWT } from '../utils/jwt.js';
import sha256 from "sha256"
import redis from "redis";
const client = redis.createClient();
client.connect();
class UserController {
    // Yeni foydalanuvchi qo'shish 
    async createUser(req: Request, res: Response) {
        try {
            const { name, email, password, confirmationCode } = req.body;
            // Birinchi marta post qilganda foydalanuvchi ma'lumotlarini yuborish
            if (!confirmationCode) {
                const generatedConfirmationCode = await sendConfirmationEmail(email);
                await client.set(email, generatedConfirmationCode)
                return res.status(200).json({
                    success: true,
                    message: "Foydalanuvchi ma'lumotlari yuborildi. Tasdiqlash kodi yuborildi",
                    confirmationCode: generatedConfirmationCode // Tasdiqlash kodi javob qaytariladi
                });
            }
            // Tasdiqlash kodi tekshirish
            if (confirmationCode !== await client.get(email)) {
                return res.status(400).json({
                    success: false,
                    error: "Noto'g'ri tasdiqlash kodi"
                });
            }
            const user: IUser = new User({ name, email, password: sha256(password) });
            await user.save();
            res.status(201).json({
                success: true,
                token: JWT.SIGN({
                    id: user._id
                }),
                data: user
            });
        } catch (error) {
            console.log('error :', error);
            res.status(500).json({ error: 'Foydalanuvchi qo\'shishda xatolik yuz berdi' });
        }
    }
    // Foydalanuvchilarni olish
    async getUsers(req: Request, res: Response) {
        try {
            let token: any = req.headers.token;
            const userId = JWT.VERIFY(token).id;
            // const user: IUser | null = await User.findById(userId);
            const users: IUser[] | null = await User.find();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: 'Foydalanuvchilarni olishda xatolik yuz berdi' });
        }
    }
    async getUserById(req: Request, res: Response) {
        try {
            let token: any = req.headers.token;
            const userId = JWT.VERIFY(token).id;
            // if (!(userId == req.params.id)) {
            //     return res.status(401).json({
            //         error: 'Yaroqsiz token not found'
            //     });
            // }

            const user: IUser | null = await User.findById(req.params.id).populate('posts');
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Foydalanuvchini olishda xatolik yuz berdi' });
        }
    }
    // Foydalanuvchini yangilash
    async updateUser(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;
            let token: any = req.headers.token;
            const decodedToken = JWT.VERIFY(token).id;
            if (!(decodedToken == req.params.id)) {
                return res.status(401).json({
                    error: 'Siz faqat o\'zingizning ma\'lumotlaringizni o\'zgartira olasiz'
                });
            }
            const user: IUser | null = await User.findByIdAndUpdate(req.params.id, { name, password, email }, { new: true });
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Foydalanuvchini yangilashda xatolik yuz berdi' });
        }
    }
    // Foydalanuvchini o'chirish
    async deleteUser(req: Request, res: Response) {
        try {
            let token: any = req.headers.token;
            const decodedToken = JWT.VERIFY(token).id;
            if (!(decodedToken == req.params.id)) {
                return res.status(401).json({
                    error: 'Siz faqat o\'zingizning ma\'lumotlaringizni o\'zgartira olasiz'
                });
            }
            const user: IUser | null = await User.findByIdAndDelete(req.params.id);
            if (user) {
                res.json({ message: 'Foydalanuvchi o\'chirildi' });
            } else {
                res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Foydalanuvchini o\'chirishda xatolik yuz berdi' });
        }
    }
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const user: IUser | null = await User.findOne({ email });
            if (!user) {
                res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            } else {
                if (user.password === sha256(password)) {
                    res.status(201).json({
                        success: true,
                        token: JWT.SIGN({ id: user._id }),
                        data: user
                    });
                } else {
                    res.status(401).json({
                        success: false,
                        error: 'Invalid password'
                    });
                }
            }
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    async forget(req: Request, res: Response) {
        try {
            const { email, confirmationCode } = req.body;
            if (!confirmationCode) {
                const generatedConfirmationCode = await sendConfirmationEmail(email);
                await client.set(email, generatedConfirmationCode)
                return res.status(200).json({
                    success: true,
                    message: "Foydalanuvchi ma'lumotlari yuborildi. Tasdiqlash kodi yuborildi",
                    confirmationCode: generatedConfirmationCode // Tasdiqlash kodi javob qaytariladi
                });
            }
            // Tasdiqlash kodi tekshirish
            if (confirmationCode !== await client.get(email)) {
                return res.status(400).json({
                    success: false,
                    error: "Noto'g'ri tasdiqlash kodi"
                });
            }
            const user: IUser | null = await User.findOne({ email });
            if (!user) {
                res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }
            await User.findOneAndUpdate({ email }, {
                password: sha256(req.body.password)
            })
            res.status(201).json({
                success: true,
                token: JWT.SIGN({ id: user ? user._id : null }),
                data: user
            });
        } catch (error) {
            console.log('error :', error);
            res.status(500).json({ error: 'Foydalanuvchi qo\'shishda xatolik yuz berdi' });
        }
    }
}
export default new UserController();