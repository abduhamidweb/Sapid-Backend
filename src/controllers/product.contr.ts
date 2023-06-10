import { Request, Response } from 'express';
import { IProduct } from '../interface/interface';
import Product from '../schemas/Product.schema.js';
import * as path from 'path';
import * as fs from 'fs';

function pathJoin(filename: string): string {
    const newPath = filename.split(' ').join('-');
    return path.normalize(newPath);
}

function isFile(filePath: string): boolean {
    try {
        return fs.statSync(filePath).isFile();
    } catch (error) {
        return false;
    }
}
export class ProductController {
    public async getAllProducts(req: Request, res: Response): Promise<void> {
        try {
            const products: IProduct[] = await Product.find();
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    }

    public async getProductById(req: Request, res: Response): Promise<void> {
        const productId: string = req.params.id;

        try {
            const product: IProduct | null = await Product.findById(productId);
            if (product) {
                res.json(product);
            } else {
                res.status(404).json({ error: 'Product not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    }
    public async getProductByCategory(req: Request, res: Response): Promise<void> {
        const productCategory: string = req.params.category as string;
        try {
            const product: IProduct | null = await Product.findOne({ category: productCategory });
            if (product) {
                await product.save();
                res.json(product);
            } else {
                res.status(404).json({ error: 'Product not found' });
            }
        } catch (error) {
            console.log('error :', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
    public async createProduct(req: Request, res: Response): Promise<void> {
        try {
            let {
                category,
                title,
                description,
                price,
                discount,
                count
            } = req.body;
            let file: any;
            ({ file } = (req as Request & { files: { file: any } }).files);
            if (file.truncated) throw new Error('you must send a max 50 MB file');
            let types = file.name.split('.');
            let typeImg = types[types.length - 1];
            const random = Math.floor(Math.random() * 9000 + 1000);
            let foodImg = pathJoin("food" + random + '.' + typeImg);
            const newProduct = new Product({
                category,
                img: foodImg,
                title,
                description,
                price,
                discount,
                count
            });
            const product: IProduct = await Product.create(newProduct); // product o'zgaruvchisiga o'rnating
            await file.mv(
                path.join(
                    process.cwd(),
                    'src',
                    'public',
                    'foodIMG',
                    foodImg
                )
            );
            res.status(201).json(product);
        } catch (error) {
            console.log('Error creating product:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
    public async updateProduct(req: Request, res: Response): Promise<void> {
        const productId: string = req.params.id;
        const productData: IProduct = req.body;
        try {
            const product: IProduct | null = await Product.findByIdAndUpdate(productId, productData, {
                new: true,
            });
            if (product) {
                res.json(product);
            } else {
                res.status(404).json({ error: 'Product not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    }

    public async deleteProduct(req: Request, res: Response): Promise<void> {
        const productId: string = req.params.id;
        try {
            const product: IProduct | null = await Product.findByIdAndDelete(productId);
            if (product) {
                res.json(product);
            } else {
                res.status(404).json({ error: 'Product not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    }
}
