import express from 'express'
import productsRoutes from './routes/products.route.js'
import cors from "cors";


const app = express();

app.use(cors({
    origin : ["http://127.0.0.1:5500","http://127.0.0.1:5500"]
}))
app.use(express.json());
app.use(productsRoutes);


export default app;