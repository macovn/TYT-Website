
async function test() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('--- TEST 1: API ADMIN (No login) ---');
  try {
    const res = await fetch(`${baseUrl}/api/create-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'hacker@test.com', password: 'password123', role: 'admin' })
    });
    console.log(`Status: ${res.status}`);
    const data = await res.json();
    console.log(`Response: ${JSON.stringify(data)}`);
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }

  console.log('\n--- TEST 2: API ADMIN (Fake token) ---');
  try {
    const res = await fetch(`${baseUrl}/api/create-user`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer fake-token-123'
      },
      body: JSON.stringify({ email: 'hacker@test.com', password: 'password123', role: 'admin' })
    });
    console.log(`Status: ${res.status}`);
    const data = await res.json();
    console.log(`Response: ${JSON.stringify(data)}`);
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }

  console.log('\n--- TEST 3: XSS Sanitization ---');
  // We can't easily test the browser rendering here, but we can test the utility function
  // by importing it if we were in a node environment with the right setup.
  // Instead, I will verify the code logic in the next step.
}

test();
