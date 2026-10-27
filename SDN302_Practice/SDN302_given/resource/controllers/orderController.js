const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('customer_id')
            .populate('items.product_id');
        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving orders', error: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const order = await Order.findById(id)
            .populate('customer_id')
            .populate('items.product_id');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        return res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving order', error: error.message });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const { customer_id, items, payment_method, status, order_date } = req.body || {};

        // 1. Validate customer_id
        if (!customer_id || !mongoose.Types.ObjectId.isValid(customer_id)) {
            return res.status(400).json({ message: 'Validation error: Valid customer_id is required' });
        }

        const customer = await Customer.findById(customer_id);
        if (!customer) {
            return res.status(400).json({ message: 'Validation error: Customer not found' });
        }

        // 2. Validate payment_method and status
        if (!payment_method || typeof payment_method !== 'string' || !payment_method.trim()) {
            return res.status(400).json({ message: 'Validation error: payment_method is required' });
        }

        if (!status || typeof status !== 'string' || !status.trim()) {
            return res.status(400).json({ message: 'Validation error: status is required' });
        }

        // 3. Validate or assign order_date
        let finalOrderDate = new Date();
        if (order_date) {
            finalOrderDate = new Date(order_date);
            if (isNaN(finalOrderDate.getTime())) {
                return res.status(400).json({ message: 'Validation error: Invalid order_date' });
            }
        }

        // 4. Validate items array
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Validation error: items must be a non-empty array' });
        }

        let calculatedTotalAmount = 0;
        const processedItems = [];

        for (const item of items) {
            if (!item.product_id || !mongoose.Types.ObjectId.isValid(item.product_id)) {
                return res.status(400).json({
                    message: 'Validation error: Valid product_id is required for each item'
                });
            }

            const product = await Product.findById(item.product_id);
            if (!product) {
                return res.status(400).json({
                    message: `Validation error: Product with ID ${item.product_id} not found`
                });
            }

            if (
                item.quantity === undefined ||
                item.quantity === null ||
                typeof item.quantity !== 'number' ||
                !Number.isInteger(item.quantity) ||
                item.quantity < 1
            ) {
                return res.status(400).json({
                    message: 'Validation error: Each item quantity must be an integer greater than or equal to 1'
                });
            }

            // Reject order if requested quantity exceeds available stock
            if (item.quantity > product.stock) {
                return res.status(400).json({
                    message: `Validation error: Requested quantity (${item.quantity}) for product "${product.name}" exceeds available stock (${product.stock})`
                });
            }

            // Set price_at_order from current Product price on the server; calculate totals
            const price_at_order = product.price;
            const itemTotal = price_at_order * item.quantity;
            calculatedTotalAmount += itemTotal;

            processedItems.push({
                product_id: product._id,
                quantity: item.quantity,
                price_at_order,
                total: itemTotal
            });
        }

        const newOrder = await Order.create({
            customer_id: customer._id,
            items: processedItems,
            total_amount: calculatedTotalAmount,
            payment_method: payment_method.trim(),
            status: status.trim(),
            order_date: finalOrderDate
        });

        const populatedOrder = await Order.findById(newOrder._id)
            .populate('customer_id')
            .populate('items.product_id');

        return res.status(201).json(populatedOrder);
    } catch (error) {
        return res.status(400).json({ message: 'Error creating order', error: error.message });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const { customer_id, items, payment_method, status, order_date } = req.body || {};

        if (customer_id !== undefined) {
            if (!mongoose.Types.ObjectId.isValid(customer_id)) {
                return res.status(400).json({ message: 'Validation error: Invalid customer_id' });
            }
            const customer = await Customer.findById(customer_id);
            if (!customer) {
                return res.status(400).json({ message: 'Validation error: Customer not found' });
            }
            order.customer_id = customer._id;
        }

        if (payment_method !== undefined) {
            if (typeof payment_method !== 'string' || !payment_method.trim()) {
                return res.status(400).json({ message: 'Validation error: payment_method must be a non-empty string' });
            }
            order.payment_method = payment_method.trim();
        }

        if (status !== undefined) {
            if (typeof status !== 'string' || !status.trim()) {
                return res.status(400).json({ message: 'Validation error: status must be a non-empty string' });
            }
            order.status = status.trim();
        }

        if (order_date !== undefined) {
            const parsedDate = new Date(order_date);
            if (isNaN(parsedDate.getTime())) {
                return res.status(400).json({ message: 'Validation error: Invalid order_date' });
            }
            order.order_date = parsedDate;
        }

        if (items !== undefined) {
            if (!Array.isArray(items) || items.length === 0) {
                return res.status(400).json({ message: 'Validation error: items must be a non-empty array' });
            }

            let calculatedTotalAmount = 0;
            const processedItems = [];

            for (const item of items) {
                if (!item.product_id || !mongoose.Types.ObjectId.isValid(item.product_id)) {
                    return res.status(400).json({
                        message: 'Validation error: Valid product_id is required for each item'
                    });
                }

                const product = await Product.findById(item.product_id);
                if (!product) {
                    return res.status(400).json({
                        message: `Validation error: Product with ID ${item.product_id} not found`
                    });
                }

                if (
                    item.quantity === undefined ||
                    item.quantity === null ||
                    typeof item.quantity !== 'number' ||
                    !Number.isInteger(item.quantity) ||
                    item.quantity < 1
                ) {
                    return res.status(400).json({
                        message: 'Validation error: Each item quantity must be an integer greater than or equal to 1'
                    });
                }

                if (item.quantity > product.stock) {
                    return res.status(400).json({
                        message: `Validation error: Requested quantity (${item.quantity}) for product "${product.name}" exceeds available stock (${product.stock})`
                    });
                }

                const price_at_order = product.price;
                const itemTotal = price_at_order * item.quantity;
                calculatedTotalAmount += itemTotal;

                processedItems.push({
                    product_id: product._id,
                    quantity: item.quantity,
                    price_at_order,
                    total: itemTotal
                });
            }

            order.items = processedItems;
            order.total_amount = calculatedTotalAmount;
        }

        await order.save();

        const updatedPopulated = await Order.findById(order._id)
            .populate('customer_id')
            .populate('items.product_id');

        return res.status(200).json(updatedPopulated);
    } catch (error) {
        return res.status(400).json({ message: 'Error updating order', error: error.message });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        return res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting order', error: error.message });
    }
};
