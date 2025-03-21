const axios = require('axios');

// Replace this with your Render deployment URL
const BASE_URL = 'https://ecommerce-backend-vw7y.onrender.com';

async function testEndpoints() {
    try {
        // Test 1: Check if server is running
        console.log('\n1. Testing server status...');
        const homeResponse = await axios.get(BASE_URL);
        console.log('✅ Server is running:', homeResponse.data);

        // Test 2: Sign up a test user
        console.log('\n2. Testing signup...');
        const signupResponse = await axios.post(`${BASE_URL}/signup`, {
            username: 'testuser',
            email: 'test@example.com',
            password: 'testpassword123'
        });
        console.log('✅ Signup successful:', signupResponse.data.success);
        const token = signupResponse.data.token;

        // Test 3: Login with the test user
        console.log('\n3. Testing login...');
        const loginResponse = await axios.post(`${BASE_URL}/login`, {
            email: 'test@example.com',
            password: 'testpassword123'
        });
        console.log('✅ Login successful:', loginResponse.data.success);

        // Test 4: Get all products
        console.log('\n4. Testing products endpoint...');
        const productsResponse = await axios.get(`${BASE_URL}/allproducts`);
        console.log('✅ Products fetched:', productsResponse.data.length, 'products found');

        // Test 5: Get new collection
        console.log('\n5. Testing new collection endpoint...');
        const newCollectionResponse = await axios.get(`${BASE_URL}/newcollection`);
        console.log('✅ New collection fetched:', newCollectionResponse.data.length, 'products found');

    } catch (error) {
        console.error('❌ Error during testing:', error.response?.data || error.message);
    }
}

// Run the tests
console.log('Starting deployment tests...');
testEndpoints(); 