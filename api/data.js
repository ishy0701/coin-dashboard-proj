// api/data.js
let total = 0;

export default async function handler(req, res) {
  // Set CORS headers to allow requests from your frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // Return the current total
    try {
      console.log('GET request received. Total:', total);
      res.status(200).json({ total });
    } catch (error) {
      console.error('Error in GET handler:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    // Update the total
    try {
      const { coinCount } = req.body;
      console.log('POST request received. coinCount:', coinCount);
      
      // Validate and parse the input
      const amount = parseFloat(coinCount);
      if (isNaN(amount)) {
        return res.status(400).json({ error: 'Invalid coinCount value' });
      }
      
      // Update the total
      total += amount;
      
      // Ensure total doesn't go negative
      if (total < 0) total = 0;
      
      console.log('New total:', total);
      res.status(200).json({ 
        message: 'Total updated successfully',
        total 
      });
    } catch (error) {
      console.error('Error in POST handler:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
    res.status(405).json({ error: Method ${req.method} Not Allowed });
  }
}