// Simple login test script
const fetch = require('node-fetch');

async function testLogin() {
  try {
    console.log('🧪 Testing login endpoint...\n');
    
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@gearguard.com',
        password: 'admin123'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Login successful!');
      console.log('\nUser Info:');
      console.log('- Name:', data.user.name);
      console.log('- Email:', data.user.email);
      console.log('- Role:', data.user.role);
      console.log('\nToken:', data.token.substring(0, 50) + '...');
    } else {
      console.log('❌ Login failed!');
      console.log('Error:', data.error);
    }
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    console.log('\nMake sure the backend server is running on port 5000');
  }
}

testLogin();
