import http from 'http';

const endpoints = [
    { method: 'GET', path: '/api/users' },
    { method: 'GET', path: '/api/videos' },
    { method: 'GET', path: '/api/clips' },
    { method: 'GET', path: '/api/subscriptions/me' },
    { method: 'GET', path: '/api/usage' },
    { method: 'POST', path: '/api/auth/register', data: JSON.stringify({ name: 'test', email: 'test1@test.com', password: 'password123' }) },
];

async function runTests() {
    for (const ep of endpoints) {
        console.log(`\nTesting ${ep.method} ${ep.path}...`);
        
        try {
            const response = await fetch(`http://localhost:5000${ep.path}`, {
                method: ep.method,
                headers: { 'Content-Type': 'application/json' },
                body: ep.data ? ep.data : undefined
            });
            const text = await response.text();
            console.log(`Status: ${response.status}`);
            console.log(`Response: ${text.substring(0, 50)}...`);
        } catch (err) {
            console.error(`Failed: ${err.message}`);
        }
    }
}

runTests();
