const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
    {
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, 'product_id is required']
        },
        quantity: {
            type: Number,
            required: [true, 'quantity is required'],
            min: [1, 'quantity must be greater than or equal to 1']
        },
        price_at_order: {
            type: Number,
            required: [true, 'price_at_order is required'],
            min: [0, 'price_at_order cannot be negative']
        },
        total: {
            type: Number,
            required: [true, 'total is required'],
            min: [0, 'total cannot be negative']
        }
    },
    {
        _id: false
    }
);

const orderSchema = new mongoose.Schema(
    {
        customer_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: [true, 'customer_id is required']
        },
        items: {
            type: [orderItemSchema],
            required: [true, 'items are required'],
            validate: {
                validator: function (v) {
                    return Array.isArray(v) && v.length > 0;
                },
                message: 'Order must contain at least one item'
            }
        },
        total_amount: {
            type: Number,
            required: [true, 'total_amount is required'],
            min: [0, 'total_amount cannot be negative']
        },
        payment_method: {
            type: String,
            required: [true, 'payment_method is required'],
            trim: true
        },
        status: {
            type: String,
            required: [true, 'status is required'],
            trim: true
        },
        order_date: {
            type: Date,
            required: [true, 'order_date is required'],
            default: Date.now
        }
    },
    {
        timestamps: true,
        collection: 'orders'
    }
);

module.exports = mongoose.model('Order', orderSchema);
