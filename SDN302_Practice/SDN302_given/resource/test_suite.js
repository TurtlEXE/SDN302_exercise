process.env.NODE_ENV = 'test';
const http = require('http');
const mongoose = require('mongoose');
const app = require('./server');

let server;
const PORT = 9998;
const BASE_URL = `http://127.0.0.1:${PORT}`;

function request(method, path, body = null, token = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const headers = {};
        let payload = null;

        if (body) {
            payload = JSON.stringify(body);
            headers['Content-Type'] = 'application/json';
            headers['Content-Length'] = Buffer.byteLength(payload);
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(
            {
                hostname: url.hostname,
                port: url.port,
                path: url.pathname + url.search,
                method: method,
                headers: headers
            },
            (res) => {
                let data = '';
                res.on('data', (chunk) => (data += chunk));
                res.on('end', () => {
                    let json = null;
                    try {
                        json = JSON.parse(data);
                    } catch (e) {
                        json = data;
                    }
                    resolve({ status: res.statusCode, body: json, headers: res.headers });
                });
            }
        );

        req.on('error', (err) => reject(err));
        if (payload) {
            req.write(payload);
        }
        req.end();
    });
}

async function runTests() {
    console.log('--- STARTING SDN302 AUTOMATED INTEGRATION TESTS ---');
    let passed = 0;
    let failed = 0;

    function assert(condition, testName, detail = '') {
        if (condition) {
            console.log(`[PASS] ${testName}`);
            passed++;
        } else {
            console.error(`[FAIL] ${testName} - ${detail}`);
            failed++;
        }
    }

    server = app.listen(PORT);
    // Wait for DB connection
    await new Promise((r) => setTimeout(r, 1000));

    try {
        // 1. Welcome endpoint
        const welcome = await request('GET', '/');
        assert(welcome.status === 200 && welcome.body.message, 'GET / returns welcome message');

        // 2. JWT Authentication: POST /auth/tokens
        const invalidLogin = await request('POST', '/auth/tokens', { name: 'storeadmin', pass: 'wrongpass' });
        assert(invalidLogin.status === 401, 'POST /auth/tokens returns 401 for invalid credentials');

        const missingLogin = await request('POST', '/auth/tokens', {});
        assert(missingLogin.status === 401, 'POST /auth/tokens returns 401 for empty credentials');

        const validLogin = await request('POST', '/auth/tokens', { name: 'storeadmin', pass: 'Store@123' });
        assert(validLogin.status === 200 && validLogin.body.token, 'POST /auth/tokens returns 200 & JWT token for valid credentials');
        const token = validLogin.body.token;

        // 3. Protected endpoint check without token
        const noTokenProducts = await request('GET', '/api/products');
        assert(noTokenProducts.status === 401, 'GET /api/products returns 401 when Authorization header is missing');

        const invalidTokenProducts = await request('GET', '/api/products', null, 'invalid.token.here');
        assert(invalidTokenProducts.status === 401, 'GET /api/products returns 401 when token is invalid');

        // 4. Products: GET /api/products
        const getProducts = await request('GET', '/api/products', null, token);
        assert(getProducts.status === 200 && Array.isArray(getProducts.body), 'GET /api/products returns 200 and product array with token');

        // 5. Products: GET /api/products/:id
        const firstProduct = getProducts.body[0];
        const getSingleProduct = await request('GET', `/api/products/${firstProduct._id}`, null, token);
        assert(getSingleProduct.status === 200 && getSingleProduct.body._id === firstProduct._id, 'GET /api/products/:id returns 200 and product');

        const fakeProductId = new mongoose.Types.ObjectId();
        const getNonExistentProduct = await request('GET', `/api/products/${fakeProductId}`, null, token);
        assert(getNonExistentProduct.status === 404, 'GET /api/products/:id returns 404 when product not found');

        // 6. Products: POST /api/products (Validation & Creation)
        const invalidProductPost = await request('POST', '/api/products', { name: 'Test' }, token);
        assert(invalidProductPost.status === 400, 'POST /api/products returns 400 when required fields missing');

        const validProductPost = await request(
            'POST',
            '/api/products',
            {
                name: 'Gaming Mouse Pad',
                price: 250000,
                category: 'Accessories',
                stock: 15
            },
            token
        );
        assert(validProductPost.status === 201 && validProductPost.body.name === 'Gaming Mouse Pad', 'POST /api/products creates product with 201');
        const createdProductId = validProductPost.body._id;

        // 7. Products: PUT /api/products/:id
        const updateProduct = await request(
            'PUT',
            `/api/products/${createdProductId}`,
            {
                price: 300000,
                stock: 25
            },
            token
        );
        assert(updateProduct.status === 200 && updateProduct.body.price === 300000 && updateProduct.body.stock === 25, 'PUT /api/products/:id updates product');

        const update404Product = await request('PUT', `/api/products/${fakeProductId}`, { price: 100 }, token);
        assert(update404Product.status === 404, 'PUT /api/products/:id returns 404 if not found');

        // 8. Products: DELETE /api/products/:id (Referenced by order check)
        // firstProduct is referenced by orders in initial seed
        const deleteReferencedProduct = await request('DELETE', `/api/products/${firstProduct._id}`, null, token);
        assert(deleteReferencedProduct.status === 409, 'DELETE /api/products/:id returns 409 when product is referenced by an Order');

        // Delete unreferenced product
        const deleteUnreferenced = await request('DELETE', `/api/products/${createdProductId}`, null, token);
        assert(deleteUnreferenced.status === 200, 'DELETE /api/products/:id succeeds (200) for unreferenced product');

        // 9. Orders: GET /api/orders
        const getOrders = await request('GET', '/api/orders', null, token);
        assert(
            getOrders.status === 200 &&
            Array.isArray(getOrders.body) &&
            getOrders.body[0].customer_id &&
            getOrders.body[0].customer_id.name &&
            getOrders.body[0].items[0].product_id &&
            getOrders.body[0].items[0].product_id.name,
            'GET /api/orders returns 200 and populated customer & product details'
        );

        // 10. Orders: GET /api/orders/:id
        const firstOrder = getOrders.body[0];
        const getSingleOrder = await request('GET', `/api/orders/${firstOrder._id}`, null, token);
        assert(getSingleOrder.status === 200 && getSingleOrder.body._id === firstOrder._id, 'GET /api/orders/:id returns 200 and order');

        const fakeOrderId = new mongoose.Types.ObjectId();
        const get404Order = await request('GET', `/api/orders/${fakeOrderId}`, null, token);
        assert(get404Order.status === 404, 'GET /api/orders/:id returns 404 when order not found');

        // 11. Orders: POST /api/orders
        // Test invalid customer
        const invalidCustomerOrder = await request(
            'POST',
            '/api/orders',
            {
                customer_id: new mongoose.Types.ObjectId(),
                items: [{ product_id: firstProduct._id, quantity: 1 }],
                payment_method: 'COD',
                status: 'Pending'
            },
            token
        );
        assert(invalidCustomerOrder.status === 400, 'POST /api/orders returns 400 for non-existent customer');

        // Test quantity exceeds stock
        const exceedStockOrder = await request(
            'POST',
            '/api/orders',
            {
                customer_id: firstOrder.customer_id._id,
                items: [{ product_id: firstProduct._id, quantity: 999999 }],
                payment_method: 'COD',
                status: 'Pending'
            },
            token
        );
        assert(exceedStockOrder.status === 400, 'POST /api/orders returns 400 when quantity exceeds available stock');

        // Test server calculates totals (client attempts to send fraudulent total)
        const validOrderPayload = {
            customer_id: firstOrder.customer_id._id,
            items: [
                {
                    product_id: firstProduct._id,
                    quantity: 2,
                    price_at_order: 1, // Fraudulent price sent by client
                    total: 2 // Fraudulent total sent by client
                }
            ],
            total_amount: 10, // Fraudulent total_amount sent by client
            payment_method: 'Credit Card',
            status: 'Processing',
            order_date: new Date().toISOString()
        };

        const createOrderRes = await request('POST', '/api/orders', validOrderPayload, token);
        const expectedTotal = firstProduct.price * 2;
        assert(
            createOrderRes.status === 201 &&
            createOrderRes.body.total_amount === expectedTotal &&
            createOrderRes.body.items[0].price_at_order === firstProduct.price &&
            createOrderRes.body.items[0].total === expectedTotal,
            `POST /api/orders calculates price_at_order (${firstProduct.price}) and total_amount (${expectedTotal}) strictly on server`
        );
        const createdOrderId = createOrderRes.body._id;

        // 12. Orders: PUT /api/orders/:id
        const updateOrderRes = await request(
            'PUT',
            `/api/orders/${createdOrderId}`,
            {
                status: 'Completed'
            },
            token
        );
        assert(updateOrderRes.status === 200 && updateOrderRes.body.status === 'Completed', 'PUT /api/orders/:id updates order status');

        // 13. Orders: DELETE /api/orders/:id
        const deleteOrderRes = await request('DELETE', `/api/orders/${createdOrderId}`, null, token);
        assert(deleteOrderRes.status === 200, 'DELETE /api/orders/:id returns 200 and deletes order');

        const getDeletedOrder = await request('GET', `/api/orders/${createdOrderId}`, null, token);
        assert(getDeletedOrder.status === 404, 'GET /api/orders/:id on deleted order returns 404');
    } catch (err) {
        console.error('Test execution error:', err);
        failed++;
    } finally {
        server.close();
        await mongoose.connection.close();
    }

    console.log(`\n========================================`);
    console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log(`========================================\n`);

    if (failed > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
}

runTests();
