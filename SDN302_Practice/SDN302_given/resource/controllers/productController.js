const mongoose = require('mongoose');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving products', error: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving product', error: error.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { name, price, category, stock } = req.body || {};

        if (!name || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ message: 'Validation error: Product name is required' });
        }

        if (price === undefined || price === null || typeof price !== 'number' || price < 0) {
            return res.status(400).json({ message: 'Validation error: Product price is required and must be >= 0' });
        }

        if (!category || typeof category !== 'string' || !category.trim()) {
            return res.status(400).json({ message: 'Validation error: Product category is required' });
        }

        if (stock === undefined || stock === null || typeof stock !== 'number' || stock < 0) {
            return res.status(400).json({ message: 'Validation error: Product stock is required and must be >= 0' });
        }

        const newProduct = await Product.create({
            name: name.trim(),
            price,
            category: category.trim(),
            stock
        });

        return res.status(201).json(newProduct);
    } catch (error) {
        return res.status(400).json({ message: 'Validation error', error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const { name, price, category, stock } = req.body || {};

        if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
            return res.status(400).json({ message: 'Validation error: name must be a non-empty string' });
        }

        if (price !== undefined && (typeof price !== 'number' || price < 0)) {
            return res.status(400).json({ message: 'Validation error: price must be a number >= 0' });
        }

        if (category !== undefined && (typeof category !== 'string' || !category.trim())) {
            return res.status(400).json({ message: 'Validation error: category must be a non-empty string' });
        }

        if (stock !== undefined && (typeof stock !== 'number' || stock < 0)) {
            return res.status(400).json({ message: 'Validation error: stock must be a number >= 0' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        return res.status(200).json(updatedProduct);
    } catch (error) {
        return res.status(400).json({ message: 'Error updating product', error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if an Order references this product
        const referenced = await Order.findOne({ 'items.product_id': id });
        if (referenced) {
            return res.status(409).json({
                message: 'Cannot delete product: product is referenced by one or more orders'
            });
        }

        await Product.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};
