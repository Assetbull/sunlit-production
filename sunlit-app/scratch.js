const http = require('http');

async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/v1/rfq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectType: 'Residential',
        configMode: 'Appliance',
        location: 'Lekki',
        location_state: 'Lagos',
        budget: 5000000,
        timeline: '30 days',
        appliances: [{ name: 'AC', quantity: 1, wattage: 200 }]
      })
    });
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response:', text);
  } catch (e) {
    console.error(e);
  }
}
test();
