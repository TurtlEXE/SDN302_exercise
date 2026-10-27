const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Customer = require('./models/Customer');
const Product = require('./models/Product');
const Order = require('./models/Order');

function convertBson(obj) {
    if (obj === null || obj === undefined) return obj;
    if (Array.isArray(obj)) {
        return obj.map(convertBson);
    }
    if (typeof obj === 'object') {
        if (obj.$oid) {
            return new mongoose.Types.ObjectId(obj.$oid);
        }
        if (obj.$date) {
            return new Date(obj.$date);
        }
        const converted = {};
        for (const key of Object.keys(obj)) {
            converted[key] = convertBson(obj[key]);
        }
        return converted;
    }
    return obj;
}

function findJsonFile(fileName) {
    const candidates = [
        path.join(__dirname, 'data', fileName),
        path.join(__dirname, fileName),
        path.join(__dirname, '..', fileName),
        path.join(__dirname, '..', '..', fileName),
        path.join(process.cwd(), fileName),
        path.join(process.cwd(), 'data', fileName)
    ];

    for (const p of candidates) {
        if (fs.existsSync(p)) {
            return p;
        }
    }
    throw new Error(`Could not find ${fileName} in expected locations.`);
}

async function seedData() {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sdn302-practice-he181857-db';
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(mongoUri);
            console.log(`Connected to MongoDB: ${mongoUri}`);
        }

        const customersPath = findJsonFile('customers.json');
        const productsPath = findJsonFile('products.json');
        const ordersPath = findJsonFile('orders.json');

        const customersRaw = JSON.parse(fs.readFileSync(customersPath, 'utf8'));
        const productsRaw = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
        const ordersRaw = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));

        const customersData = convertBson(customersRaw);
        const productsData = convertBson(productsRaw);
        const ordersData = convertBson(ordersRaw);

        // Clear existing collections
        await Customer.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});

        // Insert new data
        await Customer.insertMany(customersData);
        await Product.insertMany(productsData);
        await Order.insertMany(ordersData);

        console.log(`Imported ${customersData.length} customers`);
        console.log(`Imported ${productsData.length} products`);
        console.log(`Imported ${ordersData.length} orders`);

        // Verification of Order references
        console.log('Verifying Order references to Customer and Product...');
        const orders = await Order.find();
        for (const order of orders) {
            const customer = await Customer.findById(order.customer_id);
            if (!customer) {
                throw new Error(`Order ${order._id} references non-existent Customer: ${order.customer_id}`);
            }
            for (const item of order.items) {
                const product = await Product.findById(item.product_id);
                if (!product) {
                    throw new Error(`Order ${order._id} references non-existent Product: ${item.product_id}`);
                }
            }
        }
        console.log('Verification SUCCESS: All Customer and Product references in Order documents are valid!');
    } catch (error) {
        console.error('Error during data seed:', error);
        throw error;
    }
}

if (require.main === module) {
    seedData()
        .then(() => {
            console.log('Data import and validation completed successfully.');
            process.exit(0);
        })
        .catch((err) => {
            console.error('Data import failed:', err.message);
            process.exit(1);
        });
}

module.exports = seedData;
