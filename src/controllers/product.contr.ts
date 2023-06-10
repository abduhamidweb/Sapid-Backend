import { Request, Response } from 'express';
import { IProduct } from '../interface/interface';
import Product from '../schemas/Product.schema.js';


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

    public async createProduct(req: Request, res: Response): Promise<void> {
        const productData: IProduct = req.body;

        try {
            const product: IProduct = await Product.create(productData);
            res.status(201).json(product);
        } catch (error) {
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
