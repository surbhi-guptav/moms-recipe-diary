// fetch_recipes_file.js
import http from 'http';
import fs from 'fs';

const logStream = fs.createWriteStream('debug_output.txt', { flags: 'a' });

function log(msg) {
    console.log(msg);
    logStream.write(msg + '\n');
}

log("Starting request to localhost:5000...");

const req = http.get('http://localhost:5000/api/recipes', (res) => {
    log(`Status Code: ${res.statusCode}`);
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        log('Body: ' + data);
        logStream.end();
    });
});

req.on('error', (err) => {
    log('Error: ' + err.message);
    logStream.end();
});

req.end();
