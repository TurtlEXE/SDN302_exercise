const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true
        },
        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Product price cannot be negative']
        },
        category: {
            type: String,
            required: [true, 'Product category is required'],
            trim: true
        },
        stock: {
            type: Number,
            required: [true, 'Product stock is required'],
            min: [0, 'Product stock cannot be negative']
        }
    },
    {
        timestamps: true,
        collection: 'products'
    }
);

module.exports = mongoose.model('Product', productSchema);
