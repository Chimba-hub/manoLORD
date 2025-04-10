const express = require('express');
const mongoose = require('mongoose'); // Importar Mongoose
const app = express();
const port = 3000;

// Middleware para servir archivos estáticos
app.use(express.static('public'));
app.use(express.json()); // Middleware para parsear JSON en las peticiones POST/PUT

const dbUri = 'mongodb+srv://juanestebanurreac:Fv7lb9gbj0AOHED9@cluster0.h3xrm2f.mongodb.net/'; // Reemplaza con tu URI de conexión a MongoDB Atlas o local
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error de conexión a MongoDB:', err));

// --- Modelos (Importar o definir aquí si prefieres, sino en archivos separados en /models/) ---
const Product = require('./models/product'); // Importar el modelo de Producto
const CompanyInfo = require('./models/companyInfo'); // Importar el modelo de CompanyInfo


// --- Rutas API ---

// **Rutas de Productos (CRUD)**

// Obtener todos los productos
app.get('/api/productos', async (req, res) => {
    try {
        const productos = await Product.find(); // Usar el modelo Product para consultar MongoDB
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos', error: error.message });
    }
});

// Crear un nuevo producto
app.post('/api/productos', async (req, res) => {
    const producto = new Product(req.body); // Crear una instancia del modelo Product con los datos del cuerpo de la petición
    try {
        const nuevoProducto = await producto.save(); // Guardar en MongoDB
        res.status(201).json(nuevoProducto); // 201 Created
    } catch (error) {
        res.status(400).json({ message: 'Error al crear producto', error: error.message }); // 400 Bad Request
    }
});

// Actualizar un producto (por ID)
app.put('/api/productos/:id', async (req, res) => {
    try {
        const productoActualizado = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }); // { new: true } para retornar el documento actualizado
        if (!productoActualizado) {
            return res.status(404).json({ message: 'Producto no encontrado' }); // 404 Not Found
        }
        res.json(productoActualizado);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar producto', error: error.message });
    }
});


// Eliminar un producto (por ID)
app.delete('/api/productos/:id', async (req, res) => {
    try {
        const productoEliminado = await Product.findByIdAndDelete(req.params.id);
        if (!productoEliminado) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
    }
});


// **Rutas de Información de la Empresa (CRUD básico si es necesario, o solo lectura)**
app.get('/api/company-info', async (req, res) => {
    try {
        const info = await CompanyInfo.findOne(); // Asumiendo que solo hay un documento de info, o quieres el primero
        res.json(info);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener información de la empresa', error: error.message });
    }
});


// --- Iniciar el servidor ---
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
