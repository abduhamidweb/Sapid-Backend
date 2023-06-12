var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Product from '../schemas/Product.schema.js';
import * as path from 'path';
import * as fs from 'fs';
import redis from "redis";
const client = redis.createClient();
client.connect();
function pathJoin(filename) {
    const newPath = filename.split(' ').join('-');
    return path.normalize(newPath);
}
function isFile(filePath) {
    try {
        return fs.statSync(filePath).isFile();
    }
    catch (error) {
        return false;
    }
}
export class ProductController {
    getAllProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { category, id } = req.query;
                const getData = yield client.get("products");
                if (getData) {
                    const parsedData = JSON.parse(getData);
                    if (category) {
                        let filterdataByCategory = parsedData.filter(product => product.category == category);
                        res.send(filterdataByCategory);
                    }
                    else if (id) {
                        let filterdataByCategory = parsedData.filter(product => product._id == id);
                        res.send(filterdataByCategory);
                    }
                    else if (Object.keys(req.query).length === 0) {
                        res.json(parsedData);
                    }
                }
                else {
                    const products = yield Product.find();
                    const productsJSON = JSON.stringify(products);
                    yield client.set("products", productsJSON);
                    res.json(products);
                }
            }
            catch (error) {
                res.status(500).json({ error: 'Server error' });
            }
            finally {
                // await client.quit();
            }
        });
    }
    getProductById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const productId = req.params.id;
            try {
                const product = yield Product.findById(productId);
                if (product) {
                    res.json(product);
                }
                else {
                    res.status(404).json({ error: 'Product not found' });
                }
            }
            catch (error) {
                res.status(500).json({ error: 'Server error' });
            }
        });
    }
    getProductByCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const productCategory = req.params.category;
            try {
                const product = yield Product.find({ category: productCategory });
                if (product) {
                    res.json(product);
                }
                else {
                    res.status(404).json({ error: 'Product not found' });
                }
            }
            catch (error) {
                console.log('error :', error);
                res.status(500).json({ error: 'Server error' });
            }
        });
    }
    createProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { category, title, description, price, discount, count } = req.body;
                let file;
                ({ file } = req.files);
                if (file.truncated)
                    throw new Error('you must send a max 50 MB file');
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
                const product = yield Product.create(newProduct); // product o'zgaruvchisiga o'rnating
                yield file.mv(path.join(process.cwd(), 'src', 'public', 'foodIMG', foodImg));
                res.status(201).json(product);
            }
            catch (error) {
                console.log('Error creating product:', error);
                res.status(500).json({ error: 'Server error' });
            }
        });
    }
    updateProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const productId = req.params.id;
            const productData = req.body;
            try {
                const product = yield Product.findByIdAndUpdate(productId, productData, {
                    new: true,
                });
                if (product) {
                    res.json(product);
                }
                else {
                    res.status(404).json({ error: 'Product not found' });
                }
            }
            catch (error) {
                res.status(500).json({ error: 'Server error' });
            }
        });
    }
    deleteProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const productId = req.params.id;
            try {
                const product = yield Product.findByIdAndDelete(productId);
                if (product) {
                    res.json(product);
                }
                else {
                    res.status(404).json({ error: 'Product not found' });
                }
            }
            catch (error) {
                res.status(500).json({ error: 'Server error' });
            }
        });
    }
}
