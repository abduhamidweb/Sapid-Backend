import { Router } from 'express';
import { ProductController } from './../controllers/product.contr.js';
import authMiddleware from '../middleware/auth.js';

const router: Router = Router();
const controller: ProductController = new ProductController();
router.get('/', controller.getAllProducts);
router.get('/:id', controller.getProductById);
router.get('/', controller.getProductByCategory);
router.post('/', authMiddleware, controller.createProduct);
router.put('/:id', authMiddleware, controller.updateProduct);
router.delete('/:id', authMiddleware, controller.deleteProduct);
export default router;
