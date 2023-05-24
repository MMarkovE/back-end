const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    addProduct(product) {
        const products = this.getProducts();
        product.id = this._generateId(products);
        products.push(product);
        this._saveProducts(products);
    }

    getProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    getProductById(id) {
        const products = this.getProducts();
        return products.find(product => product.id === id);
    }

    updateProduct(id, updatedFields) {
        const products = this.getProducts();
        const productIndex = products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            const updatedProduct = { ...products[productIndex], ...updatedFields };
            products[productIndex] = updatedProduct;
            this._saveProducts(products);
            return true;
        }
        return false;
    }

    deleteProduct(id) {
        const products = this.getProducts();
        const updatedProducts = products.filter(product => product.id !== id);
        if (updatedProducts.length < products.length) {
            this._saveProducts(updatedProducts);
            return true;
        }
        return false;
    }

    _generateId(products) {
        if (products.length === 0) {
            return 1;
        }
        const lastProductId = products[products.length - 1].id;
        return lastProductId + 1;
    }

    _saveProducts(products) {
        const data = JSON.stringify(products);
        fs.writeFileSync(this.path, data);
    }
}

module.exports = ProductManager;
