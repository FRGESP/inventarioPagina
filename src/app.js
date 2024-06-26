import express from 'express'
import productsRoutes from './routes/products.route.js'
import categoriasRoutes from './routes/categorias.route.js'
import inicioRoutes from './routes/inicio.route.js'
import personaRoutes from './routes/personas.route.js'
import proveedoresRoutes from './routes/proveedores.route.js'
import registrosPrecios from './routes/registroPrecios.route.js'
import clientesRoutes from './routes/clientes.route.js'
import ventasRoutes from './routes/ventas.route.js'
import registroProductosRoutes from './routes/registroProductos.route.js'
import PDFTest from './routes/facturasTest.route.js'
import facturasRoutes from './routes/facturas.route.js'
import devolucionRoutes from './routes/devoluciones.route.js'
import cors from "cors";


const app = express();

app.use(cors({
    origin : ["http://127.0.0.1:5500","http://127.0.0.1:5500"]
}))
app.use(express.json());
app.use(productsRoutes);
app.use(categoriasRoutes);
app.use(inicioRoutes);
app.use(personaRoutes);
app.use(proveedoresRoutes);
app.use(clientesRoutes);
app.use(ventasRoutes);
app.use(registrosPrecios);
app.use(PDFTest);
app.use(facturasRoutes);
app.use(devolucionRoutes);
app.use(registroProductosRoutes);

export default app;