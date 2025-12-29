// fetch_recipes_http.js
import http from 'http';

console.log("Starting request to localhost:5000...");

const req = http.get('http://localhost:5000/api/recipes', (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Body: ' + data);
    });
});

req.on('error', (err) => {
    console.error('Error: ' + err.message);
});

req.end();
