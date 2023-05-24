const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const productManager = new ProductManager('products.json');

app.use(express.urlencoded({ extended: true }))

app.get('/products', async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts();

        if (limit) {
            const limitedProducts = products.slice(0, parseInt(limit));
            res.json(limitedProducts);
        } else {
            res.json(products);
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/products/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductById(productId);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});

