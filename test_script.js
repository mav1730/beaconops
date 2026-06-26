const testRequest = async () => {
  const randomUrl = `https://test-${Date.now()}.com`;
  console.log(`[🧪] Submitting test lead for URL: ${randomUrl}`);

  try {
    const response = await fetch('http://localhost:3000/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: randomUrl })
    });
    
    const status = response.status;
    const json = await response.json();
    
    console.log('\n--- Test Result ---');
    console.log('Response Status:', status);
    console.log('Response Data:', JSON.stringify(json, null, 2));
    
  } catch (error) {
    console.error('Fetch Error:', error);
  }
};

testRequest();
