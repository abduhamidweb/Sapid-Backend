import express, { Application, Request, Response, NextFunction } from "express";
import { connectToDatabase } from "../db/db.js";
// import "../db/mongo.js"
const app: Application = express();
const PORT: number = Number(process.env.PORT) || 5000;
import errorMiddleware from "../middleware/errorHandler.js";
import userRoutes from "../routes/user.routes.js";
import postRoutes from "../routes/post.routes.js";
import swRouter from "../utils/swagger.js";
import productRouter from "../routes/product.routes.js"
app.use(express.json());
app.use('/docs', swRouter);
app.use('/users', userRoutes);
app.use('/post', postRoutes);
app.use('product', productRouter);
app.use(errorMiddleware);
// app.listen(PORT, () => console.log("Server listening on port" + PORT));

connectToDatabase().then(() => {
    app.listen(PORT, () => console.log("Server listening on port" + PORT));

});    